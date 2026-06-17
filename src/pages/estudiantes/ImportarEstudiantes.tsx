import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { importarEstudiantes } from '../../api/estudiantesApi';
import type { ResultadoImportacion } from '../../types/estudiante';

const EXTENSIONES_VALIDAS = ['.xlsx', '.xls', '.xlsm'];

export default function ImportarEstudiantes() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [archivo, setArchivo]       = useState<File | null>(null);
  const [cargando, setCargando]     = useState(false);
  const [error, setError]           = useState('');
  const [resultado, setResultado]   = useState<ResultadoImportacion | null>(null);

  const handleSeleccionar = (e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    setResultado(null);
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!EXTENSIONES_VALIDAS.includes(ext)) {
        setError('Solo se permiten archivos Excel (.xlsx, .xls, .xlsm)');
        setArchivo(null);
        return;
      }
    }
    setArchivo(file);
  };

  const handleImportar = async () => {
    if (!archivo) return;
    setCargando(true);
    setError('');
    setResultado(null);

    try {
      const res = await importarEstudiantes(archivo);
      setResultado(res);
      setArchivo(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      setError(apiErr.response?.data?.error ?? 'Error al procesar el archivo');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Importar Estudiantes</h1>
        <Link
          to="/estudiantes"
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-100 transition-colors"
        >
          <i className="fa-solid fa-arrow-left" />
          Volver al listado
        </Link>
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <p className="font-medium mb-2">
          <i className="fa-solid fa-circle-info mr-2" />
          Formato de la plantilla Excel:
        </p>
        <ul className="list-disc ml-6 space-y-1">
          <li>La hoja debe llamarse <strong>Estudiantes</strong></li>
          <li>Columnas requeridas: <strong>Cedula, Apellidos, Nombres, Correo, Matricula, Carrera</strong></li>
          <li>Columna opcional: <strong>Telefono</strong></li>
          <li>Archivos permitidos: .xlsx, .xls, .xlsm</li>
        </ul>
      </div>

      {/* Selector de archivo */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.xlsm"
            onChange={handleSeleccionar}
            className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
          <button
            onClick={() => void handleImportar()}
            disabled={!archivo || cargando}
            className="inline-flex items-center gap-2 px-6 py-2 bg-uisek text-white text-sm rounded hover:bg-uisek-dark disabled:opacity-50 transition-colors"
          >
            {cargando ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" />
                Procesando archivo...
              </>
            ) : (
              <>
                <i className="fa-solid fa-upload" />
                Importar
              </>
            )}
          </button>
        </div>

        {archivo && !cargando && (
          <p className="mt-3 text-sm text-gray-500">
            <i className="fa-solid fa-file-excel text-green-600 mr-2" />
            {archivo.name}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-4 font-bold hover:opacity-70">&times;</button>
        </div>
      )}

      {/* Resultado */}
      {resultado && (
        <div className="space-y-4">
          {/* Resumen */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Resultado de la importación</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-800">{resultado.total}</p>
                <p className="text-xs text-gray-500">Total procesados</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-700">{resultado.exitosos}</p>
                <p className="text-xs text-green-600">Exitosos</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-700">{resultado.omitidos.length}</p>
                <p className="text-xs text-yellow-600">Omitidos</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-700">{resultado.errores.length}</p>
                <p className="text-xs text-red-600">Errores</p>
              </div>
            </div>
          </div>

          {/* Omitidos */}
          {resultado.omitidos.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-bold text-yellow-700 mb-3">
                <i className="fa-solid fa-triangle-exclamation mr-2" />
                Omitidos ({resultado.omitidos.length})
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="py-2 px-3 w-20">Fila</th>
                    <th className="py-2 px-3">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.omitidos.map((r, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-2 px-3 text-gray-700">{r.fila}</td>
                      <td className="py-2 px-3 text-gray-600">{r.motivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Errores */}
          {resultado.errores.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-bold text-red-700 mb-3">
                <i className="fa-solid fa-circle-xmark mr-2" />
                Errores ({resultado.errores.length})
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="py-2 px-3 w-20">Fila</th>
                    <th className="py-2 px-3">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.errores.map((r, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-2 px-3 text-gray-700">{r.fila}</td>
                      <td className="py-2 px-3 text-gray-600">{r.motivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
