import { useEffect, useState } from 'react';
import type { TipoDocumentoGenerado } from '../types/documentoGenerado';
import type { Tramite } from '../types/tramite';
import { ETIQUETAS_TIPO } from '../types/documentoGenerado';
import { listarTipos, generarDocumento } from '../api/generacionApi';

interface ModalGenerarDocumentoProps {
  visible: boolean;
  tramite: Tramite;
  onExito: () => void;
  onCerrar: () => void;
}

interface FormState {
  tipo_documento_generado_id: number | '';
  empresa: string;
  semestre: string;
  gerente: string;
  cargo: string;
}

const FORM_INICIAL: FormState = {
  tipo_documento_generado_id: '',
  empresa: '',
  semestre: '',
  gerente: '',
  cargo: '',
};

export default function ModalGenerarDocumento({ visible, tramite, onExito, onCerrar }: ModalGenerarDocumentoProps) {
  const [tipos, setTipos]         = useState<TipoDocumentoGenerado[]>([]);
  const [form, setForm]           = useState<FormState>(FORM_INICIAL);
  const [generando, setGenerando] = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    if (!visible) return;
    setForm(FORM_INICIAL);
    setError('');
    listarTipos()
      .then(setTipos)
      .catch(() => setError('No se pudieron cargar los tipos de documento'));
  }, [visible]);

  const tipoId = Number(form.tipo_documento_generado_id) || 0;
  const esConMarcadores = [1, 2, 3].includes(tipoId);
  const esCartaPeticion = tipoId === 3;
  const esFPP3 = tipoId === 4;

  const campo = (key: keyof FormState, valor: string) =>
    setForm((f) => ({ ...f, [key]: valor }));

  const puedeEnviar = () => {
    if (!tipoId) return false;
    if (esFPP3) return true;
    if (!form.empresa.trim() || !form.semestre.trim()) return false;
    if (esCartaPeticion && (!form.gerente.trim() || !form.cargo.trim())) return false;
    return true;
  };

  const handleGenerar = async () => {
    if (!puedeEnviar()) return;
    setGenerando(true);
    setError('');
    try {
      await generarDocumento(tramite.id_tramite, {
        tipo_documento_generado_id: tipoId,
        empresa:  form.empresa  || undefined,
        semestre: form.semestre || undefined,
        gerente:  form.gerente  || undefined,
        cargo:    form.cargo    || undefined,
      });
      onExito();
    } catch (err) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      setError(apiErr.response?.data?.error ?? 'Error al generar el documento');
    } finally {
      setGenerando(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">Generar documento oficial</h2>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="px-4 py-3 rounded text-sm bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          {/* Datos precargados (solo lectura) */}
          <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
            <div className="text-xs font-medium text-gray-500 mb-2">Datos del estudiante</div>
            <div className="flex gap-6">
              <div>
                <span className="text-gray-400 text-xs">Estudiante</span>
                <p className="text-gray-800 font-medium">{tramite.apellidos} {tramite.nombres}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Cédula</span>
                <p className="text-gray-800">{tramite.cedula}</p>
              </div>
            </div>
            <div>
              <span className="text-gray-400 text-xs">Carrera</span>
              <p className="text-gray-800">{tramite.carrera}</p>
            </div>
          </div>

          {/* Selector de tipo */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Tipo de documento <span className="text-red-500">*</span>
            </label>
            <select
              value={form.tipo_documento_generado_id}
              onChange={(e) => campo('tipo_documento_generado_id', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-uisek"
            >
              <option value="">— Seleccione un tipo —</option>
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>
                  {ETIQUETAS_TIPO[t.id] ?? t.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* FPP3: sin formulario */}
          {esFPP3 && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-700">
              <i className="fa-solid fa-circle-info mr-2" />
              La plantilla FPP3 se genera tal cual y no requiere datos adicionales.
              El estudiante la completa y firma manualmente.
            </div>
          )}

          {/* Campos según tipo */}
          {esConMarcadores && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Empresa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.empresa}
                  onChange={(e) => campo('empresa', e.target.value)}
                  maxLength={200}
                  placeholder="Nombre completo de la empresa"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-uisek"
                />
              </div>

              {esCartaPeticion && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Gerente / Representante <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.gerente}
                      onChange={(e) => campo('gerente', e.target.value)}
                      maxLength={150}
                      placeholder="Nombre completo del representante"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-uisek"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Cargo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.cargo}
                      onChange={(e) => campo('cargo', e.target.value)}
                      maxLength={150}
                      placeholder="Cargo del representante"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-uisek"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Semestre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.semestre}
                  onChange={(e) => campo('semestre', e.target.value)}
                  maxLength={30}
                  placeholder="Ej: Séptimo semestre"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-uisek"
                />
              </div>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onCerrar}
            disabled={generando}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => void handleGenerar()}
            disabled={!puedeEnviar() || generando}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-uisek text-white rounded hover:bg-uisek-dark disabled:opacity-40 transition-colors"
          >
            {generando
              ? <><i className="fa-solid fa-spinner fa-spin" /> Generando...</>
              : <><i className="fa-solid fa-file-word" /> Generar y descargar</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
