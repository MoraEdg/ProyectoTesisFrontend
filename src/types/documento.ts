export interface Documento {
  id_doc: string;
  hito_id: string;
  tipo_documento_id: number;
  nombre_original: string;
  nombre_sistema?: string;
  ruta?: string;
  mime_type?: string;
  tamano_bytes?: number;
  version: number;
  subido_por: string;
  estado_id: number;
  estado: string;
  tipo_documento: string;
  obligatorio: boolean;
  tramite_id?: string;
  fecha_subida: string;
  updated_at?: string;
  subido_por_nombres: string;
  subido_por_apellidos: string;
}

export interface Observacion {
  id_observacion: string;
  comentario: string;
  fecha_observacion: string;
  nombres: string;
  apellidos: string;
  rol: string;
}
