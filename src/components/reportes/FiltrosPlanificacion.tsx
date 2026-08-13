import { useEffect, useState } from 'react';
import { obtenerTiposProceso, obtenerPeriodos } from '../../api/tramitesApi';
import type { TipoProceso, Periodo } from '../../types/tramite';
import type { FiltrosPlanificacionParams } from '../../types/reporte';

const ESTADOS_TRAMITE = ['INICIADO', 'EN_REVISION', 'OBSERVADO', 'CORREGIDO', 'APROBADO', 'FINALIZADO'];

interface FiltrosPlanificacionProps {
  onBuscar:  (filtros: FiltrosPlanificacionParams) => void;
  cargando:  boolean;
}

export default function FiltrosPlanificacion({ onBuscar, cargando }: FiltrosPlanificacionProps) {
  const [procesos, setProcesos] = useState<TipoProceso[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);

  // Estado interno de los 6 filtros
  const [periodoId,     setPeriodoId]     = useState('');
  const [tipoProcId,    setTipoProcId]    = useState('');
  const [estado,        setEstado]        = useState('');
  const [carrera,       setCarrera]       = useState('');
  const [modalidad,     setModalidad]     = useState('');
  const [tieneConvenio, setTieneConvenio] = useState('');

  useEffect(() => {
    Promise.all([obtenerTiposProceso(), obtenerPeriodos()])
      .then(([proc, per]) => {
        setProcesos(proc);
        setPeriodos(per);
      })
      .catch(() => { /* catálogos opcionales; si fallan, los selects quedan vacíos */ });
  }, []);

  const hayFiltros = !!(periodoId || tipoProcId || estado || carrera.trim() || modalidad || tieneConvenio);

  const aplicar = () => {
    const filtros: FiltrosPlanificacionParams = {};
    if (periodoId)       filtros.periodo_id      = periodoId;
    if (tipoProcId)      filtros.tipo_proceso_id  = tipoProcId;
    if (estado)          filtros.estado           = estado;
    if (carrera.trim())  filtros.carrera          = carrera.trim();
    if (modalidad)       filtros.modalidad        = modalidad;
    if (tieneConvenio)   filtros.tiene_convenio   = tieneConvenio;
    onBuscar(filtros);
  };

  const limpiar = () => {
    setPeriodoId('');
    setTipoProcId('');
    setEstado('');
    setCarrera('');
    setModalidad('');
    setTieneConvenio('');
    onBuscar({});
  };

  const inputCls =
    'border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-uisek bg-white';

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Período */}
        <div className="flex flex-col gap-1 min-w-[170px]">
          <label className="text-xs text-gray-500">Período</label>
          <select
            value={periodoId}
            onChange={(e) => setPeriodoId(e.target.value)}
            className={inputCls}
          >
            <option value="">Todos los períodos</option>
            {periodos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre_periodo}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de proceso */}
        <div className="flex flex-col gap-1 min-w-[180px]">
          <label className="text-xs text-gray-500">Tipo de proceso</label>
          <select
            value={tipoProcId}
            onChange={(e) => setTipoProcId(e.target.value)}
            className={inputCls}
          >
            <option value="">Todos</option>
            {procesos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div className="flex flex-col gap-1 min-w-[150px]">
          <label className="text-xs text-gray-500">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className={inputCls}
          >
            <option value="">Todos los estados</option>
            {ESTADOS_TRAMITE.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        {/* Carrera */}
        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
          <label className="text-xs text-gray-500">Carrera</label>
          <input
            type="text"
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && aplicar()}
            placeholder="Buscar por carrera..."
            className={inputCls}
          />
        </div>

        {/* Modalidad */}
        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-xs text-gray-500">Modalidad</label>
          <select
            value={modalidad}
            onChange={(e) => setModalidad(e.target.value)}
            className={inputCls}
          >
            <option value="">Todas</option>
            <option value="PRACTICA">Práctica</option>
            <option value="PASANTIA">Pasantía</option>
          </select>
        </div>

        {/* Tiene convenio */}
        <div className="flex flex-col gap-1 min-w-[150px]">
          <label className="text-xs text-gray-500">Convenio</label>
          <select
            value={tieneConvenio}
            onChange={(e) => setTieneConvenio(e.target.value)}
            className={inputCls}
          >
            <option value="">Todos</option>
            <option value="true">Con convenio</option>
            <option value="false">Sin convenio</option>
          </select>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <button
            onClick={aplicar}
            disabled={cargando}
            className="px-4 py-2 bg-uisek text-white text-sm rounded hover:bg-uisek-dark disabled:opacity-50 transition-colors"
          >
            <i className="fa-solid fa-magnifying-glass mr-1.5" />
            Buscar
          </button>
          {hayFiltros && (
            <button
              onClick={limpiar}
              disabled={cargando}
              className="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <i className="fa-solid fa-xmark mr-1" />
              Limpiar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
