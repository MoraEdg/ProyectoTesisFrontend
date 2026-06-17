import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerEstudiante, desactivarEstudiante } from '../../api/estudiantesApi';
import type { Estudiante } from '../../types/estudiante';
import ModalConfirmacion from '../../components/ModalConfirmacion';

export default function DetalleEstudiante() {
  const { id } = useParams<{ id: string }>();

  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [cargando, setCargando]     = useState(true);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [alerta, setAlerta]         = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [desactivando, setDesactivando] = useState(false);

  useEffect(() => {
    if (!id) return;
    setCargando(true);
    obtenerEstudiante(id)
      .then((data) => setEstudiante(data))
      .catch((err: { response?: { status?: number } }) => {
        if (err.response?.status === 404) setNoEncontrado(true);
      })
      .finally(() => setCargando(false));
  }, [id]);

  const confirmarDesactivar = async () => {
    if (!id) return;
    setDesactivando(true);
    try {
      await desactivarEstudiante(id);
      setAlerta({ tipo: 'exito', texto: 'Estudiante desactivado correctamente' });
      setModalVisible(false);
      const data = await obtenerEstudiante(id);
      setEstudiante(data);
    } catch {
      setAlerta({ tipo: 'error', texto: 'Error al desactivar el estudiante' });
    } finally {
      setDesactivando(false);
    }
  };

  if (cargando) {
    return (
      <div className="text-center py-12 text-gray-500">
        <i className="fa-solid fa-spinner fa-spin text-2xl mb-2" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (noEncontrado) {
    return (
      <div className="text-center py-12">
        <i className="fa-solid fa-user-xmark text-4xl text-gray-300 mb-4" />
        <p className="text-gray-600 mb-4">Estudiante no encontrado</p>
        <Link to="/estudiantes" className="text-uisek hover:underline text-sm">
          Volver al listado
        </Link>
      </div>
    );
  }

  if (!estudiante) return null;

  const campos = [
    { label: 'Nombres',          valor: estudiante.nombres },
    { label: 'Apellidos',        valor: estudiante.apellidos },
    { label: 'Cédula',           valor: estudiante.cedula },
    { label: 'Correo',           valor: estudiante.correo },
    { label: 'Teléfono',         valor: estudiante.telefono || '—' },
    { label: 'Carrera',          valor: estudiante.carrera },
    { label: 'Matrícula',        valor: estudiante.matricula },
    { label: 'Nombre de usuario', valor: estudiante.nombre_usuario },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Detalle del Estudiante</h1>
        <div className="flex gap-3">
          <Link
            to="/estudiantes"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-100 transition-colors"
          >
            <i className="fa-solid fa-arrow-left" />
            Volver
          </Link>
          <Link
            to={`/estudiantes/${id}/editar`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-uisek text-white text-sm rounded hover:bg-uisek-dark transition-colors"
          >
            <i className="fa-solid fa-pen-to-square" />
            Editar
          </Link>
          {estudiante.estado && (
            <button
              onClick={() => setModalVisible(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              <i className="fa-solid fa-user-slash" />
              Desactivar
            </button>
          )}
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

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <span
            className={`inline-block px-3 py-1 rounded text-xs font-medium ${
              estudiante.estado
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {estudiante.estado ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {campos.map((c) => (
            <div key={c.label}>
              <span className="block text-xs text-gray-400 mb-1">{c.label}</span>
              <span className="text-gray-800">{c.valor}</span>
            </div>
          ))}
        </div>
      </div>

      <ModalConfirmacion
        visible={modalVisible}
        mensaje={`¿Está seguro de desactivar a ${estudiante.nombres} ${estudiante.apellidos}?`}
        onConfirmar={() => void confirmarDesactivar()}
        onCancelar={() => setModalVisible(false)}
        cargando={desactivando}
      />
    </div>
  );
}
