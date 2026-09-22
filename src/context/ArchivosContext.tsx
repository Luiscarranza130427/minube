import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, estaConfiguradoSupabase, BUCKET_ARCHIVOS } from '../services/supabase';
import { MOCK_ARCHIVOS } from '../mocks/mockData';
import { useAuth } from './AuthContext';
import type { Archivo, EstadisticasArchivos, DesgloseCategoria } from '../types';

interface ArchivosContextType {
  archivos: Archivo[];
  cargando: boolean;
  progresoSubida: number;
  subiendo: boolean;
  subirArchivo: (archivoFisico: File, descripcion?: string) => Promise<{ exito: boolean; error?: string }>;
  subirMultiplesArchivos: (archivosFisicos: File[], descripcion?: string) => Promise<{ exito: boolean; subidos: number; errores?: string[] }>;
  eliminarArchivo: (id: string) => Promise<{ exito: boolean; error?: string }>;
  renombrarArchivo: (id: string, nuevoNombre: string) => Promise<{ exito: boolean; error?: string }>;
  descargarArchivo: (archivo: Archivo) => Promise<void>;
  obtenerUrlPublica: (archivo: Archivo) => string;
  obtenerUrlFirmada: (archivo: Archivo, segundos?: number) => Promise<string | null>;
  estadisticas: EstadisticasArchivos;
  recargarArchivos: () => Promise<void>;
}

const ArchivosContext = createContext<ArchivosContextType | undefined>(undefined);

const CLAVE_LOCAL_STORAGE = 'minube_archivos_demo';

export const ArchivosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario } = useAuth();
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [progresoSubida, setProgresoSubida] = useState<number>(0);
  const [subiendo, setSubiendo] = useState<boolean>(false);

  const cargarArchivos = async () => {
    if (!usuario) {
      setArchivos([]);
      setCargando(false);
      return;
    }

    setCargando(true);
    try {
      if (estaConfiguradoSupabase) {
        // Consulta a PostgreSQL con RLS
        const { data, error } = await supabase
          .from('archivos')
          .select('*')
          .eq('usuario_id', usuario.id)
          .order('fecha_subida', { ascending: false });

        if (error) throw error;
        setArchivos(data as Archivo[]);
      } else {
        // Modo demostración: recuperar de localStorage o inicializar con MOCK_ARCHIVOS
        const guardados = localStorage.getItem(CLAVE_LOCAL_STORAGE);
        if (guardados) {
          try {
            setArchivos(JSON.parse(guardados));
          } catch {
            setArchivos(MOCK_ARCHIVOS);
          }
        } else {
          setArchivos(MOCK_ARCHIVOS);
          localStorage.setItem(CLAVE_LOCAL_STORAGE, JSON.stringify(MOCK_ARCHIVOS));
        }
      }
    } catch (err) {
      console.error('Error al cargar archivos:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarArchivos();
  }, [usuario]);

  // Subir archivo a Supabase Storage y registrar metadatos en PostgreSQL
  const subirArchivo = async (
    archivoFisico: File,
    descripcion?: string
  ): Promise<{ exito: boolean; error?: string }> => {
    if (!usuario) return { exito: false, error: 'No hay sesión de usuario activa' };

    setSubiendo(true);
    setProgresoSubida(10);

    const timestamp = Date.now();
    const extension = '.' + (archivoFisico.name.split('.').pop()?.toLowerCase() || '');
    const puntoIndex = archivoFisico.name.lastIndexOf('.');
    const nombreSinExt = puntoIndex !== -1 ? archivoFisico.name.substring(0, puntoIndex) : archivoFisico.name;
    const nombreSanitizado = nombreSinExt
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const nombreAlmacenamiento = `${usuario.id}/${timestamp}_${nombreSanitizado}${extension}`;
    const rutaAlmacenamiento = `${BUCKET_ARCHIVOS}/${nombreAlmacenamiento}`;

    try {
      if (estaConfiguradoSupabase) {
        // Simular progreso inicial
        setProgresoSubida(30);

        // 1. Subir a Supabase Storage (con upsert y reintento resiliente)
        let intento = 0;
        let storageError: { message?: string } | null = null;
        let subidaOk = false;

        while (intento < 2 && !subidaOk) {
          intento++;
          const { error } = await supabase.storage
            .from(BUCKET_ARCHIVOS)
            .upload(nombreAlmacenamiento, archivoFisico, {
              cacheControl: '3600',
              upsert: true,
            });

          if (!error) {
            subidaOk = true;
            storageError = null;
          } else {
            storageError = error;
            if (error.message?.toLowerCase().includes('failed to fetch') && intento < 2) {
              await new Promise((r) => setTimeout(r, 800));
            } else {
              break;
            }
          }
        }

        if (storageError) {
          const msg = storageError.message?.toLowerCase() || '';
          if (msg.includes('row-level security') || msg.includes('policy') || msg.includes('violates')) {
            throw new Error(
              'Permiso denegado por RLS en Supabase Storage (bucket "archivos-personales"). Ejecuta el script supabase_storage_policies.sql en tu SQL Editor de Supabase.'
            );
          }
          if (msg.includes('failed to fetch')) {
            throw new Error(
              'Error de red con Supabase (Failed to fetch). Comprueba tu conexión a internet y vuelve a intentar.'
            );
          }
          throw new Error(`Error en Supabase Storage: ${storageError.message || 'Error desconocido'}`);
        }

        setProgresoSubida(75);

        // 2. Insertar metadatos en tabla 'archivos' de PostgreSQL
        const ahora = new Date().toISOString();
        const nuevoRegistro: Omit<Archivo, 'id'> = {
          usuario_id: usuario.id,
          nombre_archivo: archivoFisico.name,
          nombre_almacenamiento: nombreAlmacenamiento,
          extension: extension,
          tipo_archivo: archivoFisico.type || 'application/octet-stream',
          tamano_bytes: archivoFisico.size,
          ruta_almacenamiento: rutaAlmacenamiento,
          descripcion: descripcion?.trim() || null,
          fecha_subida: ahora,
          fecha_actualizacion: ahora,
        };

        const { data: dbData, error: dbError } = await supabase
          .from('archivos')
          .insert(nuevoRegistro)
          .select()
          .single();

        if (dbError) {
          throw new Error(`Error en PostgreSQL: ${dbError.message}`);
        }

        setProgresoSubida(100);
        setArchivos((prev) => [dbData as Archivo, ...prev]);
        return { exito: true };
      } else {
        // Modo demostración: simulación de subida con progreso suave
        for (let p = 20; p <= 90; p += 25) {
          await new Promise((r) => setTimeout(r, 120));
          setProgresoSubida(p);
        }

        await new Promise((r) => setTimeout(r, 150));
        setProgresoSubida(100);

        const ahora = new Date().toISOString();
        const nuevoArchivo: Archivo = {
          id: `arch-${timestamp}`,
          usuario_id: usuario.id,
          nombre_archivo: archivoFisico.name,
          nombre_almacenamiento: nombreAlmacenamiento,
          extension: extension,
          tipo_archivo: archivoFisico.type || 'application/octet-stream',
          tamano_bytes: archivoFisico.size,
          ruta_almacenamiento: rutaAlmacenamiento,
          descripcion: descripcion?.trim() || null,
          fecha_subida: ahora,
          fecha_actualizacion: ahora,
        };

        const nuevos = [nuevoArchivo, ...archivos];
        setArchivos(nuevos);
        localStorage.setItem(CLAVE_LOCAL_STORAGE, JSON.stringify(nuevos));

        return { exito: true };
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error inesperado al subir archivo';
      return { exito: false, error: errorMsg };
    } finally {
      setTimeout(() => {
        setSubiendo(false);
        setProgresoSubida(0);
      }, 500);
    }
  };

  // Eliminar archivo de Storage y de PostgreSQL
  const eliminarArchivo = async (id: string): Promise<{ exito: boolean; error?: string }> => {
    const archivoEncontrado = archivos.find((a) => a.id === id);
    if (!archivoEncontrado) return { exito: false, error: 'Archivo no encontrado' };

    try {
      if (estaConfiguradoSupabase) {
        // 1. Eliminar de Supabase Storage
        const { error: storageError } = await supabase.storage
          .from(BUCKET_ARCHIVOS)
          .remove([archivoEncontrado.nombre_almacenamiento]);

        if (storageError) {
          console.warn('Advertencia al eliminar de Storage:', storageError.message);
        }

        // 2. Eliminar de la base de datos PostgreSQL
        const { error: dbError } = await supabase
          .from('archivos')
          .delete()
          .eq('id', id);

        if (dbError) throw dbError;
      }

      const nuevos = archivos.filter((a) => a.id !== id);
      setArchivos(nuevos);
      if (!estaConfiguradoSupabase) {
        localStorage.setItem(CLAVE_LOCAL_STORAGE, JSON.stringify(nuevos));
      }

      return { exito: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar archivo';
      return { exito: false, error: errorMsg };
    }
  };

  // Descargar archivo
  const descargarArchivo = async (archivo: Archivo): Promise<void> => {
    try {
      if (estaConfiguradoSupabase) {
        // 1. Intentar descarga directa desde Supabase Storage
        const { data, error } = await supabase.storage
          .from(BUCKET_ARCHIVOS)
          .download(archivo.nombre_almacenamiento);

        if (!error && data) {
          const url = URL.createObjectURL(data);
          const enlace = document.createElement('a');
          enlace.href = url;
          enlace.download = archivo.nombre_archivo;
          document.body.appendChild(enlace);
          enlace.click();
          document.body.removeChild(enlace);
          URL.revokeObjectURL(url);
          return;
        }

        // 2. Fallback: URL pública
        const { data: publicData } = supabase.storage
          .from(BUCKET_ARCHIVOS)
          .getPublicUrl(archivo.nombre_almacenamiento);

        if (publicData?.publicUrl) {
          const enlace = document.createElement('a');
          enlace.href = publicData.publicUrl;
          enlace.download = archivo.nombre_archivo;
          enlace.target = '_blank';
          document.body.appendChild(enlace);
          enlace.click();
          document.body.removeChild(enlace);
          return;
        }
      } else {
        // Descarga simulada en modo demo generando un archivo de texto descriptivo
        const contenidoSimulado = `--- ARCHIVO DESCARGADO DE NUBOX (MODO DEMO ACADÉMICO) ---
Nombre: ${archivo.nombre_archivo}
Tipo: ${archivo.tipo_archivo}
Tamaño: ${archivo.tamano_bytes} bytes
Descripción: ${archivo.descripcion || 'Sin descripción'}
Ruta Storage: ${archivo.ruta_almacenamiento}
Fecha de subida: ${archivo.fecha_subida}
`;
        const blob = new Blob([contenidoSimulado], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = archivo.nombre_archivo;
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error al descargar archivo:', err);
      alert('No se pudo descargar el archivo.');
    }
  };

  // Renombrar archivo (actualiza nombre_archivo en PostgreSQL)
  const renombrarArchivo = async (id: string, nuevoNombre: string): Promise<{ exito: boolean; error?: string }> => {
    const nombreLimpio = nuevoNombre.trim();
    if (!nombreLimpio) return { exito: false, error: 'El nombre no puede estar vacío' };

    try {
      if (estaConfiguradoSupabase) {
        const { error } = await supabase
          .from('archivos')
          .update({
            nombre_archivo: nombreLimpio,
            fecha_actualizacion: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
      }

      const nuevos = archivos.map((a) =>
        a.id === id
          ? {
              ...a,
              nombre_archivo: nombreLimpio,
              fecha_actualizacion: new Date().toISOString(),
            }
          : a
      );
      setArchivos(nuevos);
      if (!estaConfiguradoSupabase) {
        localStorage.setItem(CLAVE_LOCAL_STORAGE, JSON.stringify(nuevos));
      }

      return { exito: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al renombrar archivo';
      return { exito: false, error: msg };
    }
  };

  // Subir múltiples archivos en cola
  const subirMultiplesArchivos = async (
    archivosFisicos: File[],
    descripcion?: string
  ): Promise<{ exito: boolean; subidos: number; errores?: string[] }> => {
    if (!archivosFisicos || archivosFisicos.length === 0) {
      return { exito: false, subidos: 0, errores: ['No se seleccionó ningún archivo'] };
    }

    setSubiendo(true);
    let subidosContador = 0;
    const errores: string[] = [];

    for (let i = 0; i < archivosFisicos.length; i++) {
      const file = archivosFisicos[i];
      setProgresoSubida(Math.round(((i) / archivosFisicos.length) * 100));
      const res = await subirArchivo(file, descripcion);
      if (res.exito) {
        subidosContador++;
      } else {
        errores.push(`${file.name}: ${res.error}`);
      }
    }

    setProgresoSubida(100);
    setTimeout(() => {
      setSubiendo(false);
      setProgresoSubida(0);
    }, 400);

    return {
      exito: subidosContador > 0,
      subidos: subidosContador,
      errores: errores.length > 0 ? errores : undefined,
    };
  };

  // Obtener URL pública directa para previsualización o descarga
  const obtenerUrlPublica = (archivo: Archivo): string => {
    if (estaConfiguradoSupabase) {
      const { data } = supabase.storage
        .from(BUCKET_ARCHIVOS)
        .getPublicUrl(archivo.nombre_almacenamiento);
      return data?.publicUrl || '';
    }
    return '';
  };

  // Obtener enlace firmado temporal con tiempo de expiración
  const obtenerUrlFirmada = async (archivo: Archivo, segundos: number = 60): Promise<string | null> => {
    try {
      if (estaConfiguradoSupabase) {
        const { data, error } = await supabase.storage
          .from(BUCKET_ARCHIVOS)
          .createSignedUrl(archivo.nombre_almacenamiento, segundos);

        if (error) throw error;
        return data?.signedUrl || null;
      }
      return null;
    } catch (err) {
      console.error('Error al generar enlace firmado:', err);
      return null;
    }
  };

  // Cálculo de estadísticas con desglose por categoría
  const totalEspacio = archivos.reduce((total, arch) => total + (arch.tamano_bytes || 0), 0);
  
  const calcularDesglose = (): DesgloseCategoria[] => {
    const totalBytesRef = totalEspacio > 0 ? totalEspacio : 1;
    const categorias = {
      documentos: { bytes: 0, cantidad: 0, color: '#0ea5e9', nombre: 'Documentos' },
      imagenes: { bytes: 0, cantidad: 0, color: '#10b981', nombre: 'Imágenes' },
      texto: { bytes: 0, cantidad: 0, color: '#6366f1', nombre: 'Texto y Código' },
      otros: { bytes: 0, cantidad: 0, color: '#f59e0b', nombre: 'Otros' },
    };

    archivos.forEach((arch) => {
      const ext = (arch.extension || '').toLowerCase();
      if (['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'].includes(ext)) {
        categorias.documentos.bytes += arch.tamano_bytes || 0;
        categorias.documentos.cantidad++;
      } else if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'].includes(ext)) {
        categorias.imagenes.bytes += arch.tamano_bytes || 0;
        categorias.imagenes.cantidad++;
      } else if (['.txt', '.md', '.json', '.js', '.ts', '.html', '.css', '.sql'].includes(ext)) {
        categorias.texto.bytes += arch.tamano_bytes || 0;
        categorias.texto.cantidad++;
      } else {
        categorias.otros.bytes += arch.tamano_bytes || 0;
        categorias.otros.cantidad++;
      }
    });

    return Object.values(categorias).map((c) => ({
      categoria: c.nombre,
      bytes: c.bytes,
      cantidad: c.cantidad,
      color: c.color,
      porcentaje: totalEspacio > 0 ? Math.round((c.bytes / totalBytesRef) * 100) : 0,
    }));
  };

  const estadisticas: EstadisticasArchivos = {
    totalArchivos: archivos.length,
    espacioUtilizadoBytes: totalEspacio,
    ultimaSubida: archivos.length > 0 ? archivos[0].fecha_subida : null,
    desgloseCategorias: calcularDesglose(),
  };

  return (
    <ArchivosContext.Provider
      value={{
        archivos,
        cargando,
        progresoSubida,
        subiendo,
        subirArchivo,
        subirMultiplesArchivos,
        eliminarArchivo,
        renombrarArchivo,
        descargarArchivo,
        obtenerUrlPublica,
        obtenerUrlFirmada,
        estadisticas,
        recargarArchivos: cargarArchivos,
      }}
    >
      {children}
    </ArchivosContext.Provider>
  );
};

export const useArchivos = () => {
  const context = useContext(ArchivosContext);
  if (!context) {
    throw new Error('useArchivos debe ser utilizado dentro de un ArchivosProvider');
  }
  return context;
};
