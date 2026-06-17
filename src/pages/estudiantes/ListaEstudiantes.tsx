import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listarEstudiantes, desactivarEstudiante } from '../../api/estudiantesApi';
import type { Estudiante } from '../../types/estudiante';
import ModalConfirmacion from '../../components/ModalConfirmacion';

export default function ListaEstudiantes() {
  const navigate = useNavigate();

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cargando, setCargando]       = useState(true);
  const [error, setError]             = useState('');
  const [alerta, setAlerta]           = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  const [modalVisible, setModalVisible]   = useState(false);
  const [desactivando, setDesactivando]   = useState(false);
  const [estudianteADesactivar, setEstudianteADesactivar] = useState<Estudiante | null>(null);

  const cargarEstudiantes = async () => {
    setCargando(true);
    setError('');
    try {
      const { data } = await listarEstudiantes();
      setEstudiantes(data);
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { void cargarEstudiantes(); }, []);

  const abrirModal = (est: Estudiante) => {
    setEstudianteADesactivar(est);
    setModalVisible(true);
  };

  const confirmarDesactivar = async () => {
    if (!estudianteADesactivar) return;
    setDesactivando(true);
    try {
      await desactivarEstudiante(estudianteADesactivar.id_estudiante);
      setAlerta({ tipo: 'exito', texto: 'Estudiante desactivado correctamente' });
      setModalVisible(false);
      setEstudianteADesactivar(null);
      await cargarEstudiantes();
    } catch {
      setAlerta({ tipo: 'error', texto: 'Error al desactivar el estudiante' });
    } finally {
      setDesactivando(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Estudiantes</h1>
        <div className="flex gap-3">
          <Link
            to="/estudiantes/importar"
            className="inline-flex items-center gap-2 px-4 py-2 border border-uisek text-uisek text-sm rounded hover:bg-uisek hover:text-white transition-colors"
          >
            <i className="fa-solid fa-file-excel" />
            Importar Excel
          </Link>
          <Link
            to="/estudiantes/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2 bg-uisek text-white text-sm rounded hover:bg-uisek-dark transition-colors"
          >
            <i className="fa-solid fa-plus" />
            Nuevo Estudiante
          </Link>
        </div>
      </div>

      {/* Alerta */}
      {alerta && (
        <div
          className={`mb-4 px-4 py-3 rounded text-sm flex items-center justify-between ${
            alerta.tipo === 'exito'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          <span>{alerta.texto}</span>
          <button onClick={() => setAlerta(null)} className="ml-4 font-bold hover:opacity-70">&times;</button>
        </div>
      )}

      {/* Estados de carga */}
      {cargando && (
        <div className="text-center py-12 text-gray-500">
          <i className="fa-solid fa-spinner fa-spin text-2xl mb-2" />
          <p>Cargando estudiantes...</p>
        </div>
      )}

      {error && !cargando && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => void cargarEstudiantes()}
            className="text-uisek hover:underline text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Tabla */}
      {!cargando && !error && estudiantes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <i className="fa-solid fa-users text-4xl mb-3 opacity-30" />
          <p>No hay estudiantes registrados</p>
        </div>
      )}

      {!cargando && !error && estudiantes.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="text-white font-bold" style={{ backgroundColor: '#6366F1' }}>
                <th className="px-4 py-3 text-left">Apellidos</th>
                <th className="px-4 py-3 text-left">Nombres</th>
                <th className="px-4 py-3 text-left">Cédula</th>
                <th className="px-4 py-3 text-left">Correo</th>
                <th className="px-4 py-3 text-left">Carrera</th>
                <th className="px-4 py-3 text-left">Matrícula</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((est) => (
                <tr
                  key={est.id_estudiante}
                  className="border-b border-gray-100 hover:bg-gray-50"
                  style={{ color: '#003399' }}
                >
                  <td className="px-4 py-3">{est.apellidos}</td>
                  <td className="px-4 py-3">{est.nombres}</td>
                  <td className="px-4 py-3">{est.cedula}</td>
                  <td className="px-4 py-3">{est.correo}</td>
                  <td className="px-4 py-3">{est.carrera}</td>
                  <td className="px-4 py-3">{est.matricula}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        est.estado
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {est.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/estudiantes/${est.id_estudiante}`)}
                        className="text-uisek hover:text-uisek-dark"
                        title="Ver detalle"
                      >
                        <i className="fa-solid fa-eye" />
                      </button>
                      <button
                        onClick={() => navigate(`/estudiantes/${est.id_estudiante}/editar`)}
                        className="text-yellow-600 hover:text-yellow-700"
                        title="Editar"
                      >
                        <i className="fa-solid fa-pen-to-square" />
                      </button>
                      {est.estado && (
                        <button
                          onClick={() => abrirModal(est)}
                          className="text-red-500 hover:text-red-700"
                          title="Desactivar"
                        >
                          <i className="fa-solid fa-user-slash" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalConfirmacion
        visible={modalVisible}
        mensaje={`¿Está seguro de desactivar a ${estudianteADesactivar?.nombres} ${estudianteADesactivar?.apellidos}?`}
        onConfirmar={() => void confirmarDesactivar()}
        onCancelar={() => { setModalVisible(false); setEstudianteADesactivar(null); }}
        cargando={desactivando}
      />
    </div>
  );
}
