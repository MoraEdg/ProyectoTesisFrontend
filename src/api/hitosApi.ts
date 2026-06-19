import api from './axiosConfig';
import type { Hito, HistorialHitoEntry } from '../types/hito';

interface RespuestaLista {
  success: boolean;
  data: Hito[];
}

interface RespuestaUno {
  success: boolean;
  data: Hito;
}

interface RespuestaHistorial {
  success: boolean;
  data: HistorialHitoEntry[];
}

export async function listarHitosDeTramite(tramiteId: string) {
  const res = await api.get<RespuestaLista>(`/tramites/${tramiteId}/hitos`);
  return res.data.data;
}

export async function obtenerHito(id: string) {
  const res = await api.get<RespuestaUno>(`/hitos/${id}`);
  return res.data.data;
}

export async function cambiarEstadoHito(id: string, estado: string, comentario?: string) {
  const res = await api.patch<RespuestaUno>(`/hitos/${id}/estado`, { estado, comentario });
  return res.data.data;
}

export async function obtenerHistorialHito(id: string) {
  const res = await api.get<RespuestaHistorial>(`/hitos/${id}/historial`);
  return res.data.data;
}
