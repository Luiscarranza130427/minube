import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';
import logoNubox from '../assets/nubox-logo.png';

export const ProtectedRoute: React.FC = () => {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <img
          src={logoNubox}
          alt="Nubox"
          className="w-16 h-16 object-contain animate-pulse drop-shadow-md"
        />
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
          <span>Verificando credenciales...</span>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
