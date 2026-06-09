import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
  roles?: string[];
}

export default function PrivateRoute({ children, roles = [] }: PrivateRouteProps) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500">Cargando...</span>
      </div>
    );
  }

  if (!usuario) return <Navigate to="/login" replace />;

  if (roles.length > 0 && !roles.includes(usuario.rol)) {
    return <Navigate to="/sin-permisos" replace />;
  }

  return <>{children}</>;
}
