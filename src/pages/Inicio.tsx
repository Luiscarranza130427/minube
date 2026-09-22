import React, { useState } from 'react';
import {
  Files,
  HardDrive,
  Clock,
  Plus,
  ArrowRight,
  Download,
  Trash2,
  Eye,
  Link2,
  PieChart,
} from 'lucide-react';
import { useArchivos } from '../hooks/useArchivos';
import { formatearTamano, formatearFecha, formatearFechaRelativa } from '../utils/formatters';
import { obtenerConfiguracionArchivo } from '../utils/fileIcons';
import {
  confirmarEliminacionArchivo,
  mostrarToastExito,
  mostrarToastError,
  mostrarToastInfo,
} from '../utils/alertas';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ModalSubirArchivo } from '../components/archivos/ModalSubirArchivo';
import { ModalVistaPrevia } from '../components/archivos/ModalVistaPrevia';
import { NavLink } from 'react-router-dom';
import type { Archivo } from '../types';

export const Inicio: React.FC = () => {
  const { archivos, estadisticas, descargarArchivo, eliminarArchivo, obtenerUrlPublica } = useArchivos();

  const [modalSubirAbierto, setModalSubirAbierto] = useState<boolean>(false);
  const [archivoVistaPrevia, setArchivoVistaPrevia] = useState<Archivo | null>(null);

  // Tomar los últimos 4 archivos recientes
  const archivosRecientes = archivos.slice(0, 4);

  const handleDescargar = async (archivo: Archivo) => {
    mostrarToastInfo(`Descargando ${archivo.nombre_archivo}...`);
    await descargarArchivo(archivo);
  };

  const handleCopiarEnlace = async (archivo: Archivo) => {
    const url = obtenerUrlPublica(archivo);
    if (url) {
      try {
        await navigator.clipboard.writeText(url);
        mostrarToastExito('¡Enlace público copiado al portapapeles!');
      } catch {
        mostrarToastInfo('No se pudo copiar automáticamente.');
      }
    } else {
      mostrarToastInfo('Disponible en conexión con Supabase Storage.');
    }
  };

  const handleEliminar = async (archivo: Archivo) => {
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

  return (
    <div className="space-y-6">
      {/* Sección de bienvenida */}
      <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-sky-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-sky-100/90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
            Panel de control
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gestiona tus archivos desde la nube
          </h1>
          <p className="text-sm text-sky-100">
            Almacenamiento seguro en la nube conectado con Supabase Auth, PostgreSQL y Storage.
          </p>
        </div>

        <Button
          variant="secondary"
          size="lg"
          onClick={() => setModalSubirAbierto(true)}
          icono={<Plus className="w-5 h-5 text-sky-600" />}
          className="bg-white text-sky-700 hover:bg-sky-50 shadow-md font-semibold shrink-0"
        >
          Subir archivos
        </Button>
      </div>

      {/* Estadísticas sencillas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* TOTAL DE ARCHIVOS */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Files className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              TOTAL DE ARCHIVOS
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">
              {estadisticas.totalArchivos}
            </p>
          </div>
        </Card>

        {/* ESPACIO UTILIZADO */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              ESPACIO UTILIZADO
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5 font-mono">
              {formatearTamano(estadisticas.espacioUtilizadoBytes)}
            </p>
          </div>
        </Card>

        {/* ÚLTIMA SUBIDA */}
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              ÚLTIMA SUBIDA
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">
              {formatearFechaRelativa(estadisticas.ultimaSubida)}
            </p>
          </div>
        </Card>
      </div>

      {/* Desglose visual de almacenamiento por categorías */}
      {estadisticas.totalArchivos > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Distribución de almacenamiento
                </h3>
                <p className="text-xs text-slate-400">
                  Espacio consumido clasificado por tipo de contenido
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              {formatearTamano(estadisticas.espacioUtilizadoBytes)} / 500 MB (Cuota Demo)
            </span>
          </div>

          {/* Barra segmentada multicolor */}
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            {estadisticas.desgloseCategorias.map((cat, i) => {
              if (cat.bytes === 0) return null;
              return (
                <div
                  key={cat.categoria}
                  style={{
                    width: `${cat.porcentaje}%`,
                    backgroundColor: cat.color,
                  }}
                  title={`${cat.categoria}: ${formatearTamano(cat.bytes)} (${cat.porcentaje}%)`}
                  className={`h-full transition-all duration-300 ${
                    i === 0 ? 'rounded-l-full' : ''
                  }`}
                />
              );
            })}
          </div>

          {/* Leyenda con indicadores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {estadisticas.desgloseCategorias.map((cat) => (
              <div
                key={cat.categoria}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/60 border border-slate-100"
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: cat.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-700 truncate">
                    {cat.categoria}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {formatearTamano(cat.bytes)} ({cat.cantidad})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección Archivos Recientes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Archivos recientes</h2>
            <p className="text-xs text-slate-500">Los últimos documentos cargados en tu nube</p>
          </div>

          <NavLink
            to="/archivos"
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
          >
            <span>Ver todos los archivos</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </NavLink>
        </div>

        {archivosRecientes.length === 0 ? (
          <Card className="text-center py-10 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <Files className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">No hay archivos recientes</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Empieza a almacenar documentos, fotos y reportes subiendo tu primer archivo.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalSubirAbierto(true)}
              icono={<Plus className="w-4 h-4 text-sky-600" />}
            >
              Subir mi primer archivo
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {archivosRecientes.map((archivo) => {
              const config = obtenerConfiguracionArchivo(archivo.extension, archivo.tipo_archivo);
              const Icono = config.icono;

              return (
                <div
                  key={archivo.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div
                      onClick={() => setArchivoVistaPrevia(archivo)}
                      className={`w-11 h-11 rounded-xl ${config.colorFondo} ${config.colorTexto} flex items-center justify-center shrink-0 shadow-2xs cursor-pointer hover:opacity-80 transition-opacity`}
                      title="Ver vista previa"
                    >
                      <Icono className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => setArchivoVistaPrevia(archivo)}
                        className="text-sm font-semibold text-slate-800 hover:text-sky-600 transition-colors truncate block text-left w-full cursor-pointer"
                        title={archivo.nombre_archivo}
                      >
                        {archivo.nombre_archivo}
                      </button>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="sky" size="sm">
                          {config.etiquetaTipo}
                        </Badge>
                        <span className="text-xs text-slate-400 font-mono">
                          {formatearTamano(archivo.tamano_bytes)}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-400">
                          {formatearFecha(archivo.fecha_subida)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => setArchivoVistaPrevia(archivo)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                      title="Vista previa rápida"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopiarEnlace(archivo)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Copiar enlace"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDescargar(archivo)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                      title="Descargar archivo"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEliminar(archivo)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar archivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para subir archivo */}
      <ModalSubirArchivo
        abierto={modalSubirAbierto}
        alCerrar={() => setModalSubirAbierto(false)}
      />

      {/* Modal de Vista Previa */}
      <ModalVistaPrevia
        archivo={archivoVistaPrevia}
        alCerrar={() => setArchivoVistaPrevia(null)}
      />
    </div>
  );
};
