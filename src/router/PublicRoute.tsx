import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return null;
  }

  if (usuario) {
    return <Navigate to="/inicio" replace />;
  }

  return <>{children}</>;
};
