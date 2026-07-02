import api from './axiosConfig';
import type { Documento, Observacion } from '../types/documento';

interface RespuestaLista {
  success: boolean;
  data: Documento[];
}

interface RespuestaUno {
  success: boolean;
  data: Documento;
}

interface RespuestaObservaciones {
  success: boolean;
  data: Observacion[];
}

export async function listarDocumentosDeHito(hitoId: string) {
  const res = await api.get<RespuestaLista>(`/hitos/${hitoId}/documentos`);
  return res.data.data;
}

export async function subirDocumento(hitoId: string, archivo: File) {
  const form = new FormData();
  form.append('archivo', archivo);
  const res = await api.post<RespuestaUno>(`/hitos/${hitoId}/documentos`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}

export async function obtenerDocumento(id: string) {
  const res = await api.get<RespuestaUno>(`/documentos/${id}`);
  return res.data.data;
}

export async function aprobarDocumento(id: string) {
  const res = await api.patch<RespuestaUno>(`/documentos/${id}/aprobar`);
  return res.data.data;
}

export async function observarDocumento(id: string, comentario: string) {
  const res = await api.patch<RespuestaUno>(`/documentos/${id}/observar`, { comentario });
  return res.data.data;
}

export async function listarObservaciones(id: string) {
  const res = await api.get<RespuestaObservaciones>(`/documentos/${id}/observaciones`);
  return res.data.data;
}

export async function descargarDocumento(id: string, nombreArchivo: string) {
  const res = await api.get(`/documentos/${id}/descargar`, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
