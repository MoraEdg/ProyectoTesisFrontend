import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { usuario } = useAuth();
  const esCoordinador = usuario?.rol === 'Coordinador';

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Bienvenido, {usuario?.nombres} {usuario?.apellidos}
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        {esCoordinador ? 'Panel de Coordinación' : 'Portal del Estudiante'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {esCoordinador && (
          <>
            <Link
              to="/estudiantes"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-lg bg-uisek/10 flex items-center justify-center">
                  <i className="fa-solid fa-user-graduate text-uisek text-xl" />
                </div>
                <h2 className="text-lg font-medium text-gray-800 group-hover:text-uisek transition-colors">
                  Gestión de Estudiantes
                </h2>
              </div>
              <p className="text-gray-500 text-sm">
                Registrar, editar, desactivar e importar estudiantes.
              </p>
            </Link>

            <Link
              to="/tramites"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-lg bg-uisek/10 flex items-center justify-center">
                  <i className="fa-solid fa-folder-open text-uisek text-xl" />
                </div>
                <h2 className="text-lg font-medium text-gray-800 group-hover:text-uisek transition-colors">
                  Gestión de Trámites
                </h2>
              </div>
              <p className="text-gray-500 text-sm">
                Crear trámites, gestionar estados y consultar historial.
              </p>
            </Link>
          </>
        )}

        {!esCoordinador && (
          <Link
            to="/mis-tramites"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-lg bg-uisek/10 flex items-center justify-center">
                <i className="fa-solid fa-folder-open text-uisek text-xl" />
              </div>
              <h2 className="text-lg font-medium text-gray-800 group-hover:text-uisek transition-colors">
                Mis Trámites
              </h2>
            </div>
            <p className="text-gray-500 text-sm">
              Consulta el estado de tus trámites de prácticas.
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
