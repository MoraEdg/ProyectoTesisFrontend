import api from './axiosConfig';
import type { Convenio } from '../types/convenio';

export interface TipoConvenio {
  id:     number;
  nombre: string;
}

export interface FiltrosConvenio {
  busqueda?:         string;
  estado?:           string;
  anio?:             number | string;
  tipo_convenio_id?: number;
}

// Carga convenios aplicando filtros opcionales en el backend.
// El filtro tipo_convenio_id se envía al servidor (D-CONV-FILTRO).
// busqueda, estado y anio se aplican localmente en el frontend (D-CONV-05).
export async function listarConvenios(filtros: FiltrosConvenio = {}): Promise<Convenio[]> {
  const params: Record<string, string> = {};
  if (filtros.busqueda)         params.busqueda         = filtros.busqueda;
  if (filtros.estado)           params.estado           = filtros.estado;
  if (filtros.anio)             params.anio             = String(filtros.anio);
  if (filtros.tipo_convenio_id) params.tipo_convenio_id = String(filtros.tipo_convenio_id);

  const { data } = await api.get<{ success: boolean; data: Convenio[] }>('/convenios', { params });
  return data.data;
}

// Obtiene el catálogo de tipos de convenio para el selector de filtro.
// Requiere el permiso catalogos.ver_tipos_convenio en el rol del usuario.
export async function listarTiposConvenio(): Promise<TipoConvenio[]> {
  const { data } = await api.get<{ success: boolean; data: TipoConvenio[] }>(
    '/catalogos/tipos-convenio'
  );
  return data.data;
}
