import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { usuario, logout } = useAuth();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard — Coordinador</h1>
        <button
          onClick={() => void logout()}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
      <p className="text-gray-600">
        Bienvenido, {usuario?.nombres} {usuario?.apellidos}
      </p>
      <p className="text-gray-400 text-sm mt-1">Sprint 2 — Gestión de Estudiantes (próximamente)</p>
    </div>
  );
}
