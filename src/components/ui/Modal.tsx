import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  abierto: boolean;
  alCerrar: () => void;
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
  anchoMaximo?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  abierto,
  alCerrar,
  titulo,
  subtitulo,
  children,
  anchoMaximo = 'md',
}) => {
  // Manejo de tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && abierto) {
        alCerrar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [abierto, alCerrar]);

  // Bloqueo de scroll en body cuando está abierto
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [abierto]);

  if (!abierto) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Fondo con desenfoque suave */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={alCerrar}
      />

      {/* Tarjeta del modal */}
      <div
        className={`relative w-full ${maxWidthClasses[anchoMaximo]} bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 transition-all transform animate-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
      >
        {/* Cabecera del modal */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">{titulo}</h3>
            {subtitulo && <p className="text-xs text-slate-500 mt-0.5">{subtitulo}</p>}
          </div>
          <button
            onClick={alCerrar}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
