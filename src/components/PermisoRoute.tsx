import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface PermisoRouteProps {
  children: ReactNode;
  /** Clave del permiso requerida para acceder a esta ruta. */
  clave: string;
}

/**
 * Guard de ruta basado en permisos dinámicos RBAC.
 * Redirige a /sin-permisos si el usuario no posee la clave indicada.
 * Complementa (no reemplaza) a PrivateRoute, que sigue filtrando por rol.
 */
export default function PermisoRoute({ children, clave }: PermisoRouteProps) {
  const { usuario, cargando, tienePermiso } = useAuth();

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500">Cargando...</span>
      </div>
    );
  }

  if (!usuario) return <Navigate to="/login" replace />;

  if (!tienePermiso(clave)) return <Navigate to="/sin-permisos" replace />;

  return <>{children}</>;
}
