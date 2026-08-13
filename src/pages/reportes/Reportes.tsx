import { useEffect, useState } from 'react';
import { getDashboard } from '../../api/reportesApi';
import type { DashboardData } from '../../types/reporte';
import TarjetaMetrica from '../../components/reportes/TarjetaMetrica';
import GraficoReporte from '../../components/reportes/GraficoReporte';
import PlanificacionSemestral from '../../components/reportes/PlanificacionSemestral';

type Tab = 'dashboard' | 'planificacion';

// ── Dashboard ejecutivo (inline) ──────────────────────────────────────────────
function DashboardEjecutivo() {
  const [datos,    setDatos]    = useState<DashboardData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    getDashboard()
      .then(setDatos)
      .catch(() => setError('No se pudo cargar el dashboard. Intente nuevamente.'))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <div className="text-center py-16 text-gray-400">
        <i className="fa-solid fa-spinner fa-spin text-2xl mb-2 block" />
        Cargando datos del dashboard...
      </div>
    );
  }

  if (error || !datos) {
    return (
      <div className="text-center py-16">
        <i className="fa-solid fa-triangle-exclamation text-3xl text-red-300 mb-3 block" />
        <p className="text-gray-500 text-sm">{error || 'Error desconocido'}</p>
      </div>
    );
  }

  const { metricas, graficos } = datos;

  return (
    <div>
      {/* ── Métricas ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <TarjetaMetrica
          titulo="Total Estudiantes"
          valor={metricas.total_estudiantes}
          icon="fa-solid fa-user-graduate"
          bgColor="bg-blue-100"
          iconColor="text-blue-700"
        />
        <TarjetaMetrica
          titulo="Con Actividad"
          valor={metricas.con_actividad}
          icon="fa-solid fa-user-check"
          bgColor="bg-green-100"
          iconColor="text-green-700"
        />
        <TarjetaMetrica
          titulo="Sin Actividad"
          valor={metricas.sin_actividad}
          icon="fa-solid fa-user-clock"
          bgColor="bg-gray-100"
          iconColor="text-gray-500"
        />
        <TarjetaMetrica
          titulo="Total Trámites"
          valor={metricas.total_tramites}
          icon="fa-solid fa-folder-open"
          bgColor="bg-purple-100"
          iconColor="text-purple-700"
        />
        <TarjetaMetrica
          titulo="Trámites Finalizados"
          valor={metricas.tramites_finalizados}
          icon="fa-solid fa-circle-check"
          bgColor="bg-indigo-100"
          iconColor="text-indigo-700"
        />
      </div>

      {/* ── Gráficos ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GraficoReporte
          titulo="Distribución por tipo de proceso"
          datos={graficos.por_tipo_proceso}
          tipo="pie"
        />
        <GraficoReporte
          titulo="Origen de colocación (convenio / gestión propia)"
          datos={graficos.por_origen}
          tipo="pie"
        />
        <GraficoReporte
          titulo="Modalidad (práctica / pasantía)"
          datos={graficos.por_modalidad}
          tipo="pie"
        />
        <GraficoReporte
          titulo="Estado actual de los trámites"
          datos={graficos.por_estado}
          tipo="bar"
        />
      </div>
    </div>
  );
}

// ── Página principal ───────────────────────────────────────────────────────────
export default function Reportes() {
  const [tab, setTab] = useState<Tab>('dashboard');

  const btnBase  = 'px-5 py-2.5 text-sm font-medium rounded-lg transition-colors';
  const btnActive = `${btnBase} bg-uisek text-white shadow-sm`;
  const btnIdle   = `${btnBase} text-gray-600 hover:bg-gray-100`;

  return (
    <div>
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reportes Institucionales</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Métricas y planificación semestral de prácticas preprofesionales
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-xl shadow-sm p-1.5 w-fit">
        <button
          className={tab === 'dashboard' ? btnActive : btnIdle}
          onClick={() => setTab('dashboard')}
        >
          <i className="fa-solid fa-chart-pie mr-2" />
          Dashboard ejecutivo
        </button>
        <button
          className={tab === 'planificacion' ? btnActive : btnIdle}
          onClick={() => setTab('planificacion')}
        >
          <i className="fa-solid fa-table-list mr-2" />
          Planificación semestral
        </button>
      </div>

      {/* Contenido */}
      {tab === 'dashboard'     && <DashboardEjecutivo />}
      {tab === 'planificacion' && <PlanificacionSemestral />}
    </div>
  );
}
