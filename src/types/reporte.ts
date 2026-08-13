// Tipos para el módulo de Reportes Institucionales (Sprint 8)

export interface MetricasDashboard {
  total_estudiantes:    number;
  con_actividad:        number;
  sin_actividad:        number;
  total_tramites:       number;
  tramites_finalizados: number;
}

export interface PuntoGrafico {
  nombre: string;
  total:  number;
}

export interface GraficosDashboard {
  por_tipo_proceso: PuntoGrafico[];
  por_origen:       PuntoGrafico[];
  por_modalidad:    PuntoGrafico[];
  por_estado:       PuntoGrafico[];
}

export interface DashboardData {
  metricas: MetricasDashboard;
  graficos:  GraficosDashboard;
}

export interface FilaPlanificacion {
  cedula:               string;
  nombres:              string;
  apellidos:            string;
  carrera:              string;
  tipo_proceso:         string;
  modalidad:            string | null;
  institucion_empresa:  string | null;
  tiene_convenio:       boolean | null;
  estado:               string;
  fecha_inicio:         string | null;
  nombre_periodo:       string;
  id_tramite:           string;
}

export interface FiltrosPlanificacionParams {
  periodo_id?:      string;
  tipo_proceso_id?: string;
  estado?:          string;
  carrera?:         string;
  modalidad?:       string;
  tiene_convenio?:  string;
}
