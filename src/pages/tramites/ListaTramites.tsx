import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listarTramites } from '../../api/tramitesApi';
import type { Tramite } from '../../types/tramite';
import { COLORES_ESTADO_TRAMITE as COLORES_ESTADO } from '../../components/badgeEstado';

export default function ListaTramites() {
  const navigate = useNavigate();
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    setCargando(true);
    listarTramites()
      .then(({ data }) => setTramites(data))
      .catch(() => setError('No se pudo conectar con el servidor'))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Trámites</h1>
        <Link
          to="/tramites/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-uisek text-white text-sm rounded hover:bg-uisek-dark transition-colors"
        >
          <i className="fa-solid fa-plus" />
          Nuevo Trámite
        </Link>
      </div>

      {cargando && (
        <div className="text-center py-12 text-gray-500">
          <i className="fa-solid fa-spinner fa-spin text-2xl mb-2" />
          <p>Cargando trámites...</p>
        </div>
      )}

      {error && !cargando && (
        <div className="text-center py-12 text-red-600">{error}</div>
      )}

      {!cargando && !error && tramites.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <i className="fa-solid fa-folder-open text-4xl mb-3 opacity-30" />
          <p>No hay trámites registrados</p>
        </div>
      )}

      {!cargando && !error && tramites.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="text-white font-bold" style={{ backgroundColor: '#6366F1' }}>
                <th className="px-4 py-3 text-left">Código</th>
                <th className="px-4 py-3 text-left">Estudiante</th>
                <th className="px-4 py-3 text-left">Cédula</th>
                <th className="px-4 py-3 text-left">Proceso</th>
                <th className="px-4 py-3 text-left">Período</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tramites.map((t) => (
                <tr
                  key={t.id_tramite}
                  className="border-b border-gray-100 hover:bg-gray-50"
                  style={{ color: '#003399' }}
                >
                  <td className="px-4 py-3 font-medium">{t.codigo_tramite}</td>
                  <td className="px-4 py-3">{t.apellidos} {t.nombres}</td>
                  <td className="px-4 py-3">{t.cedula}</td>
                  <td className="px-4 py-3">{t.tipo_proceso}</td>
                  <td className="px-4 py-3">{t.periodo}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${COLORES_ESTADO[t.estado] ?? 'bg-gray-100 text-gray-700'}`}>
                      {t.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => navigate(`/tramites/${t.id_tramite}`)}
                      className="text-uisek hover:text-uisek-dark"
                      title="Ver detalle"
                    >
                      <i className="fa-solid fa-eye" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
