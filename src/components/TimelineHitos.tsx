import { useState } from 'react';
import type { Hito } from '../types/hito';
import { COLORES_ESTADO_HITO } from './badgeEstado';
import ModalCambioEstado from './ModalCambioEstado';
import DocumentosHito from './DocumentosHito';
import { cambiarEstadoHito } from '../api/hitosApi';

interface TimelineHitosProps {
  hitos: Hito[];
  esCoordinador: boolean;
  onCambio: () => void;
}

const TRANSICIONES_HITO: Record<string, { estado: string; label: string; icon: string }[]> = {
  PENDIENTE:   [{ estado: 'EN_REVISION', label: 'Enviar a revisión', icon: 'fa-solid fa-paper-plane' }],
  EN_REVISION: [
    { estado: 'APROBADO',  label: 'Aprobar',  icon: 'fa-solid fa-check' },
    { estado: 'OBSERVADO', label: 'Observar', icon: 'fa-solid fa-triangle-exclamation' },
  ],
  OBSERVADO:   [{ estado: 'EN_REVISION', label: 'Volver a revisión', icon: 'fa-solid fa-rotate' }],
  APROBADO:    [{ estado: 'EN_REVISION', label: 'Revertir aprobación', icon: 'fa-solid fa-rotate-left' }],
};

export default function TimelineHitos({ hitos, esCoordinador, onCambio }: TimelineHitosProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [estadoDestino, setEstadoDestino] = useState('');
  const [hitoActivo, setHitoActivo] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');

  const abrirModal = (hitoId: string, estado: string) => {
    setHitoActivo(hitoId);
    setEstadoDestino(estado);
    setModalVisible(true);
    setError('');
  };

  const confirmar = async (comentario: string) => {
    if (!hitoActivo) return;
    setProcesando(true);
    setError('');
    try {
      await cambiarEstadoHito(hitoActivo, estadoDestino, comentario || undefined);
      setModalVisible(false);
      setHitoActivo(null);
      onCambio();
    } catch (err) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      setError(apiErr.response?.data?.error ?? 'Error al cambiar el estado del hito');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Hitos del trámite</h2>

      {error && (
        <div className="mb-4 px-4 py-3 rounded text-sm bg-red-50 border border-red-200 text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-4 font-bold hover:opacity-70">&times;</button>
        </div>
      )}

      <div className="space-y-4">
        {hitos.map((h) => {
          // Hitos con documento obligatorio se gestionan vía DocumentosHito, no manualmente
          const acciones = h.tiene_documento_obligatorio ? [] : (TRANSICIONES_HITO[h.estado] ?? []);
          return (
            <div key={h.id_hito} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50/50">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-uisek text-white text-xs font-bold flex items-center justify-center">
                    {h.orden}
                  </span>
                  <span className="font-medium text-gray-800">{h.nombre}</span>
                </div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${COLORES_ESTADO_HITO[h.estado] ?? 'bg-gray-100'}`}>
                  {h.estado}
                </span>
              </div>

              <div className="ml-10 text-sm text-gray-500 space-y-1">
                <div>Responsable: <span className="text-gray-700">{h.rol_responsable}</span></div>
                {h.fecha_aprobacion && (
                  <div>
                    Aprobado por: <span className="text-gray-700">{h.aprobador_nombres} {h.aprobador_apellidos}</span>
                    {' — '}{new Date(h.fecha_aprobacion).toLocaleDateString('es-EC')}
                  </div>
                )}
              </div>

              {esCoordinador && acciones.length > 0 && (
                <div className="ml-10 mt-3 flex flex-wrap gap-2">
                  {acciones.map((a) => (
                    <button
                      key={a.estado}
                      onClick={() => abrirModal(h.id_hito, a.estado)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-uisek text-white rounded hover:bg-uisek-dark transition-colors"
                    >
                      <i className={a.icon} />
                      {a.label}
                    </button>
                  ))}
                </div>
              )}

              {h.tiene_documento_obligatorio && (
                <div className="ml-10">
                  <DocumentosHito
                    hitoId={h.id_hito}
                    tipoDocumentoNombre={h.tipo_documento_nombre}
                    esCoordinador={esCoordinador}
                    onCambio={onCambio}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ModalCambioEstado
        visible={modalVisible}
        estadoDestino={estadoDestino}
        onConfirmar={(c) => void confirmar(c)}
        onCancelar={() => { setModalVisible(false); setHitoActivo(null); }}
        cargando={procesando}
      />
    </div>
  );
}
