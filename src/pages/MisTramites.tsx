import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listarTramites } from '../api/tramitesApi';
import type { Tramite } from '../types/tramite';
import { COLORES_ESTADO_TRAMITE as COLORES_ESTADO } from '../components/badgeEstado';

export default function MisTramites() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    listarTramites()
      .then(({ data }) => setTramites(data))
      .catch(() => setError('No se pudo conectar con el servidor'))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Mis Trámites</h1>
      <p className="text-gray-500 text-sm mb-8">
        Hola, {usuario?.nombres} {usuario?.apellidos}
      </p>

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
        <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-400">
          <i className="fa-solid fa-folder-open text-4xl mb-3 opacity-30" />
          <p>No tienes trámites registrados aún.</p>
          <p className="text-sm mt-1">Tu coordinador creará un trámite cuando inicies tu proceso de prácticas.</p>
        </div>
      )}

      {!cargando && !error && tramites.length > 0 && (
        <div className="space-y-4">
          {tramites.map((t) => (
            <div
              key={t.id_tramite}
              onClick={() => navigate(`/mis-tramites/${t.id_tramite}`)}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="font-medium text-gray-800">{t.codigo_tramite}</span>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${COLORES_ESTADO[t.estado] ?? 'bg-gray-100'}`}>
                  {t.estado}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-500">
                <div><span className="text-gray-400">Proceso:</span> {t.tipo_proceso}</div>
                <div><span className="text-gray-400">Período:</span> {t.periodo}</div>
                <div><span className="text-gray-400">Inicio:</span> {new Date(t.fecha_inicio).toLocaleDateString('es-EC')}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
