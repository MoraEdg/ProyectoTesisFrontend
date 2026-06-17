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
│   └── estudiantesApi.ts       — Funciones API del módulo de estudiantes
├── components/
│   ├── PrivateRoute.tsx        — Protección de rutas por autenticación y rol
│   ├── Layout.tsx              — Layout institucional (navbar + sidebar + área de contenido)
│   └── ModalConfirmacion.tsx   — Modal reutilizable de confirmación
├── context/
│   └── AuthContext.tsx         — Contexto de autenticación global (AuthProvider, useAuth)
├── pages/
│   ├── Login.tsx               — Login con identidad visual institucional UISEK
│   ├── Dashboard.tsx           — Panel de coordinación con accesos a módulos
│   ├── MisTramites.tsx         — Vista de trámites del Estudiante (Sprint 4)
│   └── estudiantes/
│       ├── ListaEstudiantes.tsx      — Tabla de estudiantes con acciones
│       ├── DetalleEstudiante.tsx     — Vista de solo lectura
│       ├── FormEstudiante.tsx        — Formulario crear/editar (modo dual)
│       └── ImportarEstudiantes.tsx   — Importación desde Excel con reporte
├── types/
│   └── estudiante.ts           — Interfaces TypeScript del módulo
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

### Identidad visual

La interfaz replica la identidad institucional UISEK:
- Navbar fijo con color primario `#085394`
- Sidebar con sombra sutil y bordes redondeados
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
| Sprint 3 | Gestión de Trámites | Pendiente |
| Sprint 4 | Hitos, Documentos y Observaciones | Pendiente |
| Sprint 5 | Gestión de Convenios | Pendiente |
| Sprint 6 | Generación de Documentos | Pendiente |
