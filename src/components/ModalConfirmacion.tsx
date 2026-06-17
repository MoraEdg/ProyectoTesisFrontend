interface ModalConfirmacionProps {
  visible: boolean;
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  cargando?: boolean;
}

export default function ModalConfirmacion({
  visible,
  mensaje,
  onConfirmar,
  onCancelar,
  cargando = false,
}: ModalConfirmacionProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        <div className="flex items-center mb-4">
          <i className="fa-solid fa-triangle-exclamation text-yellow-500 text-2xl mr-3" />
          <h3 className="text-lg font-bold text-gray-800">Confirmación</h3>
        </div>
        <p className="text-gray-600 mb-6">{mensaje}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            disabled={cargando}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={cargando}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {cargando ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
