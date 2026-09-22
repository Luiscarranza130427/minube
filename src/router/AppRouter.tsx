import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { LayoutPrincipal } from '../components/layout/LayoutPrincipal';
import { Login } from '../pages/Login';
import { Inicio } from '../pages/Inicio';
import { Archivos } from '../pages/Archivos';
import { Perfil } from '../pages/Perfil';
import { useAuth } from '../hooks/useAuth';

const RutaRaiz: React.FC = () => {
  const { usuario, cargando } = useAuth();

  if (cargando) return null;
  return <Navigate to={usuario ? '/inicio' : '/login'} replace />;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz con redirección condicional */}
        <Route path="/" element={<RutaRaiz />} />

        {/* Rutas públicas (Login y Registro) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/registro"
          element={<Navigate to="/login" replace />}
        />

        {/* Rutas privadas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<LayoutPrincipal />}>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/archivos" element={<Archivos />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>
        </Route>

        {/* Ruta comodín */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
