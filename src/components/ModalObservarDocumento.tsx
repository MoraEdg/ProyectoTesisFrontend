import { useState } from 'react';

interface ModalObservarDocumentoProps {
  visible: boolean;
  onConfirmar: (comentario: string) => void;
  onCancelar: () => void;
  cargando?: boolean;
}

export default function ModalObservarDocumento({
  visible,
  onConfirmar,
  onCancelar,
  cargando = false,
}: ModalObservarDocumentoProps) {
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState('');

  if (!visible) return null;

  const handleConfirmar = () => {
    if (!comentario.trim()) {
      setError('El comentario de observación es obligatorio');
      return;
    }
    onConfirmar(comentario.trim());
    setComentario('');
    setError('');
  };

  const handleCancelar = () => {
    setComentario('');
    setError('');
    onCancelar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Observar documento</h3>

        <textarea
          value={comentario}
          onChange={(e) => { setComentario(e.target.value); setError(''); }}
          placeholder="Describa el motivo de la observación (obligatorio)"
          rows={4}
          className={`w-full border rounded px-3 py-2 text-sm outline-none focus:border-uisek focus:shadow-[0_0_0_2px_rgba(8,83,148,0.2)] resize-none ${error ? 'border-red-400' : 'border-[#d8d8d8]'}`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

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
            className="px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:opacity-50"
          >
            {cargando ? 'Procesando...' : 'Observar'}
          </button>
        </div>
      </div>
    </div>
  );
}
