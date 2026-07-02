import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerTramite, obtenerHistorial, cambiarEstadoTramite, cerrarTramite } from '../../api/tramitesApi';
import { listarHitosDeTramite } from '../../api/hitosApi';
import type { Tramite, HistorialEntry } from '../../types/tramite';
import type { Hito } from '../../types/hito';
import { useAuth } from '../../context/AuthContext';
import { COLORES_ESTADO_TRAMITE } from '../../components/badgeEstado';
import ModalCambioEstado from '../../components/ModalCambioEstado';
import TimelineHitos from '../../components/TimelineHitos';

const TRANSICIONES: Record<string, { estado: string; label: string; icon: string }[]> = {
  INICIADO:    [{ estado: 'EN_REVISION', label: 'Enviar a revisión', icon: 'fa-solid fa-paper-plane' }],
  EN_REVISION: [
    { estado: 'OBSERVADO', label: 'Observar', icon: 'fa-solid fa-triangle-exclamation' },
  ],
  OBSERVADO:   [{ estado: 'CORREGIDO', label: 'Marcar corregido', icon: 'fa-solid fa-rotate' }],
  CORREGIDO:   [{ estado: 'EN_REVISION', label: 'Reenviar a revisión', icon: 'fa-solid fa-paper-plane' }],
  APROBADO:    [],
};

export default function DetalleTramite() {
  const { id } = useParams<{ id: string }>();
  const { usuario } = useAuth();
  const esCoordinador = usuario?.rol === 'Coordinador';

  const [tramite, setTramite]       = useState<Tramite | null>(null);
  const [historial, setHistorial]   = useState<HistorialEntry[]>([]);
  const [hitos, setHitos]           = useState<Hito[]>([]);
  const [cargando, setCargando]     = useState(true);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [alerta, setAlerta]         = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  const [modalVisible, setModalVisible]     = useState(false);
  const [estadoDestino, setEstadoDestino]   = useState('');
  const [procesando, setProcesando]         = useState(false);

  const cargarDatos = async () => {
    if (!id) return;
    try {
      const [t, h, hi] = await Promise.all([
        obtenerTramite(id),
        obtenerHistorial(id),
        listarHitosDeTramite(id),
      ]);
      setTramite(t);
      setHistorial(h);
      setHitos(hi);
    } catch (err) {
      if ((err as { response?: { status?: number } }).response?.status === 404) setNoEncontrado(true);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { void cargarDatos(); }, [id]);

  const recargar = () => {
    setCargando(true);
    void cargarDatos();
  };

  const abrirModal = (estado: string) => {
    setEstadoDestino(estado);
    setModalVisible(true);
  };

  const confirmarCambio = async (comentario: string) => {
    if (!id) return;
    setProcesando(true);
    try {
      await cambiarEstadoTramite(id, estadoDestino, comentario || undefined);
      setAlerta({ tipo: 'exito', texto: 'Estado actualizado correctamente' });
      setModalVisible(false);
      recargar();
    } catch (err) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      setAlerta({ tipo: 'error', texto: apiErr.response?.data?.error ?? 'Error al cambiar el estado' });
    } finally {
      setProcesando(false);
    }
  };

  const handleCerrar = async () => {
    if (!id) return;
    setProcesando(true);
    try {
      await cerrarTramite(id);
      setAlerta({ tipo: 'exito', texto: 'Trámite finalizado correctamente' });
      recargar();
    } catch (err) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      setAlerta({ tipo: 'error', texto: apiErr.response?.data?.error ?? 'Error al finalizar' });
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <div className="text-center py-12 text-gray-500">
        <i className="fa-solid fa-spinner fa-spin text-2xl mb-2" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (noEncontrado) {
    return (
      <div className="text-center py-12">
        <i className="fa-solid fa-folder-xmark text-4xl text-gray-300 mb-4" />
        <p className="text-gray-600 mb-4">Trámite no encontrado</p>
        <Link to={esCoordinador ? '/tramites' : '/mis-tramites'} className="text-uisek hover:underline text-sm">
          Volver
        </Link>
      </div>
    );
  }

  if (!tramite) return null;

  const accionesDisponibles = TRANSICIONES[tramite.estado] ?? [];

  const campos = [
    { label: 'Código',     valor: tramite.codigo_tramite },
    { label: 'Estudiante', valor: `${tramite.apellidos} ${tramite.nombres}` },
    { label: 'Cédula',     valor: tramite.cedula },
    { label: 'Carrera',    valor: tramite.carrera },
    { label: 'Proceso',    valor: tramite.tipo_proceso },
    { label: 'Período',    valor: tramite.periodo },
    { label: 'Fecha inicio', valor: new Date(tramite.fecha_inicio).toLocaleDateString('es-EC') },
    { label: 'Fecha cierre', valor: tramite.fecha_cierre ? new Date(tramite.fecha_cierre).toLocaleDateString('es-EC') : '—' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Detalle del Trámite</h1>
        <Link
          to={esCoordinador ? '/tramites' : '/mis-tramites'}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-100 transition-colors"
        >
          <i className="fa-solid fa-arrow-left" />
          Volver
        </Link>
      </div>

      {alerta && (
        <div className={`mb-4 px-4 py-3 rounded text-sm flex items-center justify-between ${
          alerta.tipo === 'exito' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <span>{alerta.texto}</span>
          <button onClick={() => setAlerta(null)} className="ml-4 font-bold hover:opacity-70">&times;</button>
        </div>
      )}

      {/* Datos + estado */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${COLORES_ESTADO_TRAMITE[tramite.estado] ?? 'bg-gray-100'}`}>
            {tramite.estado}
          </span>
          <span className="text-gray-400 text-xs">{tramite.codigo_tramite}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {campos.map((c) => (
            <div key={c.label}>
              <span className="block text-xs text-gray-400 mb-1">{c.label}</span>
              <span className="text-gray-800">{c.valor}</span>
            </div>
          ))}
        </div>

        {/* Acciones de estado del trámite — solo Coordinador */}
        {esCoordinador && (accionesDisponibles.length > 0 || tramite.estado === 'APROBADO') && (
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
            {accionesDisponibles.map((a) => (
              <button
                key={a.estado}
                onClick={() => abrirModal(a.estado)}
                disabled={procesando}
                className="inline-flex items-center gap-2 px-4 py-2 bg-uisek text-white text-sm rounded hover:bg-uisek-dark disabled:opacity-50 transition-colors"
              >
                <i className={a.icon} />
                {a.label}
              </button>
            ))}
            {tramite.estado === 'APROBADO' && (
              <button
                onClick={() => void handleCerrar()}
                disabled={procesando}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <i className="fa-solid fa-flag-checkered" />
                Finalizar trámite
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hitos del trámite */}
      {hitos.length > 0 && (
        <div className="mb-6">
          <TimelineHitos hitos={hitos} esCoordinador={esCoordinador} onCambio={recargar} />
        </div>
      )}

      {/* Historial de estados */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Historial de estados</h2>

        {historial.length === 0 ? (
          <p className="text-gray-400 text-sm">Sin historial</p>
        ) : (
          <div className="relative pl-6 border-l-2 border-gray-200 space-y-6">
            {historial.map((h) => (
              <div key={h.id_historial} className="relative">
                <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-uisek border-2 border-white" />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${COLORES_ESTADO_TRAMITE[h.estado] ?? 'bg-gray-100'}`}>
                      {h.estado}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(h.fecha_cambio).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{h.nombres ? `${h.nombres} ${h.apellidos}` : 'Sistema'}</span>
                    <span className="text-gray-400"> ({h.rol})</span>
                  </p>
                  {h.comentario && (
                    <p className="text-sm text-gray-500 mt-1 italic">{h.comentario}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ModalCambioEstado
        visible={modalVisible}
        estadoDestino={estadoDestino}
        onConfirmar={(c) => void confirmarCambio(c)}
        onCancelar={() => setModalVisible(false)}
        cargando={procesando}
      />
    </div>
  );
}
