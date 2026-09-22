import React from 'react';
import { Search, FileText, Image as ImageIcon, Layers, File } from 'lucide-react';
import type { CategoriaFiltro } from '../../types';

interface BuscadorArchivosProps {
  busqueda: string;
  alCambiarBusqueda: (valor: string) => void;
  filtroActivo: CategoriaFiltro;
  alCambiarFiltro: (filtro: CategoriaFiltro) => void;
}

export const BuscadorArchivos: React.FC<BuscadorArchivosProps> = ({
  busqueda,
  alCambiarBusqueda,
  filtroActivo,
  alCambiarFiltro,
}) => {
  const filtros: { id: CategoriaFiltro; etiqueta: string; icono: React.ComponentType<{ className?: string }> }[] = [
    { id: 'todos', etiqueta: 'Todos', icono: Layers },
    { id: 'documentos', etiqueta: 'Documentos', icono: FileText },
    { id: 'imagenes', etiqueta: 'Imágenes', icono: ImageIcon },
    { id: 'otros', etiqueta: 'Otros', icono: File },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      {/* Campo de búsqueda */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => alCambiarBusqueda(e.target.value)}
          placeholder="Buscar archivos..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all shadow-2xs"
        />
      </div>

      {/* Botones de filtro de categorías */}
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
