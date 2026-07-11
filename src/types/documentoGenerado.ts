export interface TipoDocumentoGenerado {
  id: number;
  nombre: string;
  plantilla_id: number;
}

export interface DocumentoGenerado {
  id_documento_generado: string;
  nombre_archivo: string;
  fecha_generacion: string;
  tipo_id: number;
  tipo_documento: string;
  generador_nombres: string;
  generador_apellidos: string;
}

// Etiquetas de interfaz: el nombre en BD es el nombre institucional;
// la UI muestra el prefijo FPP donde aplica.
export const ETIQUETAS_TIPO: Record<number, string> = {
  1: 'FPP2 - Carta de Formalización (con convenio)',
  2: 'FPP2 - Carta de Formalización (sin convenio)',
  3: 'Carta de Petición',
  4: 'FPP3 - Seguimiento (plantilla vacía)',
};
