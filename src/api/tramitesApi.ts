import api from './axiosConfig';
import type { Tramite, HistorialEntry, MetaPaginacion, TipoProceso, Periodo } from '../types/tramite';

interface RespuestaListar {
  success: boolean;
  data: Tramite[];
  meta: MetaPaginacion;
}

interface RespuestaUno {
  success: boolean;
  data: Tramite;
}

interface RespuestaHistorial {
  success: boolean;
  data: HistorialEntry[];
}

interface RespuestaCatalogo<T> {
  success: boolean;
  data: T[];
}

export async function listarTramites() {
  const res = await api.get<RespuestaListar>('/tramites');
  return { data: res.data.data, meta: res.data.meta };
}

export async function obtenerTramite(id: string) {
  const res = await api.get<RespuestaUno>(`/tramites/${id}`);
  return res.data.data;
}

export async function crearTramite(datos: { estudiante_id: string; tipo_proceso_id: number; periodo_id: number }) {
  const res = await api.post<RespuestaUno>('/tramites', datos);
  return res.data.data;
}

export async function cambiarEstadoTramite(id: string, estado: string, comentario?: string) {
  const res = await api.patch<RespuestaUno>(`/tramites/${id}/estado`, { estado, comentario });
  return res.data.data;
}

export async function cerrarTramite(id: string) {
  const res = await api.post<RespuestaUno>(`/tramites/${id}/cerrar`);
  return res.data.data;
}

export async function obtenerHistorial(id: string) {
  const res = await api.get<RespuestaHistorial>(`/tramites/${id}/historial`);
  return res.data.data;
}

export async function obtenerTiposProceso() {
  const res = await api.get<RespuestaCatalogo<TipoProceso>>('/catalogos/tipos-proceso');
  return res.data.data;
}

export async function obtenerPeriodos() {
  const res = await api.get<RespuestaCatalogo<Periodo>>('/catalogos/periodos');
  return res.data.data;
}
