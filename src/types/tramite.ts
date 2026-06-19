export interface Tramite {
  id_tramite: string;
  codigo_tramite: string;
  fecha_inicio: string;
  fecha_cierre: string | null;
  created_at: string;
  updated_at: string;
  tipo_proceso_id: number;
  tipo_proceso: string;
  periodo_id: number;
  periodo: string;
  estado_id: number;
  estado: string;
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  correo?: string;
  carrera: string;
  matricula: string;
}

export interface HistorialEntry {
  id_historial: string;
  estado: string;
  categoria: string;
  comentario: string | null;
  fecha_cambio: string;
  nombres: string;
  apellidos: string;
  rol: string;
}

export interface TipoProceso {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface Periodo {
  id: number;
  nombre_periodo: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export interface MetaPaginacion {
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
}
