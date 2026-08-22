import api from './axiosConfig';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Rol {
  id:          number;
  nombre_rol:  string;
  descripcion: string;
}

export interface Funcionalidad {
  id:          number;
  modulo:      string;
  accion:      string;
  clave:       string;
  descripcion: string;
}

export interface PermisoRow {
  rol_id:          number;
  funcionalidad_id: number;
  habilitado:      boolean;
}

export interface MatrizData {
  roles:           Rol[];
  funcionalidades: Funcionalidad[];
  permisos:        PermisoRow[];
}

export interface CambioPermiso {
  rol_id:           number;
  funcionalidad_id: number;
  habilitado:       boolean;
}

// ─── /permisos/mios ───────────────────────────────────────────────────────────

/**
 * Obtiene las claves de permisos habilitados para el rol del usuario autenticado.
 * Llama a GET /api/v1/permisos/mios (requiere JWT en Authorization).
 * Se invoca una vez en el login; el resultado se persiste en localStorage.
 */
export async function fetchMisPermisos(): Promise<string[]> {
  const { data } = await api.get<{ data: string[] }>('/permisos/mios');
  return data.data;
}

// ─── /permisos/matriz ─────────────────────────────────────────────────────────

/**
 * Obtiene la matriz completa de roles, funcionalidades y permisos actuales.
 * Llama a GET /api/v1/permisos/matriz.
 *
 * Nota: data.permisos solo contiene pares que han sido insertados/actualizados
 * explícitamente. Los pares ausentes se interpretan como habilitado=false.
 */
export async function fetchMatriz(): Promise<MatrizData> {
  const { data } = await api.get<{ data: MatrizData }>('/permisos/matriz');
  return data.data;
}

/**
 * Envía al backend únicamente los cambios realizados sobre la matriz.
 * Llama a PUT /api/v1/permisos/matriz.
 *
 * El backend invalida su caché inmediatamente. El frontend de los usuarios
 * afectados actualiza sus permisos en el próximo inicio de sesión (D-SYNC).
 */
export async function actualizarMatriz(cambios: CambioPermiso[]): Promise<void> {
  await api.put('/permisos/matriz', { cambios });
}
