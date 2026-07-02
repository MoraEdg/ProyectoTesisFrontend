# Frontend — Sistema de Gestión de Prácticas Preprofesionales UISEK

**Autor:** Edgar Mora  
**Proyecto de Tesis — Universidad SEK**

| Recurso | Enlace |
|---|---|
| Repositorio Frontend | https://github.com/MoraEdg/ProyectoTesisFrontend.git |
| Repositorio Backend | https://github.com/MoraEdg/ProyectoTesisBackend.git |
| Tablero Jira | https://edgarmoratesis.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog |

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19.x | Librería UI |
| Vite | 7.x | Bundler y servidor de desarrollo |
| TypeScript | 5.8 | Tipado estático |
| Tailwind CSS | 3.x | Estilos utilitarios |
| react-router-dom | 6.x | Enrutamiento SPA |
| axios | 1.7.x | Cliente HTTP |
| react-hook-form | 7.x | Gestión de formularios |

---

## Estructura del proyecto

```
src/
├── api/
│   ├── axiosConfig.ts          — Instancia de Axios con interceptores JWT y manejo de 401
│   ├── estudiantesApi.ts       — Funciones API del módulo de estudiantes
│   ├── tramitesApi.ts          — Funciones API del módulo de trámites y catálogos
│   ├── hitosApi.ts             — Funciones API del módulo de hitos
│   └── documentosApi.ts        — Funciones API del módulo de documentos (subir, aprobar, observar, descargar)
├── components/
│   ├── PrivateRoute.tsx        — Protección de rutas por autenticación y rol
│   ├── Layout.tsx              — Layout institucional (navbar + sidebar dinámico por rol)
│   ├── ModalConfirmacion.tsx   — Modal de confirmación (desactivar estudiantes)
│   ├── ModalCambioEstado.tsx   — Modal de cambio de estado con comentario
│   ├── TimelineHitos.tsx       — Lista visual de hitos con acciones por estado
│   ├── DocumentosHito.tsx      — Gestión de documentos de un hito (subir, aprobar, observar, descargar)
│   ├── ModalObservarDocumento.tsx — Modal de observación con comentario obligatorio
│   └── badgeEstado.ts          — Colores centralizados de estados (trámite + hito + documento)
├── context/
│   └── AuthContext.tsx         — Contexto de autenticación global (AuthProvider, useAuth)
├── pages/
│   ├── Login.tsx               — Login con identidad visual institucional UISEK
│   ├── Dashboard.tsx           — Panel dinámico por rol con accesos a módulos
│   ├── MisTramites.tsx         — Lista de trámites del Estudiante (solo lectura)
│   ├── estudiantes/
│   │   ├── ListaEstudiantes.tsx      — Tabla de estudiantes con acciones
│   │   ├── DetalleEstudiante.tsx     — Vista de solo lectura
│   │   ├── FormEstudiante.tsx        — Formulario crear/editar (modo dual)
│   │   └── ImportarEstudiantes.tsx   — Importación desde Excel con reporte
│   └── tramites/
│       ├── ListaTramites.tsx         — Tabla de trámites (Coordinador)
│       ├── FormTramite.tsx           — Crear trámite (estudiante + proceso + período)
│       └── DetalleTramite.tsx        — Detalle + hitos + timeline historial + acciones
├── types/
│   ├── estudiante.ts           — Interfaces del módulo de estudiantes
│   ├── tramite.ts              — Interfaces del módulo de trámites
│   ├── hito.ts                 — Interfaces del módulo de hitos
│   └── documento.ts            — Interfaces del módulo de documentos
└── utils/
    └── roles.ts                — Constantes de roles del sistema
```

---

## Requisitos previos

- Node.js 20+
- El [backend](https://github.com/MoraEdg/ProyectoTesisBackend) debe estar corriendo en `http://localhost:5000`

---

## Configuración inicial

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/MoraEdg/ProyectoTesisFrontend.git
cd ProyectoTesisFrontend
npm install
```

### 2. Configurar variables de entorno

El archivo `.env` ya incluye la configuración por defecto:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Para apuntar a otro entorno, crear `.env.local` y sobreescribir la variable.

### 3. Levantar en desarrollo

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### 4. Build de producción

```bash
npm run build
npm run preview
```

---

## Autenticación

El sistema usa **JWT Bearer token** almacenado en `localStorage`.

- El token se añade automáticamente a cada request HTTP via interceptor de Axios.
- Si el servidor responde con `401`, el token se elimina y se redirige a `/login`.
- La sesión se restaura automáticamente al recargar la página desde `localStorage`.

**Credenciales de prueba:**

| Campo | Valor |
|---|---|
| Usuario | `admin` |
| Contraseña | `Admin1234` |
| Rol | `Coordinador` |
| Ruta post-login | `/dashboard` |

---

## Roles y rutas protegidas

| Rol | Ruta inicial | Acceso |
|---|---|---|
| `Estudiante` | `/mis-tramites` | Solo sus trámites |
| `Coordinador` | `/dashboard` | Gestión completa |
| `Director` | `/tramites` | Revisión de trámites |
| `Decano` | `/tramites` | Aprobación final |

Las rutas están protegidas por `PrivateRoute` que verifica autenticación y rol antes de renderizar.

---

## Módulo de Estudiantes (Sprint 2)

Acceso exclusivo del rol **Coordinador**.

| Ruta | Página | Descripción |
|---|---|---|
| `/estudiantes` | ListaEstudiantes | Tabla con acciones Ver, Editar, Desactivar |
| `/estudiantes/nuevo` | FormEstudiante | Registro manual de un estudiante |
| `/estudiantes/:id` | DetalleEstudiante | Vista de solo lectura |
| `/estudiantes/:id/editar` | FormEstudiante | Edición (cédula no modificable) |
| `/estudiantes/importar` | ImportarEstudiantes | Importación masiva desde Excel |

---

## Módulo de Trámites (Sprint 3)

**Coordinador:** gestión completa de trámites.
**Estudiante:** consulta de sus propios trámites (solo lectura).

| Ruta | Página | Roles |
|---|---|---|
| `/tramites` | ListaTramites | Coordinador |
| `/tramites/nuevo` | FormTramite | Coordinador |
| `/tramites/:id` | DetalleTramite | Coordinador, Estudiante |
| `/mis-tramites` | MisTramites | Estudiante |
| `/mis-tramites/:id` | DetalleTramite | Estudiante |

**Funcionalidades:**
- Crear trámite seleccionando estudiante, tipo de proceso y período
- Cambiar estado con modal de comentario (Coordinador)
- Finalizar trámite desde estado APROBADO
- Timeline visual del historial de estados
- Vista de solo lectura para el Estudiante
- Layout unificado con sidebar dinámico por rol

---

## Módulo de Documentos (Sprint 5)

Integrado dentro del detalle del trámite, en cada hito que tiene un documento obligatorio configurado.

**Coordinador:** sube, aprueba y observa documentos.
**Estudiante:** sube documentos a sus propios trámites y consulta observaciones (solo lectura para aprobar/observar).

**Funcionalidades:**
- Subida de archivo `.pdf` con validación de extensión y tamaño máximo
- Transición automática a "EN_REVISION" tras la subida
- Aprobar/Observar documento (Coordinador) con comentario obligatorio al observar
- Versionado automático: subir un nuevo archivo reemplaza la versión anterior (salvo que esté APROBADO)
- Descarga autenticada del documento vigente
- Historial de observaciones por documento
- Los hitos con documento obligatorio ocultan sus acciones manuales (Aprobar/Observar del hito): su estado se sincroniza automáticamente con el del documento

### Identidad visual

La interfaz replica la identidad institucional UISEK:
- Navbar fijo con color primario `#054690`
- Sidebar dinámico por rol, con sombra sutil y bordes redondeados
- Encabezados de tabla en `#6366F1`
- Fuente Roboto (Google Fonts)
- Iconografía Font Awesome 6

---

## Configuración TypeScript

El proyecto usa una configuración estricta:

| Opción | Valor | Implicación |
|---|---|---|
| `strict` | `true` | Tipado estricto completo |
| `verbatimModuleSyntax` | `true` | Importaciones de tipo deben usar `import type` |
| `noUnusedLocals` | `true` | No se permiten variables sin uso |
| `noUnusedParameters` | `true` | No se permiten parámetros sin uso |

---

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo en puerto 5173 |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualización del build |
| `npm run lint` | Análisis estático con ESLint |

---

## Estado del proyecto

| Sprint | Módulo | Estado |
|---|---|---|
| Sprint 1 | Autenticación, rutas protegidas, Tailwind | Completado |
| Sprint 2 | Gestión de Estudiantes (CRUD, importación, identidad UISEK) | Completado |
| Sprint 3 | Gestión de Trámites (estados, historial, Layout dinámico) | Completado |
| Sprint 4 | Gestión de Hitos (estados, avance automático, timeline) | Completado |
| Sprint 5 | Gestión de Documentos (subida, aprobación, versionado) | Completado |
| Sprint 6 | Generación de Documentos Word | Pendiente |
