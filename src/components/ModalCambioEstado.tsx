import { useState } from 'react';

interface ModalCambioEstadoProps {
  visible: boolean;
  estadoDestino: string;
  onConfirmar: (comentario: string) => void;
  onCancelar: () => void;
  cargando?: boolean;
}

const ETIQUETAS: Record<string, { titulo: string; color: string }> = {
  EN_REVISION: { titulo: 'Enviar a revisión',     color: 'bg-blue-600 hover:bg-blue-700' },
  OBSERVADO:   { titulo: 'Observar trámite',       color: 'bg-yellow-600 hover:bg-yellow-700' },
  CORREGIDO:   { titulo: 'Marcar como corregido',  color: 'bg-teal-600 hover:bg-teal-700' },
  APROBADO:    { titulo: 'Aprobar trámite',         color: 'bg-green-600 hover:bg-green-700' },
  FINALIZADO:  { titulo: 'Finalizar trámite',       color: 'bg-uisek hover:bg-uisek-dark' },
};

export default function ModalCambioEstado({
  visible,
  estadoDestino,
  onConfirmar,
  onCancelar,
  cargando = false,
}: ModalCambioEstadoProps) {
  const [comentario, setComentario] = useState('');

  if (!visible) return null;

  const etiqueta = ETIQUETAS[estadoDestino] ?? { titulo: `Cambiar a ${estadoDestino}`, color: 'bg-gray-600 hover:bg-gray-700' };

  const handleConfirmar = () => {
    onConfirmar(comentario.trim());
    setComentario('');
  };

  const handleCancelar = () => {
    setComentario('');
    onCancelar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{etiqueta.titulo}</h3>

        <p className="text-sm text-gray-500 mb-3">
          Estado destino: <span className="font-medium text-gray-700">{estadoDestino}</span>
        </p>

        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Comentario (opcional)"
          rows={3}
          className="w-full border border-[#d8d8d8] rounded px-3 py-2 text-sm outline-none focus:border-uisek focus:shadow-[0_0_0_2px_rgba(8,83,148,0.2)] resize-none"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={handleCancelar}
            disabled={cargando}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={cargando}
            className={`px-4 py-2 text-white text-sm rounded disabled:opacity-50 ${etiqueta.color}`}
          >
            {cargando ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
