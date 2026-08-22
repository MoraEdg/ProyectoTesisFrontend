import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axiosConfig';
import { fetchMisPermisos } from '../api/permisosApi';

export interface Usuario {
  id_usuario: string;
  nombres:    string;
  apellidos:  string;
  rol:        string;
}

interface AuthContextType {
  usuario:        Usuario | null;
  permisos:       string[];
  cargando:       boolean;
  login:          (nombre_usuario: string, contrasena: string) => Promise<Usuario>;
  logout:         () => Promise<void>;
  tienePermiso:   (clave: string) => boolean;
  esEstudiante:   () => boolean;
  esCoordinador:  () => boolean;
  esDirector:     () => boolean;
  esDecano:       () => boolean;
  esRevisor:      () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const LS_TOKEN    = 'token';
const LS_USUARIO  = 'usuario';
const LS_PERMISOS = 'permisos';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario,  setUsuario]  = useState<Usuario | null>(null);
  const [permisos, setPermisos] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);

  // Al montar: restaurar sesión y permisos desde localStorage
  useEffect(() => {
    const token           = localStorage.getItem(LS_TOKEN);
    const usuarioGuardado = localStorage.getItem(LS_USUARIO);
    const permisosGuardados = localStorage.getItem(LS_PERMISOS);

    if (token && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado) as Usuario);
      if (permisosGuardados) {
        setPermisos(JSON.parse(permisosGuardados) as string[]);
      }
    }
    setCargando(false);
  }, []);

  const login = async (nombre_usuario: string, contrasena: string): Promise<Usuario> => {
    const { data } = await api.post<{ data: { token: string; usuario: Usuario } }>(
      '/auth/login',
      { nombre_usuario, contrasena }
    );
    const { token, usuario: usuarioData } = data.data;

    // Persistir token y usuario ANTES de pedir permisos
    // (el interceptor de axios los lee desde localStorage)
    localStorage.setItem(LS_TOKEN,   token);
    localStorage.setItem(LS_USUARIO, JSON.stringify(usuarioData));
    setUsuario(usuarioData);

    // Obtener permisos dinámicos del backend
    try {
      const clavesPermisos = await fetchMisPermisos();
      localStorage.setItem(LS_PERMISOS, JSON.stringify(clavesPermisos));
      setPermisos(clavesPermisos);
    } catch {
      // Si falla la carga de permisos la sesión continúa sin permisos dinámicos
      localStorage.removeItem(LS_PERMISOS);
      setPermisos([]);
    }

    return usuarioData;
  };

  const logout = async (): Promise<void> => {
    try { await api.post('/auth/logout'); } catch { /* JWT stateless */ }
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USUARIO);
    localStorage.removeItem(LS_PERMISOS);
    setUsuario(null);
    setPermisos([]);
  };

  const tienePermiso  = (clave: string): boolean => permisos.includes(clave);
  const esEstudiante  = () => usuario?.rol === 'Estudiante';
  const esCoordinador = () => usuario?.rol === 'Coordinador';
  const esDirector    = () => usuario?.rol === 'Director';
  const esDecano      = () => usuario?.rol === 'Decano';
  const esRevisor     = () => ['Coordinador', 'Director', 'Decano'].includes(usuario?.rol ?? '');

  return (
    <AuthContext.Provider value={{
      usuario, permisos, cargando,
      login, logout,
      tienePermiso,
      esEstudiante, esCoordinador, esDirector, esDecano, esRevisor,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
};
