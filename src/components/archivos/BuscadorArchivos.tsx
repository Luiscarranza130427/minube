import React from 'react';
import {
  Search,
  FileText,
  Image as ImageIcon,
  Layers,
  File,
  FileCode,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react';
import type { CategoriaFiltro, OrdenFiltro } from '../../types';

interface BuscadorArchivosProps {
  busqueda: string;
  alCambiarBusqueda: (valor: string) => void;
  filtroActivo: CategoriaFiltro;
  alCambiarFiltro: (filtro: CategoriaFiltro) => void;
  ordenActivo: OrdenFiltro;
  alCambiarOrden: (orden: OrdenFiltro) => void;
  alExportarCSV?: () => void;
}

export const BuscadorArchivos: React.FC<BuscadorArchivosProps> = ({
  busqueda,
  alCambiarBusqueda,
  filtroActivo,
  alCambiarFiltro,
  ordenActivo,
  alCambiarOrden,
  alExportarCSV,
}) => {
  const filtros: { id: CategoriaFiltro; etiqueta: string; icono: React.ComponentType<{ className?: string }> }[] = [
    { id: 'todos', etiqueta: 'Todos', icono: Layers },
    { id: 'documentos', etiqueta: 'Documentos', icono: FileText },
    { id: 'imagenes', etiqueta: 'Imágenes', icono: ImageIcon },
    { id: 'texto', etiqueta: 'Código / Texto', icono: FileCode },
    { id: 'otros', etiqueta: 'Otros', icono: File },
  ];

  return (
    <div className="space-y-3">
      {/* Fila superior: Barra de búsqueda + Selector de orden + Exportar CSV */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Campo de búsqueda */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => alCambiarBusqueda(e.target.value)}
            placeholder="Buscar por nombre, extensión o descripción..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all shadow-2xs"
          />
        </div>

        {/* Acciones de ordenación y exportación */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Selector de orden */}
          <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-300 transition-colors">
            <ArrowUpDown className="w-3.5 h-3.5 text-sky-600 mr-2 shrink-0" />
            <select
              value={ordenActivo}
              onChange={(e) => alCambiarOrden(e.target.value as OrdenFiltro)}
              className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer pr-1"
            >
              <option value="recientes">Más recientes</option>
              <option value="antiguos">Más antiguos</option>
              <option value="tamano_desc">Mayor tamaño</option>
              <option value="tamano_asc">Menor tamaño</option>
              <option value="nombre_asc">Nombre (A - Z)</option>
              <option value="nombre_desc">Nombre (Z - A)</option>
            </select>
          </div>

          {/* Botón Exportar CSV */}
          {alExportarCSV && (
            <button
              onClick={alExportarCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Descargar inventario en formato CSV (Excel)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Fila inferior: Pestañas de categorías */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 overflow-x-auto">
        {filtros.map((filtro) => {
          const Icono = filtro.icono;
          const esActivo = filtroActivo === filtro.id;
          return (
            <button
              key={filtro.id}
              onClick={() => alCambiarFiltro(filtro.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap ${
                esActivo
                  ? 'bg-white text-sky-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icono className="w-3.5 h-3.5" />
              <span>{filtro.etiqueta}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
