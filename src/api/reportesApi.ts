import api from './axiosConfig';
import type { DashboardData, FilaPlanificacion, FiltrosPlanificacionParams } from '../types/reporte';

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await api.get<{ success: boolean; data: DashboardData }>('/reportes/dashboard');
  return data.data;
}

export async function getPlanificacion(filtros: FiltrosPlanificacionParams = {}): Promise<FilaPlanificacion[]> {
  // Elimina las claves vacías para no enviar parámetros vacíos al backend
  const params: Record<string, string> = {};
  for (const [k, v] of Object.entries(filtros)) {
    if (v !== undefined && v !== '') params[k] = String(v);
  }
  const { data } = await api.get<{ success: boolean; data: FilaPlanificacion[] }>(
    '/reportes/planificacion',
    { params }
  );
  return data.data;
}
