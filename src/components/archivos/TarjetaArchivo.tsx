import React from 'react';
import { Download, Trash2, Calendar, HardDrive, Eye, Edit3, Link2 } from 'lucide-react';
import { obtenerConfiguracionArchivo } from '../../utils/fileIcons';
import { formatearTamano, formatearFecha } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import type { Archivo } from '../../types';

interface TarjetaArchivoProps {
  archivo: Archivo;
  alDescargar: (archivo: Archivo) => void;
  alSolicitarEliminar: (archivo: Archivo) => void;
  alVerVistaPrevia?: (archivo: Archivo) => void;
  alRenombrar?: (archivo: Archivo) => void;
  alCopiarEnlace?: (archivo: Archivo) => void;
}

export const TarjetaArchivo: React.FC<TarjetaArchivoProps> = ({
  archivo,
  alDescargar,
  alSolicitarEliminar,
  alVerVistaPrevia,
  alRenombrar,
  alCopiarEnlace,
}) => {
  const config = obtenerConfiguracionArchivo(archivo.extension, archivo.tipo_archivo);
  const Icono = config.icono;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-xs transition-all space-y-3">
      <div className="flex items-start gap-3">
        {/* Icono del archivo */}
        <div
          onClick={() => alVerVistaPrevia?.(archivo)}
          className={`w-11 h-11 rounded-xl ${config.colorFondo} ${config.colorTexto} flex items-center justify-center shrink-0 shadow-2xs cursor-pointer hover:opacity-80 transition-opacity`}
          title="Ver vista previa"
        >
          <Icono className="w-5 h-5" />
        </div>

        {/* Nombre y badge de tipo */}
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => alVerVistaPrevia?.(archivo)}
            className="text-sm font-semibold text-slate-800 hover:text-sky-600 transition-colors truncate block text-left w-full cursor-pointer"
            title={archivo.nombre_archivo}
          >
            {archivo.nombre_archivo}
          </button>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="sky" size="sm">
              {config.etiquetaTipo}
            </Badge>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              {formatearTamano(archivo.tamano_bytes)}
            </span>
          </div>
        </div>
      </div>

      {/* Descripción opcional */}
      {archivo.descripcion && (
        <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl line-clamp-2 border border-slate-100">
          {archivo.descripcion}
        </p>
      )}

      {/* Fecha y acciones */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatearFecha(archivo.fecha_subida)}
        </span>

        <div className="flex items-center gap-0.5">
          {alVerVistaPrevia && (
            <button
              onClick={() => alVerVistaPrevia(archivo)}
              className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
              title="Vista previa"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {alRenombrar && (
            <button
              onClick={() => alRenombrar(archivo)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Renombrar archivo"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          {alCopiarEnlace && (
            <button
              onClick={() => alCopiarEnlace(archivo)}
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              title="Copiar enlace directo"
            >
              <Link2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => alDescargar(archivo)}
            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
            title="Descargar archivo"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => alSolicitarEliminar(archivo)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Eliminar archivo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
