import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { obtenerConfiguracionArchivo } from '../../utils/fileIcons';
import { formatearTamano, formatearFecha } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import type { Archivo } from '../../types';

interface TablaArchivosProps {
  archivos: Archivo[];
  alDescargar: (archivo: Archivo) => void;
  alSolicitarEliminar: (archivo: Archivo) => void;
}

export const TablaArchivos: React.FC<TablaArchivosProps> = ({
  archivos,
  alDescargar,
  alSolicitarEliminar,
}) => {
  return (
    <div className="overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <th className="py-3.5 px-5">Archivo</th>
              <th className="py-3.5 px-4">Tipo</th>
              <th className="py-3.5 px-4">Tamaño</th>
              <th className="py-3.5 px-4">Fecha</th>
              <th className="py-3.5 px-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {archivos.map((archivo) => {
              const config = obtenerConfiguracionArchivo(archivo.extension, archivo.tipo_archivo);
              const Icono = config.icono;

              return (
                <tr
                  key={archivo.id}
                  className="hover:bg-slate-50/80 transition-colors duration-150 group"
                >
                  {/* Nombre y descripción */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl ${config.colorFondo} ${config.colorTexto} flex items-center justify-center shrink-0 shadow-2xs`}
                      >
                        <Icono className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 max-w-xs md:max-w-md">
                        <p
                          className="font-medium text-slate-800 truncate"
                          title={archivo.nombre_archivo}
                        >
                          {archivo.nombre_archivo}
                        </p>
                        {archivo.descripcion && (
                          <p
                            className="text-xs text-slate-400 truncate mt-0.5"
                            title={archivo.descripcion}
                          >
                            {archivo.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Tipo */}
                  <td className="py-3.5 px-4">
                    <Badge variant="sky" size="sm">
                      {config.etiquetaTipo}
                    </Badge>
                  </td>

                  {/* Tamaño */}
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-mono text-xs">
                    {formatearTamano(archivo.tamano_bytes)}
                  </td>

                  {/* Fecha */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-xs">
                    {formatearFecha(archivo.fecha_subida)}
                  </td>

                  {/* Acciones */}
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => alDescargar(archivo)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                        title="Descargar archivo"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden xl:inline">Descargar</span>
                      </button>
                      <button
                        onClick={() => alSolicitarEliminar(archivo)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar archivo"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden xl:inline">Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
