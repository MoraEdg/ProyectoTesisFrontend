import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { getPlanificacion } from '../../api/reportesApi';
import type { FilaPlanificacion, FiltrosPlanificacionParams } from '../../types/reporte';
import { COLORES_ESTADO_TRAMITE } from '../badgeEstado';
import FiltrosPlanificacion from './FiltrosPlanificacion';

const POR_PAGINA = 10;

// Convierte "YYYY-MM-DD..." → "dd/mm/yyyy" sin depender de locale ni Date
function fmtFecha(iso: string | null): string {
  if (!iso) return '-';
  const [year, month, day] = iso.substring(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

function textoConvenio(val: boolean | null): string {
  if (val === null || val === undefined) return 'Sin especificar';
  return val ? 'Sí' : 'No';
}

function exportarExcel(filas: FilaPlanificacion[]) {
  const datos = filas.map((f) => ({
    Cédula:               f.cedula,
    Apellidos:            f.apellidos,
    Nombres:              f.nombres,
    Carrera:              f.carrera,
    'Tipo Proceso':       f.tipo_proceso,
    Modalidad:            f.modalidad ?? '-',
    'Institución/Empresa': f.institucion_empresa ?? '-',
    Convenio:             textoConvenio(f.tiene_convenio),
    Estado:               f.estado,
    'Fecha Inicio':       fmtFecha(f.fecha_inicio),
    Período:              f.nombre_periodo,
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Planificación');

  // Ajustar ancho de columnas automáticamente
  const cols = Object.keys(datos[0] ?? {}).map((key) => ({
    wch: Math.max(key.length, ...datos.map((r) => String(r[key as keyof typeof r] ?? '').length)) + 2,
  }));
  ws['!cols'] = cols;

  XLSX.writeFile(wb, `planificacion_${new Date().toISOString().substring(0, 10)}.xlsx`);
}

export default function PlanificacionSemestral() {
  const [filas,    setFilas]    = useState<FilaPlanificacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error,    setError]    = useState('');
  const [pagina,   setPagina]   = useState(1);

  const cargarDatos = (filtros: FiltrosPlanificacionParams = {}) => {
    setCargando(true);
    setError('');
    setPagina(1);
    getPlanificacion(filtros)
      .then(setFilas)
      .catch(() => setError('No se pudo cargar la información. Intente nuevamente.'))
      .finally(() => setCargando(false));
  };

  // Carga inicial sin filtros
  useEffect(() => { cargarDatos(); }, []);

  const totalPaginas = Math.max(1, Math.ceil(filas.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const items        = useMemo(
    () => filas.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA),
    [filas, paginaActual]
  );

  return (
    <div>
      <FiltrosPlanificacion onBuscar={cargarDatos} cargando={cargando} />

      {/* Cabecera de la tabla con contador y botón de exportar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <span className="text-sm text-gray-500">
          {cargando ? 'Cargando...' : `${filas.length} registro${filas.length !== 1 ? 's' : ''} encontrado${filas.length !== 1 ? 's' : ''}`}
        </span>
        {!cargando && filas.length > 0 && (
          <button
            onClick={() => exportarExcel(filas)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
          >
            <i className="fa-solid fa-file-excel" />
            Exportar Excel
          </button>
        )}
      </div>

      {/* Estado de carga / error / sin resultados */}
      {cargando && (
        <div className="text-center py-16 text-gray-400">
          <i className="fa-solid fa-spinner fa-spin text-2xl mb-2 block" />
          Cargando registros...
        </div>
      )}

      {!cargando && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          <i className="fa-solid fa-triangle-exclamation mr-2" />{error}
        </div>
      )}

      {!cargando && !error && filas.length === 0 && (
        <div className="text-center py-16">
          <i className="fa-solid fa-table-list text-4xl text-gray-200 mb-3 block" />
          <p className="text-gray-500 text-sm">No se encontraron registros con los criterios indicados.</p>
        </div>
      )}

      {/* Tabla */}
      {!cargando && !error && filas.length > 0 && (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Estudiante</th>
                    <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Carrera</th>
                    <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Tipo proceso</th>
                    <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Modalidad</th>
                    <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Institución/Empresa</th>
                    <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Estado</th>
                    <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Período</th>
                    <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Inicio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((f) => (
                    <tr key={f.id_tramite} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-800">{f.apellidos} {f.nombres}</div>
                        <div className="text-xs text-gray-400">{f.cedula}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[160px]">
                        <span className="line-clamp-2 text-xs">{f.carrera}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">{f.tipo_proceso}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                        {f.modalidad ?? <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px]">
                        <span className="line-clamp-2 text-xs">
                          {f.institucion_empresa ?? <span className="text-gray-300">—</span>}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${COLORES_ESTADO_TRAMITE[f.estado] ?? 'bg-gray-100 text-gray-700'}`}>
                          {f.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{f.nombre_periodo}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{fmtFecha(f.fecha_inicio)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Mostrando {(paginaActual - 1) * POR_PAGINA + 1}–{Math.min(paginaActual * POR_PAGINA, filas.length)} de {filas.length}
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
        </>
      )}
    </div>
  );
}
