import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Usuario } from '../context/AuthContext';

const RUTAS_POR_ROL: Record<string, string> = {
  Estudiante:  '/mis-tramites',
  Coordinador: '/dashboard',
  Director:    '/tramites',
  Decano:      '/tramites',
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena]       = useState('');
  const [mostrarPass, setMostrarPass]     = useState(false);
  const [error, setError]                 = useState('');
  const [cargando, setCargando]           = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const usuario: Usuario = await login(nombreUsuario, contrasena);
      navigate(RUTAS_POR_ROL[usuario.rol] ?? '/dashboard');
    } catch (err) {
      const apiError = err as { response?: { data?: { error?: string } } };
      setError(apiError.response?.data?.error ?? 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #074E99 0%, #085394 40%, #0a6bc4 100%)' }}
    >
      <div className="flex shadow-2xl" style={{ minHeight: '480px' }}>
        {/* Panel izquierdo — institucional */}
        <div
          className="hidden md:flex flex-col items-center justify-center text-center text-white px-8"
          style={{ backgroundColor: 'rgba(8, 83, 148, 0.85)', width: '300px' }}
        >
          <img
            src="/images/logo-sek-4.png"
            alt="UISEK"
            className="w-[204px] h-[85px] rounded mb-6"
          />
          <p className="text-lg leading-relaxed">
            Bienvenidos a la Universidad Internacional SEK.
          </p>
          <p className="text-sm mt-2 opacity-90">
            El mejor lugar para el mejor momento de tu vida.
          </p>
        </div>

        {/* Panel derecho — formulario */}
        <div className="bg-white flex items-center justify-center" style={{ width: '400px' }}>
          <div className="w-full px-8 py-10">
            <h3 className="text-center text-gray-800 font-medium text-lg mb-8">
              SISTEMA DE GESTIÓN DE PRÁCTICAS
            </h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={nombreUsuario}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNombreUsuario(e.target.value)}
                placeholder="Usuario"
                required
                className="w-full mt-4 py-3 px-4 text-sm border border-[#d8d8d8] outline-none focus:border-uisek focus:shadow-[0_0_0_2px_rgba(8,83,148,0.2)]"
              />

              <div className="relative mt-4">
                <input
                  type={mostrarPass ? 'text' : 'password'}
                  value={contrasena}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setContrasena(e.target.value)}
                  placeholder="Contraseña"
                  required
                  className="w-full py-3 px-4 pr-10 text-sm border border-[#d8d8d8] outline-none focus:border-uisek focus:shadow-[0_0_0_2px_rgba(8,83,148,0.2)]"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPass(!mostrarPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  tabIndex={-1}
                >
                  <i className={`fa-solid ${mostrarPass ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                </button>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full mt-8 py-3 text-white text-sm border-none cursor-pointer disabled:opacity-50 hover:bg-uisek-dark transition-colors"
                style={{ backgroundColor: '#085394' }}
              >
                {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
