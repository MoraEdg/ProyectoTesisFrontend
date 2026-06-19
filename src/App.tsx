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
import ListaTramites from './pages/tramites/ListaTramites';
import FormTramite from './pages/tramites/FormTramite';
import DetalleTramite from './pages/tramites/DetalleTramite';

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

          {/* Rutas autenticadas con Layout unificado */}
          <Route element={
            <PrivateRoute roles={['Coordinador', 'Estudiante']}>
              <Layout />
            </PrivateRoute>
          }>
            {/* Compartidas */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Coordinador — Módulo Estudiantes (Sprint 2) */}
            <Route path="/estudiantes" element={
              <PrivateRoute roles={['Coordinador']}><ListaEstudiantes /></PrivateRoute>
            } />
            <Route path="/estudiantes/nuevo" element={
              <PrivateRoute roles={['Coordinador']}><FormEstudiante /></PrivateRoute>
            } />
            <Route path="/estudiantes/importar" element={
              <PrivateRoute roles={['Coordinador']}><ImportarEstudiantes /></PrivateRoute>
            } />
            <Route path="/estudiantes/:id" element={
              <PrivateRoute roles={['Coordinador']}><DetalleEstudiante /></PrivateRoute>
            } />
            <Route path="/estudiantes/:id/editar" element={
              <PrivateRoute roles={['Coordinador']}><FormEstudiante /></PrivateRoute>
            } />

            {/* Coordinador — Módulo Trámites (Sprint 3) */}
            <Route path="/tramites" element={
              <PrivateRoute roles={['Coordinador']}><ListaTramites /></PrivateRoute>
            } />
            <Route path="/tramites/nuevo" element={
              <PrivateRoute roles={['Coordinador']}><FormTramite /></PrivateRoute>
            } />
            <Route path="/tramites/:id" element={
              <PrivateRoute roles={['Coordinador', 'Estudiante']}><DetalleTramite /></PrivateRoute>
            } />

            {/* Estudiante — Mis Trámites */}
            <Route path="/mis-tramites" element={
              <PrivateRoute roles={['Estudiante']}><MisTramites /></PrivateRoute>
            } />
            <Route path="/mis-tramites/:id" element={
              <PrivateRoute roles={['Estudiante']}><DetalleTramite /></PrivateRoute>
            } />
          </Route>

          {/* Redirecciones */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
