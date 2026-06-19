export interface Hito {
  id_hito: string;
  tramite_id?: string;
  orden: number;
  nombre: string;
  descripcion: string | null;
  estado: string;
  rol_responsable: string;
  fecha_aprobacion: string | null;
  aprobador_nombres: string | null;
  aprobador_apellidos: string | null;
}

export interface HistorialHitoEntry {
  estado: string;
  autor: string;
  rol: string;
  comentario: string | null;
  fecha_cambio: string;
}
