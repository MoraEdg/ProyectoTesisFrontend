export const ROLES = {
  ESTUDIANTE:  'Estudiante',
  COORDINADOR: 'Coordinador',
  DIRECTOR:    'Director',
  DECANO:      'Decano',
} as const;

export type Rol = typeof ROLES[keyof typeof ROLES];
