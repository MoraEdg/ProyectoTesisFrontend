import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MisTramites from './pages/MisTramites';

function Tramites() {
  return <div className="p-6"><h1 className="text-2xl font-bold">Trámites — Revisor</h1></div>;
}

function SinPermisos() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-red-600">Sin permisos</h1>
      <p className="text-gray-500 mt-2">No tienes acceso a esta página.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Pública */}
          <Route path="/login"        element={<Login />} />
          <Route path="/sin-permisos" element={<SinPermisos />} />

          {/* Coordinador */}
          <Route path="/dashboard" element={
            <PrivateRoute roles={['Coordinador']}>
              <Dashboard />
            </PrivateRoute>
          } />

          {/* Estudiante */}
          <Route path="/mis-tramites" element={
            <PrivateRoute roles={['Estudiante']}>
              <MisTramites />
            </PrivateRoute>
          } />

          {/* Revisores */}
          <Route path="/tramites" element={
            <PrivateRoute roles={['Coordinador', 'Director', 'Decano']}>
              <Tramites />
            </PrivateRoute>
          } />

          {/* Redirigir raíz a login */}
          <Route path="/"  element={<Navigate to="/login" replace />} />
          <Route path="*"  element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
