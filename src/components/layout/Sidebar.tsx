import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoNubox from '../../assets/nubox-logo.png';
import {
  LayoutDashboard,
  FolderClosed,
  User,
  LogOut,
  X,
  HardDrive,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useArchivos } from '../../hooks/useArchivos';
import { formatearTamano } from '../../utils/formatters';

interface SidebarProps {
  abiertoMovil: boolean;
  alCerrarMovil: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ abiertoMovil, alCerrarMovil }) => {
  const { cerrarSesion } = useAuth();
  const { estadisticas } = useArchivos();
  const navigate = useNavigate();

  const enlaces = [
    {
      nombre: 'Inicio',
      ruta: '/inicio',
      icono: LayoutDashboard,
    },
    {
      nombre: 'Mis archivos',
      ruta: '/archivos',
      icono: FolderClosed,
    },
    {
      nombre: 'Perfil',
      ruta: '/perfil',
      icono: User,
    },
  ];

  const handleCerrarSesion = async () => {
    await cerrarSesion();
    navigate('/login');
  };

  const contenidoSidebar = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 w-64 select-none">
      {/* Logotipo de Nubox */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img
            src={logoNubox}
            alt="Nubox"
            className="w-10 h-10 object-contain drop-shadow-xs shrink-0"
          />
          <div>
            <h1 className="font-extrabold text-slate-800 text-lg leading-tight tracking-tight">
              Nubox
            </h1>
            <span className="text-[11px] font-semibold text-sky-600 tracking-wide uppercase">
              Cloud Storage
            </span>
          </div>
        </div>

        {/* Botón de cerrar en móvil */}
        <button
          onClick={alCerrarMovil}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Menú de Navegación Principal */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Navegación
        </p>

        {enlaces.map((item) => {
          const Icono = item.icono;
          return (
            <NavLink
              key={item.ruta}
              to={item.ruta}
              onClick={alCerrarMovil}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icono className="w-5 h-5 shrink-0" />
              <span>{item.nombre}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Widget de Espacio Académico */}
      <div className="p-4 mx-4 mb-4 rounded-xl bg-slate-50 border border-slate-200/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
          <HardDrive className="w-4 h-4 text-sky-500" />
          <span>Almacenamiento</span>
        </div>
        <p className="text-xs text-slate-500 mb-2">
          Usado: <strong className="text-slate-800">{formatearTamano(estadisticas.espacioUtilizadoBytes)}</strong> ({estadisticas.totalArchivos} {estadisticas.totalArchivos === 1 ? 'archivo' : 'archivos'})
        </p>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-sky-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(8, (estadisticas.totalArchivos / 20) * 100))}%` }}
          />
        </div>
      </div>

      {/* Pie del Sidebar: Cerrar Sesión */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleCerrarSesion}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar fijo para escritorio */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0 z-30">
        {contenidoSidebar}
      </aside>

      {/* Drawer deslizante para móviles y tablets */}
      {abiertoMovil && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={alCerrarMovil}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-10 transition-transform duration-300 transform">
            {contenidoSidebar}
          </div>
        </div>
      )}
    </>
  );
};
