import React, { useState } from 'react';
import {
  Files,
  HardDrive,
  Clock,
  Plus,
  ArrowRight,
  Download,
  Trash2,
} from 'lucide-react';
import { useArchivos } from '../hooks/useArchivos';
import { formatearTamano, formatearFecha, formatearFechaRelativa } from '../utils/formatters';
import { obtenerConfiguracionArchivo } from '../utils/fileIcons';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ModalSubirArchivo } from '../components/archivos/ModalSubirArchivo';
import { ModalEliminarArchivo } from '../components/archivos/ModalEliminarArchivo';
import { NavLink } from 'react-router-dom';
import type { Archivo } from '../types';

export const Inicio: React.FC = () => {
  const { archivos, estadisticas, descargarArchivo, eliminarArchivo } = useArchivos();

  const [modalSubirAbierto, setModalSubirAbierto] = useState(false);
  const [archivoAEliminar, setArchivoAEliminar] = useState<Archivo | null>(null);
  const [eliminando, setEliminando] = useState(false);

  // Tomar los últimos 4 archivos recientes
  const archivosRecientes = archivos.slice(0, 4);

  const handleConfirmarEliminacion = async () => {
    if (!archivoAEliminar) return;
    setEliminando(true);
    await eliminarArchivo(archivoAEliminar.id);
    setEliminando(false);
    setArchivoAEliminar(null);
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
          Subir archivo
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
                      className={`w-11 h-11 rounded-xl ${config.colorFondo} ${config.colorTexto} flex items-center justify-center shrink-0 shadow-2xs`}
                    >
                      <Icono className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-semibold text-slate-800 truncate"
                        title={archivo.nombre_archivo}
                      >
                        {archivo.nombre_archivo}
                      </p>
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

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => descargarArchivo(archivo)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                      title="Descargar archivo"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setArchivoAEliminar(archivo)}
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

      {/* Modal de confirmación para eliminar */}
      <ModalEliminarArchivo
        archivo={archivoAEliminar}
        alCerrar={() => setArchivoAEliminar(null)}
        alConfirmar={handleConfirmarEliminacion}
        eliminando={eliminando}
      />
    </div>
  );
};
