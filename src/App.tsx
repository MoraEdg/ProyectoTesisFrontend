import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MisTramites from './pages/MisTramites';
import ListaEstudiantes from './pages/estudiantes/ListaEstudiantes';
import DetalleEstudiante from './pages/estudiantes/DetalleEstudiante';
import FormEstudiante from './pages/estudiantes/FormEstudiante';
import ImportarEstudiantes from './pages/estudiantes/ImportarEstudiantes';

function SinPermisos() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-red-600">No autorizado</h1>
      <p className="text-gray-500 mt-2">No tienes acceso a esta página.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/sin-permisos" element={<SinPermisos />} />

          {/* Rutas autenticadas con Layout */}
          <Route element={
            <PrivateRoute roles={['Coordinador']}>
              <Layout />
            </PrivateRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Módulo Estudiantes — Sprint 2 */}
            <Route path="/estudiantes"              element={<ListaEstudiantes />} />
            <Route path="/estudiantes/nuevo"        element={<FormEstudiante />} />
            <Route path="/estudiantes/importar"     element={<ImportarEstudiantes />} />
            <Route path="/estudiantes/:id"          element={<DetalleEstudiante />} />
            <Route path="/estudiantes/:id/editar"   element={<FormEstudiante />} />
          </Route>

          {/* Estudiante */}
          <Route path="/mis-tramites" element={
            <PrivateRoute roles={['Estudiante']}>
              <MisTramites />
            </PrivateRoute>
          } />

          {/* Redirecciones */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
