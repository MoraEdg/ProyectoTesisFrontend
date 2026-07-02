import { useEffect, useRef, useState } from 'react';
import type { Documento, Observacion } from '../types/documento';
import { COLORES_ESTADO_DOCUMENTO } from './badgeEstado';
import ModalObservarDocumento from './ModalObservarDocumento';
import {
  listarDocumentosDeHito, subirDocumento, aprobarDocumento,
  observarDocumento, descargarDocumento, listarObservaciones,
} from '../api/documentosApi';

interface DocumentosHitoProps {
  hitoId: string;
  tipoDocumentoNombre?: string | null;
  esCoordinador: boolean;
  onCambio: () => void;
}

const ACCIONES_DOCUMENTO: Record<string, { estado: string; label: string; icon: string; color: string }[]> = {
  SUBIDO:      [
    { estado: 'APROBADO',  label: 'Aprobar',  icon: 'fa-solid fa-check', color: 'bg-green-600 hover:bg-green-700' },
    { estado: 'OBSERVADO', label: 'Observar', icon: 'fa-solid fa-triangle-exclamation', color: 'bg-yellow-600 hover:bg-yellow-700' },
  ],
  EN_REVISION: [
    { estado: 'APROBADO',  label: 'Aprobar',  icon: 'fa-solid fa-check', color: 'bg-green-600 hover:bg-green-700' },
    { estado: 'OBSERVADO', label: 'Observar', icon: 'fa-solid fa-triangle-exclamation', color: 'bg-yellow-600 hover:bg-yellow-700' },
  ],
  APROBADO:    [
    { estado: 'OBSERVADO', label: 'Revertir aprobación', icon: 'fa-solid fa-rotate-left', color: 'bg-yellow-600 hover:bg-yellow-700' },
  ],
  OBSERVADO:   [],
};

export default function DocumentosHito({ hitoId, tipoDocumentoNombre, esCoordinador, onCambio }: DocumentosHitoProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [cargando, setCargando]     = useState(true);
  const [subiendo, setSubiendo]     = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [error, setError]           = useState('');

  const [modalObservar, setModalObservar] = useState(false);
  const [docActivo, setDocActivo]         = useState<string | null>(null);

  const [observacionesAbiertas, setObservacionesAbiertas] = useState<string | null>(null);
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);

  const cargar = async () => {
    try {
      const data = await listarDocumentosDeHito(hitoId);
      setDocumentos(data);
    } catch {
      setError('No se pudieron cargar los documentos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { void cargar(); }, [hitoId]);

  const vigente = documentos.find((d) => d.estado !== 'REEMPLAZADO') ?? null;
  const anteriores = documentos.filter((d) => d.estado === 'REEMPLAZADO');

  const handleSeleccionarArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setSubiendo(true);
    setError('');
    try {
      await subirDocumento(hitoId, archivo);
      await cargar();
      onCambio();
    } catch (err) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      setError(apiErr.response?.data?.error ?? 'Error al subir el documento');
    } finally {
      setSubiendo(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleAprobar = async (id_doc: string) => {
    setProcesando(true);
    setError('');
    try {
      await aprobarDocumento(id_doc);
      await cargar();
      onCambio();
    } catch (err) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      setError(apiErr.response?.data?.error ?? 'Error al aprobar el documento');
    } finally {
      setProcesando(false);
    }
  };

  const abrirObservar = (id_doc: string) => {
    setDocActivo(id_doc);
    setModalObservar(true);
  };

  const confirmarObservar = async (comentario: string) => {
    if (!docActivo) return;
    setProcesando(true);
    setError('');
    try {
      await observarDocumento(docActivo, comentario);
      setModalObservar(false);
      setDocActivo(null);
      await cargar();
      onCambio();
    } catch (err) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      setError(apiErr.response?.data?.error ?? 'Error al observar el documento');
    } finally {
      setProcesando(false);
    }
  };

  const handleDescargar = async (doc: Documento) => {
    try {
      await descargarDocumento(doc.id_doc, doc.nombre_original);
    } catch {
      setError('Error al descargar el documento');
    }
  };

  const toggleObservaciones = async (id_doc: string) => {
    if (observacionesAbiertas === id_doc) {
      setObservacionesAbiertas(null);
      return;
    }
    try {
      const data = await listarObservaciones(id_doc);
      setObservaciones(data);
      setObservacionesAbiertas(id_doc);
    } catch {
      setError('No se pudieron cargar las observaciones');
    }
  };

  if (cargando) {
    return <p className="text-sm text-gray-400">Cargando documentos...</p>;
  }

  const puedeSubir = !vigente || vigente.estado === 'OBSERVADO';
  const acciones = vigente ? (ACCIONES_DOCUMENTO[vigente.estado] ?? []) : [];

  return (
    <div className="border-t border-gray-100 pt-3 mt-3">
      {error && (
        <div className="mb-3 px-3 py-2 rounded text-xs bg-red-50 border border-red-200 text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-3 font-bold hover:opacity-70">&times;</button>
        </div>
      )}

      {vigente ? (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 text-sm">
              <i className="fa-solid fa-file-pdf text-red-500" />
              <span className="text-gray-700">{vigente.nombre_original}</span>
              <span className="text-gray-400 text-xs">v{vigente.version}</span>
            </div>
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${COLORES_ESTADO_DOCUMENTO[vigente.estado] ?? 'bg-gray-100'}`}>
              {vigente.estado}
            </span>
          </div>
          <p className="text-xs text-gray-400 ml-6 mb-2">
            Subido por {vigente.subido_por_nombres} {vigente.subido_por_apellidos} — {new Date(vigente.fecha_subida).toLocaleDateString('es-EC')}
          </p>

          <div className="flex flex-wrap items-center gap-2 ml-6">
            <button
              onClick={() => void handleDescargar(vigente)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              <i className="fa-solid fa-download" /> Descargar
            </button>
            <button
              onClick={() => void toggleObservaciones(vigente.id_doc)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              <i className="fa-solid fa-comment" /> Observaciones
            </button>

            {esCoordinador && acciones.map((a) => (
              <button
                key={a.estado}
                disabled={procesando}
                onClick={() => a.estado === 'APROBADO' ? void handleAprobar(vigente.id_doc) : abrirObservar(vigente.id_doc)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs text-white rounded disabled:opacity-50 ${a.color}`}
              >
                <i className={a.icon} /> {a.label}
              </button>
            ))}
          </div>

          {observacionesAbiertas === vigente.id_doc && (
            <div className="ml-6 mt-2 space-y-1">
              {observaciones.length === 0 ? (
                <p className="text-xs text-gray-400">Sin observaciones</p>
              ) : observaciones.map((o) => (
                <div key={o.id_observacion} className="text-xs bg-white rounded px-2 py-1.5 border border-gray-100">
                  <span className="font-medium text-gray-600">{o.nombres} {o.apellidos}</span>
                  <span className="text-gray-400"> ({o.rol}): </span>
                  <span className="text-gray-600">{o.comentario}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mb-2">
          {tipoDocumentoNombre && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-2">
              <p className="text-xs font-medium text-blue-700 mb-1">Documento requerido:</p>
              <div className="flex items-center gap-1.5 text-sm text-blue-800">
                <i className="fa-solid fa-file-pdf text-red-400" />
                <span>{tipoDocumentoNombre}</span>
              </div>
            </div>
          )}
          <p className="text-xs text-gray-400">Sin documento subido aún</p>
        </div>
      )}

      {anteriores.length > 0 && (
        <p className="text-xs text-gray-400 mt-2">{anteriores.length} versión(es) anterior(es) reemplazada(s)</p>
      )}

      {puedeSubir && (
        <div className="mt-3">
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => void handleSeleccionarArchivo(e)}
            disabled={subiendo}
            className="text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-gray-300 file:text-xs file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
          {subiendo && <span className="text-xs text-gray-400 ml-2">Subiendo...</span>}
        </div>
      )}

      <ModalObservarDocumento
        visible={modalObservar}
        onConfirmar={(c) => void confirmarObservar(c)}
        onCancelar={() => { setModalObservar(false); setDocActivo(null); }}
        cargando={procesando}
      />
    </div>
  );
}
