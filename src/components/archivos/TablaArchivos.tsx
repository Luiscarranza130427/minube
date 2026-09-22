import React from 'react';
import { Download, Trash2, Eye, Edit3, Link2 } from 'lucide-react';
import { obtenerConfiguracionArchivo } from '../../utils/fileIcons';
import { formatearTamano, formatearFecha } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import type { Archivo } from '../../types';

interface TablaArchivosProps {
  archivos: Archivo[];
  alDescargar: (archivo: Archivo) => void;
  alSolicitarEliminar: (archivo: Archivo) => void;
  alVerVistaPrevia?: (archivo: Archivo) => void;
  alRenombrar?: (archivo: Archivo) => void;
  alCopiarEnlace?: (archivo: Archivo) => void;
}

export const TablaArchivos: React.FC<TablaArchivosProps> = ({
  archivos,
  alDescargar,
  alSolicitarEliminar,
  alVerVistaPrevia,
  alRenombrar,
  alCopiarEnlace,
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
                        onClick={() => alVerVistaPrevia?.(archivo)}
                        className={`w-10 h-10 rounded-xl ${config.colorFondo} ${config.colorTexto} flex items-center justify-center shrink-0 shadow-2xs cursor-pointer hover:opacity-80 transition-opacity`}
                        title="Ver vista previa"
                      >
                        <Icono className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 max-w-xs md:max-w-md">
                        <button
                          type="button"
                          onClick={() => alVerVistaPrevia?.(archivo)}
                          className="font-medium text-slate-800 hover:text-sky-600 transition-colors truncate block text-left max-w-full cursor-pointer"
                          title={archivo.nombre_archivo}
                        >
                          {archivo.nombre_archivo}
                        </button>
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
                    <div className="flex items-center justify-end gap-1">
                      {/* Vista Previa */}
                      {alVerVistaPrevia && (
                        <button
                          onClick={() => alVerVistaPrevia(archivo)}
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                          title="Vista previa rápida"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {/* Renombrar */}
                      {alRenombrar && (
                        <button
                          onClick={() => alRenombrar(archivo)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Renombrar archivo"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}

                      {/* Copiar enlace */}
                      {alCopiarEnlace && (
                        <button
                          onClick={() => alCopiarEnlace(archivo)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Copiar enlace directo"
                        >
                          <Link2 className="w-4 h-4" />
                        </button>
                      )}

                      {/* Descargar */}
                      <button
                        onClick={() => alDescargar(archivo)}
                        className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                        title="Descargar archivo"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* Eliminar */}
                      <button
                        onClick={() => alSolicitarEliminar(archivo)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar archivo"
                      >
                        <Trash2 className="w-4 h-4" />
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
