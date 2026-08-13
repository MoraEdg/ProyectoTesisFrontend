import type { Convenio } from '../types/convenio';
import { COLORES_ESTADO_CONVENIO } from './badgeEstado';

interface Props {
  convenio: Convenio | null;
  onCerrar: () => void;
}

// Convierte "YYYY-MM-DD..." → "dd/mm/yyyy".
// Toma solo los primeros 10 caracteres para soportar tanto strings "2021-03-02"
// como ISO completos "2021-03-02T00:00:00.000Z" (que devuelve pg al serializar DATE).
function fmtFecha(iso: string | null): string {
  if (!iso) return '-';
  const [year, month, day] = iso.substring(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

function Campo({ label, valor }: { label: string; valor: string | null | undefined }) {
  return (
    <div>
      <span className="block text-xs text-gray-400 mb-0.5">{label}</span>
      <span className="text-sm text-gray-800">{valor || '—'}</span>
    </div>
  );
}

export default function ModalDetalleConvenio({ convenio, onCerrar }: Props) {
  if (!convenio) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">

        {/* Cabecera — siempre visible */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-800 leading-tight">{convenio.institucion}</h2>
            <span className="text-xs text-gray-400">{convenio.codigo_convenio}</span>
          </div>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600 text-xl font-bold ml-4">
            &times;
          </button>
        </div>

        {/* Contenido — scrollable */}
        <div className="px-6 py-5 overflow-y-auto flex-1 space-y-6">

          {/* Badges de estado y tipo */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${COLORES_ESTADO_CONVENIO[convenio.estado] ?? 'bg-gray-100 text-gray-700'}`}>
              {convenio.estado}
            </span>
            <span className="inline-block px-3 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
              {convenio.tipo}
            </span>
            {convenio.anio && (
              <span className="inline-block px-3 py-1 rounded text-xs font-medium bg-indigo-50 text-indigo-700">
                {convenio.anio}
              </span>
            )}
          </div>

          {/* Bloque 1: Información general */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Información general
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <Campo label="Empresa / Institución" valor={convenio.institucion} />
              <Campo label="Código del convenio"   valor={convenio.codigo_convenio} />
              <div className="md:col-span-2">
                <Campo label="Descripción" valor={convenio.descripcion} />
              </div>
            </div>
          </section>

          {/* Bloque 2: Contacto */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <Campo label="Responsable"  valor={convenio.responsable_institucion} />
              <Campo label="Teléfono"     valor={convenio.telefono_contacto} />
              <div className="md:col-span-2">
                <Campo label="Dirección" valor={convenio.direccion} />
              </div>
              <div className="md:col-span-2">
                <span className="block text-xs text-gray-400 mb-0.5">Correo</span>
                {convenio.correo_contacto ? (
                  <div className="space-y-0.5">
                    {convenio.correo_contacto.split(';').map((email, i) => (
                      <div key={i} className="text-sm text-gray-800 break-all">{email.trim()}</div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-800">-</span>
                )}
              </div>
            </div>
          </section>

          {/* Bloque 3: Fechas */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Fechas y duración
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <Campo label="Fecha de firma"        valor={fmtFecha(convenio.fecha_firma)} />
              <Campo label="Fecha de finalización" valor={fmtFecha(convenio.fecha_finalizacion)} />
              <div className="md:col-span-2">
                <span className="block text-xs text-gray-400 mb-0.5">Duración</span>
                {convenio.duracion ? (
                  <div className="space-y-1">
                    {convenio.duracion.split('//').map((parte, i) => {
                      const t = parte.trim();
                      // Primera parte: duración base ("3 años") — sin punto
                      // Partes siguientes: capitalizar + añadir punto si falta
                      if (i === 0) return <div key={i} className="text-sm text-gray-800">{t}</div>;
                      const cap = t.charAt(0).toUpperCase() + t.slice(1);
                      return (
                        <div key={i} className="text-sm text-gray-800">
                          {cap.endsWith('.') ? cap : `${cap}.`}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-sm text-gray-800">-</span>
                )}
              </div>
            </div>
          </section>

          {/* Bloque 4: Información institucional */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Información institucional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <div className="md:col-span-2">
                <Campo label="Objeto del convenio" valor={convenio.otorgado_para} />
              </div>
              <Campo label="Proponente UISEK" valor={convenio.proponente_universidad} />
              <div className="flex gap-6">
                <div>
                  <span className="block text-xs text-gray-400 mb-0.5">Archivo físico</span>
                  <span className={`text-sm font-medium ${convenio.posee_archivo_fisico ? 'text-green-700' : 'text-gray-400'}`}>
                    {convenio.posee_archivo_fisico ? 'Sí' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 mb-0.5">Archivo digital</span>
                  <span className={`text-sm font-medium ${convenio.posee_archivo_digital ? 'text-green-700' : 'text-gray-400'}`}>
                    {convenio.posee_archivo_digital ? 'Sí' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Pie — siempre visible */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onCerrar}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}
