import { useEffect, useMemo, useState } from 'react';
import { listarConvenios, listarTiposConvenio } from '../../api/conveniosApi';
import type { TipoConvenio } from '../../api/conveniosApi';
import type { Convenio } from '../../types/convenio';
import { COLORES_ESTADO_CONVENIO } from '../../components/badgeEstado';
import ModalDetalleConvenio from '../../components/ModalDetalleConvenio';
import { useAuth } from '../../context/AuthContext';

const POR_PAGINA = 10;

// Convierte "YYYY-MM-DD..." → "dd/mm/yyyy" sin depender de locale ni Date.
// Los primeros 10 caracteres cubren tanto "2021-03-02" como "2021-03-02T00:00:00.000Z".
function fmtFecha(iso: string | null): string {
  if (!iso) return '-';
  const [year, month, day] = iso.substring(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

export default function ListaConvenios() {
  const { tienePermiso } = useAuth();

  const [todos, setTodos]       = useState<Convenio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState('');

  // Filtros locales (cliente) — busqueda, estado, anio
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado]     = useState('');
  const [anio, setAnio]         = useState('');

  // Filtro por tipo de convenio (D-CONV-FILTRO) — enviado al backend con FK
  const [tipoConvenioId, setTipoConvenioId] = useState<number | ''>('');
  const [tiposConvenio, setTiposConvenio]   = useState<TipoConvenio[]>([]);

  // El filtro de tipo solo se muestra si el rol tiene el permiso del catálogo
  const puedeFiltrarTipo = tienePermiso('catalogos.ver_tipos_convenio');

  // Paginación
  const [pagina, setPagina] = useState(1);

  // Modal
  const [convenioVer, setConvenioVer] = useState<Convenio | null>(null);

  // Carga (o recarga) de convenios desde el backend.
  // tipo_convenio_id se envía como parámetro de query (D-CONV-FILTRO).
  // Los demás filtros se aplican localmente (D-CONV-05).
  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError('');
    setTodos([]);

    listarConvenios({
      tipo_convenio_id: tipoConvenioId !== '' ? tipoConvenioId : undefined,
    })
      .then((data) => { if (!cancelado) setTodos(data); })
      .catch(() => {
        if (!cancelado) setError('No se pudo conectar con el servidor. Intente nuevamente.');
      })
      .finally(() => { if (!cancelado) setCargando(false); });

    return () => { cancelado = true; };
  }, [tipoConvenioId]);

  // Carga el catálogo de tipos de convenio solo si el rol tiene el permiso.
  // Si falla o no tiene permiso, el selector de tipo simplemente no se muestra.
  useEffect(() => {
    if (!puedeFiltrarTipo) return;
    listarTiposConvenio()
      .then(setTiposConvenio)
      .catch(() => { /* silencioso: el selector no aparece */ });
  }, [puedeFiltrarTipo]);

  // Catálogos derivados de los datos cargados (para los filtros locales)
  const estadosDisponibles = useMemo(
    () => [...new Set(todos.map((c) => c.estado))].sort(),
    [todos]
  );
  const aniosDisponibles = useMemo(
    () => [...new Set(todos.map((c) => c.anio).filter(Boolean) as number[])].sort((a, b) => b - a),
    [todos]
  );

  // Filtrado local (busqueda, estado, anio) sobre el conjunto cargado
  const filtrados = useMemo(() => {
    const bq = busqueda.toLowerCase().trim();
    return todos.filter((c) => {
      if (bq && !c.institucion.toLowerCase().includes(bq) && !c.codigo_convenio.toLowerCase().includes(bq)) return false;
      if (estado && c.estado !== estado) return false;
      if (anio && String(c.anio) !== anio) return false;
      return true;
    });
  }, [todos, busqueda, estado, anio]);

  const totalPaginas  = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual  = Math.min(pagina, totalPaginas);
  const items         = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);
  const hayFiltros    = !!(busqueda || estado || anio || tipoConvenioId !== '');

  const limpiarFiltros = () => {
    setBusqueda('');
    setEstado('');
    setAnio('');
    setTipoConvenioId('');
    setPagina(1);
  };

  // Restablecer página al cambiar filtros locales
  const cambiarFiltro = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPagina(1);
  };

  const cambiarTipo = (id: number | '') => {
    setTipoConvenioId(id);
    setBusqueda('');
    setEstado('');
    setAnio('');
    setPagina(1);
  };

  if (cargando) {
    return (
      <div className="text-center py-12 text-gray-500">
        <i className="fa-solid fa-spinner fa-spin text-2xl mb-2" />
        <p>Cargando convenios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <i className="fa-solid fa-triangle-exclamation text-3xl text-red-400 mb-3" />
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Convenios</h1>
        <span className="text-sm text-gray-400">{filtrados.length} convenio{filtrados.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Barra de filtros */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          {/* Búsqueda */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => cambiarFiltro(setBusqueda)(e.target.value)}
                placeholder="Buscar por empresa o código..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-uisek"
              />
            </div>
          </div>

          {/* Tipo de convenio — solo si el rol tiene catalogos.ver_tipos_convenio (D-CONV-FILTRO) */}
          {puedeFiltrarTipo && tiposConvenio.length > 0 && (
            <select
              value={tipoConvenioId}
              onChange={(e) => cambiarTipo(e.target.value === '' ? '' : Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-uisek"
            >
              <option value="">Todos los tipos</option>
              {tiposConvenio.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          )}

          {/* Estado */}
          <select
            value={estado}
            onChange={(e) => cambiarFiltro(setEstado)(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-uisek"
          >
            <option value="">Todos los estados</option>
            {estadosDisponibles.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>

          {/* Año */}
          <select
            value={anio}
            onChange={(e) => cambiarFiltro(setAnio)(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-uisek"
          >
            <option value="">Todos los años</option>
            {aniosDisponibles.map((a) => (
              <option key={a} value={String(a)}>{a}</option>
            ))}
          </select>

          {/* Limpiar */}
          {hayFiltros && (
            <button
              onClick={limpiarFiltros}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              <i className="fa-solid fa-xmark mr-1" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
        {filtrados.length === 0 ? (
          <div className="text-center py-12">
            <i className="fa-solid fa-file-contract text-3xl text-gray-200 mb-3" />
            <p className="text-gray-500 text-sm">
              {hayFiltros
                ? 'No se encontraron convenios con esos criterios'
                : 'No hay convenios registrados'}
            </p>
            {hayFiltros && (
              <button onClick={limpiarFiltros} className="mt-3 text-uisek hover:underline text-sm">
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Empresa</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Código</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Tipo</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Año</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Estado</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Finalización</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((c) => (
                  <tr key={c.id_convenio} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-800 font-medium max-w-[280px]">
                      <span className="line-clamp-2">{c.institucion}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{c.codigo_convenio}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{c.tipo}</td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{c.anio ?? '—'}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${COLORES_ESTADO_CONVENIO[c.estado] ?? 'bg-gray-100 text-gray-700'}`}>
                        {c.estado}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{fmtFecha(c.fecha_finalizacion)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setConvenioVer(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-uisek text-white rounded hover:bg-uisek-dark transition-colors"
                      >
                        <i className="fa-solid fa-eye" />
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Mostrando {(paginaActual - 1) * POR_PAGINA + 1}–{Math.min(paginaActual * POR_PAGINA, filtrados.length)} de {filtrados.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
              className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fa-solid fa-chevron-left" />
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPagina(n)}
                className={`px-3 py-1.5 border rounded transition-colors ${
                  n === paginaActual
                    ? 'bg-uisek text-white border-uisek'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaActual === totalPaginas}
              className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>
        </div>
      )}

      <ModalDetalleConvenio convenio={convenioVer} onCerrar={() => setConvenioVer(null)} />
    </div>
  );
}
