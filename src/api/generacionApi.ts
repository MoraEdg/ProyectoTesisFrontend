import api from './axiosConfig';
import type { TipoDocumentoGenerado, DocumentoGenerado } from '../types/documentoGenerado';

interface RespuestaLista<T> {
  success: boolean;
  data: T[];
}

export async function listarTipos(): Promise<TipoDocumentoGenerado[]> {
  const res = await api.get<RespuestaLista<TipoDocumentoGenerado>>('/generacion/tipos');
  return res.data.data;
}

interface DatosGeneracion {
  tipo_documento_generado_id: number;
  empresa?: string;
  semestre?: string;
  gerente?: string;
  cargo?: string;
}

// Genera el documento y lo descarga de inmediato.
// El nombre del archivo se extrae del header Content-Disposition.
export async function generarDocumento(tramiteId: string, datos: DatosGeneracion): Promise<void> {
  const res = await api.post(
    `/tramites/${tramiteId}/generar-documento`,
    datos,
    { responseType: 'blob' }
  );

  const disposition: string = (res.headers as Record<string, string>)['content-disposition'] ?? '';
  const match = disposition.match(/filename="(.+?)"/);
  const nombreArchivo = match ? match[1] : 'documento.docx';

  const url  = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
  const link = document.createElement('a');
  link.href     = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function listarGenerados(tramiteId: string): Promise<DocumentoGenerado[]> {
  const res = await api.get<RespuestaLista<DocumentoGenerado>>(
    `/tramites/${tramiteId}/documentos-generados`
  );
  return res.data.data;
}

export async function descargarGenerado(id: string, nombreArchivo: string): Promise<void> {
  const res = await api.get(`/generacion/documentos/${id}/descargar`, { responseType: 'blob' });
  const url  = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
  const link = document.createElement('a');
  link.href     = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
