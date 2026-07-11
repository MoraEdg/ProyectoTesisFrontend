import { useEffect, useState } from 'react';
import type { DocumentoGenerado } from '../types/documentoGenerado';
import { ETIQUETAS_TIPO } from '../types/documentoGenerado';
import { listarGenerados, descargarGenerado } from '../api/generacionApi';

interface DocumentosGeneradosProps {
  tramiteId: string;
}

export default function DocumentosGenerados({ tramiteId }: DocumentosGeneradosProps) {
  const [documentos, setDocumentos] = useState<DocumentoGenerado[]>([]);
  const [cargando, setCargando]     = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    setCargando(true);
    listarGenerados(tramiteId)
      .then(setDocumentos)
      .catch(() => setError('No se pudo cargar el historial de documentos generados'))
      .finally(() => setCargando(false));
  }, [tramiteId]);

  const handleDescargar = async (doc: DocumentoGenerado) => {
    try {
      await descargarGenerado(doc.id_documento_generado, doc.nombre_archivo);
    } catch {
      setError('Error al descargar el documento');
    }
  };

  const etiquetaDeTipo = (doc: DocumentoGenerado) =>
    ETIQUETAS_TIPO[doc.tipo_id] ?? doc.tipo_documento;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Documentos generados</h2>

      {error && (
        <div className="mb-4 px-4 py-3 rounded text-sm bg-red-50 border border-red-200 text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-4 font-bold hover:opacity-70">&times;</button>
        </div>
      )}

      {cargando ? (
        <p className="text-sm text-gray-400">Cargando...</p>
      ) : documentos.length === 0 ? (
        <p className="text-sm text-gray-400">No se han generado documentos para este trámite.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-white" style={{ backgroundColor: '#6366F1' }}>
                <th className="px-3 py-2 rounded-tl">Tipo</th>
                <th className="px-3 py-2">Archivo</th>
                <th className="px-3 py-2">Generado por</th>
                <th className="px-3 py-2 rounded-tr text-center">Fecha</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {documentos.map((doc, i) => (
                <tr
                  key={doc.id_documento_generado}
                  className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="px-3 py-2 text-gray-700 font-medium">
                    {etiquetaDeTipo(doc)}
                  </td>
                  <td className="px-3 py-2 text-gray-500 text-xs font-mono">
                    {doc.nombre_archivo}
                  </td>
                  <td className="px-3 py-2 text-gray-600">
                    {doc.generador_nombres} {doc.generador_apellidos}
                  </td>
                  <td className="px-3 py-2 text-gray-500 text-center text-xs whitespace-nowrap">
                    {new Date(doc.fecha_generacion).toLocaleString('es-EC', {
                      dateStyle: 'short', timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => void handleDescargar(doc)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                    >
                      <i className="fa-solid fa-download" /> Descargar
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
