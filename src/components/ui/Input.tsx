import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  etiqueta?: string;
  error?: string;
  ayuda?: string;
  iconoIzquierda?: React.ReactNode;
  permiteOcultarClave?: boolean;
}

export const Input: React.FC<InputProps> = ({
  etiqueta,
  error,
  ayuda,
  iconoIzquierda,
  permiteOcultarClave = false,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const [mostrarClave, setMostrarClave] = useState(false);
  const inputId = id || (etiqueta ? etiqueta.toLowerCase().replace(/\s+/g, '-') : undefined);

  const tipoFinal = permiteOcultarClave ? (mostrarClave ? 'text' : 'password') : type;

  return (
    <div className="w-full space-y-1.5">
      {etiqueta && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 tracking-wide uppercase"
        >
          {etiqueta}
        </label>
      )}

      <div className="relative rounded-xl shadow-2xs">
        {iconoIzquierda && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {iconoIzquierda}
          </div>
        )}

        <input
          id={inputId}
          type={tipoFinal}
          className={`
            w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400
            transition-all duration-200 outline-none
            ${iconoIzquierda ? 'pl-10' : ''}
            ${permiteOcultarClave ? 'pr-11' : ''}
            ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                : 'border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
            }
            ${className}
          `}
          {...props}
        />

        {permiteOcultarClave && (
          <button
            type="button"
            onClick={() => setMostrarClave(!mostrarClave)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            tabIndex={-1}
            title={mostrarClave ? 'Ocultar contraseña' : 'Ver contraseña'}
          >
            {mostrarClave ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-500 font-medium flex items-center gap-1 mt-1">
          {error}
        </p>
      ) : ayuda ? (
        <p className="text-xs text-slate-400 mt-1">{ayuda}</p>
      ) : null}
    </div>
  );
};
