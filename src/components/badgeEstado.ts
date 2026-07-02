export const COLORES_ESTADO_TRAMITE: Record<string, string> = {
  INICIADO:    'bg-gray-100 text-gray-700',
  EN_REVISION: 'bg-blue-100 text-blue-700',
  OBSERVADO:   'bg-yellow-100 text-yellow-700',
  CORREGIDO:   'bg-teal-100 text-teal-700',
  APROBADO:    'bg-green-100 text-green-700',
  FINALIZADO:  'bg-purple-100 text-purple-700',
};

export const COLORES_ESTADO_HITO: Record<string, string> = {
  PENDIENTE:   'bg-gray-100 text-gray-700',
  EN_REVISION: 'bg-blue-100 text-blue-700',
  OBSERVADO:   'bg-yellow-100 text-yellow-700',
  APROBADO:    'bg-green-100 text-green-700',
};

export const COLORES_ESTADO_DOCUMENTO: Record<string, string> = {
  SUBIDO:      'bg-gray-100 text-gray-700',
  EN_REVISION: 'bg-blue-100 text-blue-700',
  OBSERVADO:   'bg-yellow-100 text-yellow-700',
  APROBADO:    'bg-green-100 text-green-700',
  REEMPLAZADO: 'bg-slate-100 text-slate-500',
};
