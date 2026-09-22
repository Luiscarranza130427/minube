import React, { useState } from 'react';
import { Menu, Sparkles, Server } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { obtenerIniciales } from '../../utils/formatters';
import { ModalArquitecturaNube } from '../archivos/ModalArquitecturaNube';

interface HeaderProps {
  alAbrirMovil: () => void;
}

export const Header: React.FC<HeaderProps> = ({ alAbrirMovil }) => {
  const { usuario, modoDemostracion } = useAuth();
  const [modalArquiAbierto, setModalArquiAbierto] = useState<boolean>(false);

  const nombreUsuario = usuario?.nombre_completo || 'Estudiante';
  const correoUsuario = usuario?.correo || 'usuario@minube.cloud';
  const iniciales = obtenerIniciales(nombreUsuario);

  return (
    <>
      <header className="h-18 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between transition-all">
        {/* Saludo y botón menú móvil */}
        <div className="flex items-center gap-3">
          <button
            onClick={alAbrirMovil}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>Hola, {nombreUsuario.split(' ')[0]}</span>
              <span className="inline-block animate-wave origin-bottom-right">👋</span>
            </h2>
            <p className="text-xs text-slate-400 hidden sm:block">
              Bienvenido a tu panel de almacenamiento en la nube
            </p>
          </div>
        </div>

        {/* Indicadores + Botón Arquitectura + Avatar */}
        <div className="flex items-center gap-3">
          {/* Botón Explicación de Arquitectura Cloud */}
          <button
            onClick={() => setModalArquiAbierto(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/80 transition-colors cursor-pointer shadow-2xs"
            title="Ver arquitectura técnica (PostgreSQL, Storage y RLS)"
          >
            <Server className="w-3.5 h-3.5 text-sky-600" />
            <span>Arquitectura Cloud</span>
          </button>

          {modoDemostracion && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Modo Demo</span>
            </span>
          )}

          <div className="flex items-center gap-3 pl-3 border-l border-slate-200/80">
            {/* Avatar circular con iniciales */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center font-bold text-sm shadow-xs select-none">
              {iniciales}
            </div>

            {/* Nombre y correo a la derecha */}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {nombreUsuario}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight truncate max-w-[180px]">
                {correoUsuario}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de Arquitectura Cloud */}
      <ModalArquitecturaNube
        abierto={modalArquiAbierto}
        alCerrar={() => setModalArquiAbierto(false)}
      />
    </>
  );
};
