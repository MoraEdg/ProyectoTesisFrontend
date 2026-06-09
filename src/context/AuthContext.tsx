import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axiosConfig';

export interface Usuario {
  id_usuario: string;
  nombres:    string;
  apellidos:  string;
  rol:        string;
}

interface AuthContextType {
  usuario:       Usuario | null;
  cargando:      boolean;
  login:         (nombre_usuario: string, contrasena: string) => Promise<Usuario>;
  logout:        () => Promise<void>;
  esEstudiante:  () => boolean;
  esCoordinador: () => boolean;
  esDirector:    () => boolean;
  esDecano:      () => boolean;
  esRevisor:     () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario,  setUsuario]  = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  // Al montar: restaurar sesión desde localStorage si existe
  useEffect(() => {
    const token          = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    if (token && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado) as Usuario);
    }
    setCargando(false);
  }, []);

  const login = async (nombre_usuario: string, contrasena: string): Promise<Usuario> => {
    const { data } = await api.post<{ data: { token: string; usuario: Usuario } }>(
      '/auth/login',
      { nombre_usuario, contrasena }
    );
    const { token, usuario: usuarioData } = data.data;
    localStorage.setItem('token',   token);
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
    setUsuario(usuarioData);
    return usuarioData;
  };

  const logout = async (): Promise<void> => {
    try { await api.post('/auth/logout'); } catch { /* JWT stateless */ }
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  const esEstudiante  = () => usuario?.rol === 'Estudiante';
  const esCoordinador = () => usuario?.rol === 'Coordinador';
  const esDirector    = () => usuario?.rol === 'Director';
  const esDecano      = () => usuario?.rol === 'Decano';
  const esRevisor     = () => ['Coordinador', 'Director', 'Decano'].includes(usuario?.rol ?? '');

  return (
    <AuthContext.Provider value={{
      usuario, cargando,
      login, logout,
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
