export interface Estudiante {
  id_estudiante: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  correo: string;
  telefono: string | null;
  carrera: string;
  matricula: string;
  nombre_usuario: string;
  estado: boolean;
}

export interface MetaPaginacion {
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
}

export interface FilaReporte {
  fila: number;
  motivo: string;
}

export interface ResultadoImportacion {
  total: number;
  exitosos: number;
  omitidos: FilaReporte[];
  errores: FilaReporte[];
}
