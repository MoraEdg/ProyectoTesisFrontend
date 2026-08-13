import api from './axiosConfig';
import type { Convenio } from '../types/convenio';

export interface FiltrosConvenio {
  busqueda?: string;
  estado?:   string;
  anio?:     number | string;
}

// Carga todos los convenios en una sola consulta.
// La paginación se resuelve localmente en el frontend (D-CONV-05).
export async function listarConvenios(filtros: FiltrosConvenio = {}): Promise<Convenio[]> {
  const params: Record<string, string> = {};
  if (filtros.busqueda) params.busqueda = filtros.busqueda;
  if (filtros.estado)   params.estado   = filtros.estado;
  if (filtros.anio)     params.anio     = String(filtros.anio);

  const { data } = await api.get<{ success: boolean; data: Convenio[] }>('/convenios', { params });
  return data.data;
}
