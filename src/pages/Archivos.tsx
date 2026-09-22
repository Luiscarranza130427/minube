import React, { useState, useMemo } from 'react';
import { Plus, CloudOff, Inbox } from 'lucide-react';
import { useArchivos } from '../hooks/useArchivos';
import { clasificarArchivo } from '../utils/formatters';
import {
  confirmarEliminacionArchivo,
  mostrarToastExito,
  mostrarToastError,
  mostrarToastInfo,
} from '../utils/alertas';
import { BuscadorArchivos } from '../components/archivos/BuscadorArchivos';
import { TablaArchivos } from '../components/archivos/TablaArchivos';
import { TarjetaArchivo } from '../components/archivos/TarjetaArchivo';
import { ModalSubirArchivo } from '../components/archivos/ModalSubirArchivo';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import type { Archivo, CategoriaFiltro } from '../types';

export const Archivos: React.FC = () => {
  const { archivos, cargando, descargarArchivo, eliminarArchivo } = useArchivos();

  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroActivo, setFiltroActivo] = useState<CategoriaFiltro>('todos');
  const [modalSubirAbierto, setModalSubirAbierto] = useState<boolean>(false);

  // Filtrado reactivo en tiempo real
  const archivosFiltrados = useMemo(() => {
    return archivos.filter((archivo) => {
      // Filtro por categoría
      if (filtroActivo !== 'todos') {
        const categoria = clasificarArchivo(archivo.extension, archivo.tipo_archivo);
        if (categoria !== filtroActivo) return false;
      }

      // Filtro por búsqueda de texto
      if (busqueda.trim() !== '') {
        const termino = busqueda.toLowerCase().trim();
        const coincideNombre = archivo.nombre_archivo.toLowerCase().includes(termino);
        const coincideDesc = (archivo.descripcion || '').toLowerCase().includes(termino);
        const coincideExt = archivo.extension.toLowerCase().includes(termino);
        if (!coincideNombre && !coincideDesc && !coincideExt) return false;
      }

      return true;
    });
  }, [archivos, busqueda, filtroActivo]);

  const handleSolicitarEliminar = async (archivo: Archivo) => {
    const confirmado = await confirmarEliminacionArchivo(archivo.nombre_archivo);
    if (confirmado) {
      const res = await eliminarArchivo(archivo.id);
      if (res.exito) {
        mostrarToastExito('Archivo eliminado correctamente');
      } else {
        mostrarToastError(res.error || 'No se pudo eliminar el archivo');
      }
    }
  };

  const handleDescargar = async (archivo: Archivo) => {
    mostrarToastInfo(`Descargando ${archivo.nombre_archivo}...`);
    await descargarArchivo(archivo);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Mis archivos
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Administra los archivos almacenados en tu nube.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setModalSubirAbierto(true)}
          icono={<Plus className="w-4 h-4" />}
          className="shadow-md shadow-sky-500/20 shrink-0"
        >
          + Subir archivo
        </Button>
      </div>

      {/* Barra de búsqueda y selector de filtros */}
      <BuscadorArchivos
        busqueda={busqueda}
        alCambiarBusqueda={setBusqueda}
        filtroActivo={filtroActivo}
        alCambiarFiltro={setFiltroActivo}
      />

      {/* Estados de carga: Skeletons */}
      {cargando ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      ) : archivos.length === 0 ? (
        /* Estado vacío principal cuando no hay ningún archivo */
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-10 sm:p-14 text-center max-w-md mx-auto my-8 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-sky-50 text-sky-500 flex items-center justify-center shadow-xs">
            <CloudOff className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Tu nube está vacía</h3>
            <p className="text-sm text-slate-500 mt-1">
              Aún no has subido ningún archivo.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setModalSubirAbierto(true)}
            icono={<Plus className="w-4 h-4" />}
            className="shadow-sm"
          >
            Subir mi primer archivo
          </Button>
        </div>
      ) : archivosFiltrados.length === 0 ? (
        /* Estado cuando la búsqueda o filtro no produce coincidencias */
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-700">
            No se encontraron archivos
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            No hay elementos que coincidan con la búsqueda o el filtro seleccionado.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setBusqueda('');
              setFiltroActivo('todos');
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      ) : (
        /* Listado de archivos: Tabla en escritorio y Tarjetas en móvil */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Mostrando <strong>{archivosFiltrados.length}</strong> de {archivos.length} archivos
            </span>
          </div>

          {/* Versión Escritorio (Tabla) */}
          <div className="hidden md:block">
            <TablaArchivos
              archivos={archivosFiltrados}
              alDescargar={handleDescargar}
              alSolicitarEliminar={handleSolicitarEliminar}
            />
          </div>

          {/* Versión Móvil / Tablet pequeña (Tarjetas) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {archivosFiltrados.map((archivo) => (
              <TarjetaArchivo
                key={archivo.id}
                archivo={archivo}
                alDescargar={handleDescargar}
                alSolicitarEliminar={handleSolicitarEliminar}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal para subir archivo */}
      <ModalSubirArchivo
        abierto={modalSubirAbierto}
        alCerrar={() => setModalSubirAbierto(false)}
      />
    </div>
  );
};
