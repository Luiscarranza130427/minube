import React from 'react';

interface ProgressBarProps {
  progreso: number; // 0 a 100
  etiqueta?: string;
  mostrarPorcentaje?: boolean;
  color?: 'sky' | 'emerald' | 'rose';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progreso,
  etiqueta,
  mostrarPorcentaje = true,
  color = 'sky',
  className = '',
}) => {
  const porcentajeClamped = Math.min(100, Math.max(0, Math.round(progreso)));

  const colorStyles = {
    sky: 'bg-sky-500',
    emerald: 'bg-emerald-500',
    rose: 'bg-rose-500',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(etiqueta || mostrarPorcentaje) && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600">
          <span>{etiqueta || 'Subiendo archivo...'}</span>
          {mostrarPorcentaje && <span>{porcentajeClamped}%</span>}
        </div>
      )}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200/60">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${colorStyles[color]}`}
          style={{ width: `${porcentajeClamped}%` }}
        />
      </div>
    </div>
  );
};
