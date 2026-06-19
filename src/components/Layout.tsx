import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface MenuItem {
  to: string;
  label: string;
  icon: string;
}

const menuCoordinador: MenuItem[] = [
  { to: '/dashboard',    label: 'Inicio',       icon: 'fa-solid fa-house' },
  { to: '/estudiantes',  label: 'Estudiantes',  icon: 'fa-solid fa-user-graduate' },
  { to: '/tramites',     label: 'Trámites',     icon: 'fa-solid fa-folder-open' },
];

const menuEstudiante: MenuItem[] = [
  { to: '/dashboard',      label: 'Inicio',       icon: 'fa-solid fa-house' },
  { to: '/mis-tramites',   label: 'Mis Trámites', icon: 'fa-solid fa-folder-open' },
];

function getMenu(rol: string | undefined): MenuItem[] {
  switch (rol) {
    case 'Coordinador': return menuCoordinador;
    case 'Estudiante':  return menuEstudiante;
    default:            return [];
  }
}

export default function Layout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = getMenu(usuario?.rol);

  return (
    <div className="min-h-screen bg-uisek-light">
      {/* Navbar */}
      <header
        className="fixed top-0 left-0 w-full h-[70px] z-10 flex items-center justify-between px-8"
        style={{ backgroundColor: '#054690' }}
      >
        <div className="flex items-center gap-4">
          <img
            src="/images/logo-dark.png"
            alt="UISEK"
            className="h-[35px] rounded bg-white px-1"
          />
          <span className="text-white font-medium text-sm hidden sm:inline">
            Sistema de Gestión de Prácticas
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-white text-sm hidden md:inline">
            {usuario?.nombres} {usuario?.apellidos}
          </span>
          <button
            onClick={() => void handleLogout()}
            className="text-white/80 hover:text-white text-sm flex items-center gap-2"
            title="Cerrar sesión"
          >
            <i className="fa-solid fa-right-from-bracket" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-[30px] top-[90px] w-[260px] bg-white rounded-xl shadow-[0_3px_5px_rgba(0,0,0,0.02),0_0_2px_rgba(0,0,0,0.05),0_1px_4px_rgba(0,0,0,0.08)] overflow-y-auto"
        style={{ height: 'calc(100vh - 110px)' }}
      >
        <nav className="flex flex-col h-full">
          <div className="flex-1 pt-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                    isActive
                      ? 'text-uisek font-medium bg-blue-50 border-r-3 border-uisek'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <i className={`${item.icon} w-5 text-center`} />
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 text-xs text-gray-400">
            UISEK — Prácticas v1.0
          </div>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="ml-[320px] mt-[90px] mr-6 mb-6">
        <Outlet />
      </main>
    </div>
  );
}
