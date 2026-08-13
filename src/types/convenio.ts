export interface Convenio {
  id_convenio:             string;
  codigo_convenio:         string;
  institucion:             string;
  descripcion:             string | null;
  otorgado_para:           string | null;    // campo "objeto"
  responsable_institucion: string | null;
  direccion:               string | null;
  correo_contacto:         string | null;
  telefono_contacto:       string | null;
  anio:                    number | null;
  fecha_firma:             string | null;    // DATE como string ISO
  fecha_finalizacion:      string | null;
  duracion:                string | null;
  proponente_universidad:  string | null;
  posee_archivo_fisico:    boolean;
  posee_archivo_digital:   boolean;
  observaciones:           string | null;
  tipo:                    string;           // nombre del tipo (PRIVADO, PÚBLICO, etc.)
  estado:                  string;           // nombre del estado (VIGENTE, CADUCADO, etc.)
}
