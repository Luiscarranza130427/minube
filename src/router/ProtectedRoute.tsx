import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Cloud, Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 animate-pulse">
          <Cloud className="w-7 h-7" />
        </div>
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
