import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface AlertaProps {
  tipo?: 'exito' | 'error' | 'info';
  titulo?: string;
  mensaje: string;
  alCerrar?: () => void;
  className?: string;
}

export const Alerta: React.FC<AlertaProps> = ({
  tipo = 'info',
  titulo,
  mensaje,
  alCerrar,
  className = '',
}) => {
  const estilos = {
    exito: {
      contenedor: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
      icono: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
      botonCerrar: 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100',
    },
    error: {
      contenedor: 'bg-rose-50/80 border-rose-200 text-rose-900',
      icono: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
      botonCerrar: 'text-rose-500 hover:text-rose-700 hover:bg-rose-100',
    },
    info: {
      contenedor: 'bg-sky-50/80 border-sky-200 text-sky-900',
      icono: <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />,
      botonCerrar: 'text-sky-500 hover:text-sky-700 hover:bg-sky-100',
    },
  };

  const actual = estilos[tipo];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border ${actual.contenedor} ${className} transition-all duration-200`}
      role="alert"
    >
      {actual.icono}
      <div className="flex-1 text-sm">
        {titulo && <h4 className="font-semibold mb-0.5">{titulo}</h4>}
        <p className="text-sm leading-relaxed">{mensaje}</p>
      </div>
      {alCerrar && (
        <button
          onClick={alCerrar}
          className={`p-1 rounded-lg transition-colors ${actual.botonCerrar}`}
          title="Cerrar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
