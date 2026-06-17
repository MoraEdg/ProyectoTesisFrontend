import api from './axiosConfig';
import type { Estudiante, MetaPaginacion, ResultadoImportacion } from '../types/estudiante';

interface RespuestaListar {
  success: boolean;
  data: Estudiante[];
  meta: MetaPaginacion;
}

interface RespuestaUno {
  success: boolean;
  data: Estudiante;
}

interface RespuestaImportar {
  success: boolean;
  data: ResultadoImportacion;
}

export interface DatosCrear {
  nombres: string;
  apellidos: string;
  cedula: string;
  correo: string;
  telefono?: string;
  carrera: string;
  matricula: string;
}

export interface DatosEditar {
  nombres?: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
  carrera?: string;
  matricula?: string;
}

export async function listarEstudiantes() {
  const res = await api.get<RespuestaListar>('/estudiantes');
  return { data: res.data.data, meta: res.data.meta };
}

export async function obtenerEstudiante(id: string) {
  const res = await api.get<RespuestaUno>(`/estudiantes/${id}`);
  return res.data.data;
}

export async function crearEstudiante(datos: DatosCrear) {
  const res = await api.post<RespuestaUno>('/estudiantes', datos);
  return res.data.data;
}

export async function editarEstudiante(id: string, datos: DatosEditar) {
  const res = await api.put<RespuestaUno>(`/estudiantes/${id}`, datos);
  return res.data.data;
}

export async function desactivarEstudiante(id: string) {
  await api.patch(`/estudiantes/${id}/desactivar`);
}

export async function importarEstudiantes(archivo: File) {
  const form = new FormData();
  form.append('archivo', archivo);
  const res = await api.post<RespuestaImportar>('/estudiantes/importar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}
