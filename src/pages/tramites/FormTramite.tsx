import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { crearTramite, obtenerTiposProceso, obtenerPeriodos } from '../../api/tramitesApi';
import { listarEstudiantes } from '../../api/estudiantesApi';
import type { Estudiante } from '../../types/estudiante';
import type { TipoProceso, Periodo } from '../../types/tramite';

export default function FormTramite() {
  const navigate = useNavigate();

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [procesos, setProcesos]       = useState<TipoProceso[]>([]);
  const [periodos, setPeriodos]       = useState<Periodo[]>([]);

  const [estudianteId, setEstudianteId]     = useState('');
  const [tipoProcesoId, setTipoProcesoId]   = useState('');
  const [periodoId, setPeriodoId]             = useState('');

  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [cargando, setCargando]           = useState(false);
  const [errorApi, setErrorApi]           = useState('');

  useEffect(() => {
    Promise.all([
      listarEstudiantes().then(r => r.data),
      obtenerTiposProceso(),
      obtenerPeriodos(),
    ])
      .then(([est, proc, per]) => {
        setEstudiantes(est.filter((e: Estudiante) => e.estado));
        setProcesos(proc);
        setPeriodos(per);
        const activo = per.find((p: Periodo) => p.activo);
        if (activo) setPeriodoId(String(activo.id));
      })
      .catch(() => setErrorApi('No se pudieron cargar los datos'))
      .finally(() => setCargandoDatos(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorApi('');

    if (!estudianteId || !tipoProcesoId || !periodoId) {
      setErrorApi('Todos los campos son obligatorios');
      return;
    }

    setCargando(true);
    try {
      const nuevo = await crearTramite({
        estudiante_id: estudianteId,
        tipo_proceso_id: parseInt(tipoProcesoId),
        periodo_id: parseInt(periodoId),
      });
      navigate(`/tramites/${nuevo.id_tramite}`);
    } catch (err) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      setErrorApi(apiErr.response?.data?.error ?? 'Error al crear el trámite');
    } finally {
      setCargando(false);
    }
  };

  if (cargandoDatos) {
    return (
      <div className="text-center py-12 text-gray-500">
        <i className="fa-solid fa-spinner fa-spin text-2xl mb-2" />
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nuevo Trámite</h1>

      {errorApi && (
        <div className="mb-4 px-4 py-3 rounded text-sm bg-red-50 border border-red-200 text-red-700 flex items-center justify-between">
          <span>{errorApi}</span>
          <button onClick={() => setErrorApi('')} className="ml-4 font-bold hover:opacity-70">&times;</button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-5">
            {/* Estudiante */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Estudiante *</label>
              <select
                value={estudianteId}
                onChange={(e) => setEstudianteId(e.target.value)}
                className="w-full h-12 px-4 text-sm border border-[#d8d8d8] rounded outline-none focus:border-uisek focus:shadow-[0_0_0_2px_rgba(8,83,148,0.2)] bg-white"
              >
                <option value="">Seleccionar estudiante...</option>
                {estudiantes.map((est) => (
                  <option key={est.id_estudiante} value={est.id_estudiante}>
                    {est.apellidos} {est.nombres} — {est.cedula}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de proceso */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tipo de proceso *</label>
              <select
                value={tipoProcesoId}
                onChange={(e) => setTipoProcesoId(e.target.value)}
                className="w-full h-12 px-4 text-sm border border-[#d8d8d8] rounded outline-none focus:border-uisek focus:shadow-[0_0_0_2px_rgba(8,83,148,0.2)] bg-white"
              >
                <option value="">Seleccionar proceso...</option>
                {procesos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            {/* Período */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Período *</label>
              <select
                value={periodoId}
                onChange={(e) => setPeriodoId(e.target.value)}
                className="w-full h-12 px-4 text-sm border border-[#d8d8d8] rounded outline-none focus:border-uisek focus:shadow-[0_0_0_2px_rgba(8,83,148,0.2)] bg-white"
              >
                <option value="">Seleccionar período...</option>
                {periodos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre_periodo} {p.activo ? '(activo)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <Link
              to="/tramites"
              className="px-6 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={cargando}
              className="px-6 py-2 bg-uisek text-white text-sm rounded hover:bg-uisek-dark disabled:opacity-50 transition-colors"
            >
              {cargando ? 'Creando...' : 'Crear Trámite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
