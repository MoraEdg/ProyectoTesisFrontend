import { useEffect, useState, useMemo, useCallback, Fragment } from 'react';
import {
  fetchMatriz,
  actualizarMatriz,
} from '../../api/permisosApi';
import type {
  Rol,
  Funcionalidad,
  PermisoRow,
  CambioPermiso,
} from '../../api/permisosApi';

// ─── Helpers puros (fuera del componente) ─────────────────────────────────────

/** Construye un mapa plano de permisos desde el array de la API.
 *  Clave: `"${rol_id}:${funcionalidad_id}"` → habilitado.
 *  Los pares NO presentes en el array se consideran false. */
function buildMap(permisos: PermisoRow[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (const p of permisos) {
    map[`${p.rol_id}:${p.funcionalidad_id}`] = p.habilitado;
  }
  return map;
}

/** Lee el valor efectivo de un par (rol, funcionalidad). Devuelve false si no existe. */
function getVal(
  map: Record<string, boolean>,
  rolId: number,
  funcId: number
): boolean {
  return map[`${rolId}:${funcId}`] ?? false;
}

/** Devuelve solo los pares cuyo valor difiere entre actual y original. */
function computarCambios(
  original: Record<string, boolean>,
  actual:   Record<string, boolean>
): CambioPermiso[] {
  return Object.keys(actual)
    .filter(key => actual[key] !== (original[key] ?? false))
    .map(key => {
      const [rol_id, funcionalidad_id] = key.split(':').map(Number);
      return { rol_id, funcionalidad_id, habilitado: actual[key] };
    });
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Configuracion() {
  // Estado de carga inicial
  const [cargando,        setCargando]        = useState(true);
  const [error,           setError]           = useState<string | null>(null);

  // Estado de guardado
  const [guardando,       setGuardando]       = useState(false);
  const [errorGuardando,  setErrorGuardando]  = useState<string | null>(null);
  const [exito,           setExito]           = useState(false);

  // Datos de la API
  const [roles,           setRoles]           = useState<Rol[]>([]);
  const [funcionalidades, setFuncionalidades] = useState<Funcionalidad[]>([]);

  // Matriz: dos copias para detectar cambios
  const [matrizOriginal, setMatrizOriginal] = useState<Record<string, boolean>>({});
  const [matrizActual,   setMatrizActual]   = useState<Record<string, boolean>>({});

  // ── Derivados ──────────────────────────────────────────────────────────────

  /** Funcionalidades agrupadas por módulo, en el orden que devuelve la API. */
  const modulos = useMemo<Map<string, Funcionalidad[]>>(() => {
    const map = new Map<string, Funcionalidad[]>();
    for (const f of funcionalidades) {
      if (!map.has(f.modulo)) map.set(f.modulo, []);
      map.get(f.modulo)!.push(f);
    }
    return map;
  }, [funcionalidades]);

  /** Cantidad de pares que difieren de la base original. */
  const cambiosPendientes = useMemo(
    () => computarCambios(matrizOriginal, matrizActual).length,
    [matrizOriginal, matrizActual]
  );

  // ── Carga inicial ──────────────────────────────────────────────────────────

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const { roles: r, funcionalidades: f, permisos: p } = await fetchMatriz();
      const mapa = buildMap(p);
      setRoles(r);
      setFuncionalidades(f);
      setMatrizOriginal(mapa);
      setMatrizActual({ ...mapa });
    } catch {
      setError('No se pudo cargar la matriz de permisos. Verifica la conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { void cargar(); }, [cargar]);

  // ── Toggle ─────────────────────────────────────────────────────────────────

  const handleToggle = (rolId: number, funcId: number) => {
    const key = `${rolId}:${funcId}`;
    setMatrizActual(prev => ({ ...prev, [key]: !(prev[key] ?? false) }));
  };

  // ── Guardar ────────────────────────────────────────────────────────────────

  const handleGuardar = async () => {
    const cambios = computarCambios(matrizOriginal, matrizActual);
    if (cambios.length === 0) return;

    setGuardando(true);
    setErrorGuardando(null);
    setExito(false);

    try {
      await actualizarMatriz(cambios);
      // Tras éxito, la base pasa a ser el estado actual
      setMatrizOriginal({ ...matrizActual });
      setExito(true);
      setTimeout(() => setExito(false), 4000);
    } catch (err) {
      const axErr = err as { response?: { data?: { error?: string } } };
      const msg   = axErr?.response?.data?.error
        ?? 'No se pudieron guardar los cambios. Intente nuevamente.';
      setErrorGuardando(msg);
    } finally {
      setGuardando(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Cabecera */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
          <p className="text-gray-500 text-sm mt-1">
            Administración de permisos del sistema.
          </p>
        </div>

        {/* Botón Guardar — solo visible cuando los datos están cargados */}
        {!cargando && !error && (
          <button
            onClick={() => void handleGuardar()}
            disabled={cambiosPendientes === 0 || guardando}
            className={`inline-flex items-center gap-2 px-5 py-2 text-sm rounded font-medium transition-colors ${
              cambiosPendientes > 0 && !guardando
                ? 'bg-uisek text-white hover:bg-uisek-dark'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {guardando ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" />
                Guardando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk" />
                {cambiosPendientes > 0
                  ? `Guardar cambios (${cambiosPendientes})`
                  : 'Sin cambios'}
              </>
            )}
          </button>
        )}
      </div>

      {/* Aviso D-SYNC */}
      <div className="flex items-start gap-3 px-4 py-3 mb-5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
        <i className="fa-solid fa-circle-info mt-0.5 shrink-0" />
        <span>
          Los cambios de permisos se aplican en el backend <strong>inmediatamente</strong>.
          Los usuarios afectados verán los cambios al <strong>iniciar sesión nuevamente</strong>.
        </span>
      </div>

      {/* Banner de éxito */}
      {exito && (
        <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          <i className="fa-solid fa-circle-check shrink-0" />
          <span>Permisos actualizados correctamente.</span>
        </div>
      )}

      {/* Banner de error al guardar */}
      {errorGuardando && (
        <div className="flex items-start justify-between gap-3 px-4 py-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-circle-xmark mt-0.5 shrink-0" />
            <span>{errorGuardando}</span>
          </div>
          <button
            onClick={() => setErrorGuardando(null)}
            className="text-red-500 hover:text-red-700 font-bold text-base leading-none shrink-0"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
      )}

      {/* Estado: cargando */}
      {cargando && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <i className="fa-solid fa-spinner fa-spin text-3xl mb-3" />
          <p className="text-sm">Cargando matriz de permisos...</p>
        </div>
      )}

      {/* Estado: error de carga */}
      {error && !cargando && (
        <div className="text-center py-16">
          <i className="fa-solid fa-triangle-exclamation text-4xl text-red-400 mb-4" />
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <button
            onClick={() => void cargar()}
            className="text-uisek hover:underline text-sm"
          >
            <i className="fa-solid fa-rotate-right mr-1" />
            Reintentar
          </button>
        </div>
      )}

      {/* Tabla de permisos */}
      {!cargando && !error && (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
          <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="text-white font-semibold" style={{ backgroundColor: '#6366F1' }}>
                <th className="px-4 py-3 text-left w-[240px]">Funcionalidad</th>
                {roles.map(rol => (
                  <th key={rol.id} className="px-3 py-3 text-center min-w-[120px]">
                    <span title={rol.descripcion}>{rol.nombre_rol}</span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Array.from(modulos.entries()).map(([modulo, funcs]) => (
                <Fragment key={modulo}>
                  {/* Encabezado de módulo */}
                  <tr className="bg-gray-100 border-t border-gray-200">
                    <td
                      colSpan={roles.length + 1}
                      className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {modulo}
                    </td>
                  </tr>

                  {/* Filas de funcionalidad */}
                  {funcs.map((func, idx) => (
                    <tr
                      key={func.id}
                      className={`border-b border-gray-100 ${idx % 2 === 0 ? '' : 'bg-gray-50'} hover:bg-blue-50/40`}
                      style={{ color: '#003399' }}
                    >
                      {/* Nombre de la acción con descripción como tooltip */}
                      <td className="px-4 py-2.5">
                        <span
                          title={func.descripcion}
                          className="cursor-default"
                        >
                          {func.accion}
                        </span>
                      </td>

                      {/* Celdas de checkbox por rol */}
                      {roles.map(rol => {
                        const activo   = getVal(matrizActual,   rol.id, func.id);
                        const original = getVal(matrizOriginal, rol.id, func.id);
                        const cambiado = activo !== original;

                        return (
                          <td
                            key={rol.id}
                            className={`px-3 py-2.5 text-center transition-colors ${
                              cambiado ? 'bg-amber-50' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={activo}
                              onChange={() => handleToggle(rol.id, func.id)}
                              disabled={guardando}
                              className="h-4 w-4 rounded border-gray-300 cursor-pointer disabled:cursor-not-allowed"
                              style={{ accentColor: '#085394' }}
                              aria-label={`${rol.nombre_rol} — ${func.accion}`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>

          {/* Leyenda de cambios pendientes */}
          {cambiosPendientes > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 border-t border-gray-100 bg-amber-50 text-amber-700 text-xs">
              <span className="inline-block w-3 h-3 rounded-sm bg-amber-100 border border-amber-300" />
              {cambiosPendientes === 1
                ? '1 cambio pendiente de guardar'
                : `${cambiosPendientes} cambios pendientes de guardar`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
