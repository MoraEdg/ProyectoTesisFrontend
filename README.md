# Frontend — Sistema de Gestión de Prácticas Preprofesionales UISEK

**Autor:** Edgar Mora  
**Proyecto de Tesis — Universidad SEK**  
**Versión:** 1.0.0 — Baseline final validada

| Recurso              | Enlace                                                |
| -------------------- | ----------------------------------------------------- |
| Repositorio Frontend | https://github.com/MoraEdg/ProyectoTesisFrontend.git |
| Repositorio Backend  | https://github.com/MoraEdg/ProyectoTesisBackend.git  |

---

## Stack tecnológico

| Tecnología       | Versión | Uso                                         |
| ---------------- | ------- | ------------------------------------------- |
| React            | 19.x    | Librería UI                                 |
| Vite             | 7.x     | Bundler y servidor de desarrollo            |
| TypeScript       | 5.8     | Tipado estático (modo strict)               |
| Tailwind CSS     | 3.x     | Estilos utilitarios                         |
| react-router-dom | 6.x     | Enrutamiento SPA                            |
| axios            | 1.7.x   | Cliente HTTP con interceptores JWT          |
| react-hook-form  | 7.x     | Gestión de formularios                      |
| recharts         | 3.x     | Gráficos (PieChart, BarChart) — Sprint 8    |
| xlsx (SheetJS)   | 0.18.x  | Exportación Excel cliente — Sprint 8        |

---

## Estructura del proyecto

```
src/
├── api/
│   ├── axiosConfig.ts          — Instancia Axios con interceptores JWT y manejo de 401
│   ├── estudiantesApi.ts       — Módulo de estudiantes
│   ├── tramitesApi.ts          — Módulo de trámites y catálogos (periodos, tipos de proceso)
│   ├── hitosApi.ts             — Módulo de hitos
│   ├── documentosApi.ts        — Módulo de documentos (subir, aprobar, observar, descargar)
│   ├── generacionApi.ts        — Módulo de generación Word (Sprint 6)
│   ├── conveniosApi.ts         — Módulo de convenios (Sprint 7)
│   ├── reportesApi.ts          — Módulo de reportes — getDashboard, getPlanificacion (Sprint 8)
│   └── permisosApi.ts          — Módulo de permisos RBAC — getMios, getMatriz, putMatriz (Sprint 8)
│
├── components/
│   ├── PrivateRoute.tsx            — Protección de rutas por autenticación y rol
│   ├── PermisoRoute.tsx            — Protección de rutas por permiso RBAC específico
│   ├── Layout.tsx                  — Navbar + sidebar dinámico por rol
│   ├── ModalConfirmacion.tsx       — Modal de confirmación genérico
│   ├── ModalCambioEstado.tsx       — Modal de cambio de estado con comentario
│   ├── ModalDetalleConvenio.tsx    — Modal de detalle de convenio (Sprint 7)
│   ├── ModalGenerarDocumento.tsx   — Selector de tipo + formulario de generación Word (Sprint 6)
│   ├── ModalObservarDocumento.tsx  — Modal de observación con comentario obligatorio
│   ├── TimelineHitos.tsx           — Lista visual de hitos con acciones
│   ├── DocumentosHito.tsx          — Gestión de documentos dentro de un hito
│   ├── DocumentosGenerados.tsx     — Historial de documentos generados (Sprint 6)
│   ├── badgeEstado.ts              — Colores centralizados (tramite + hito + documento + convenio)
│   └── reportes/
│       ├── TarjetaMetrica.tsx      — Tarjeta de métrica con ícono y valor (Sprint 8)
│       ├── GraficoReporte.tsx      — PieChart y BarChart con recharts (Sprint 8)
│       ├── FiltrosPlanificacion.tsx — 6 filtros para la planificación semestral (Sprint 8)
│       └── PlanificacionSemestral.tsx — Tabla + paginación + exportación Excel (Sprint 8)
│
├── context/
│   └── AuthContext.tsx          — Contexto de autenticación global (AuthProvider, useAuth)
│
├── pages/
│   ├── Login.tsx                — Login con identidad visual institucional UISEK
│   ├── Dashboard.tsx            — Panel dinámico por rol con tarjetas de acceso
│   ├── MisTramites.tsx          — Lista de trámites del Estudiante (solo lectura)
│   ├── estudiantes/
│   │   ├── ListaEstudiantes.tsx     — Tabla con acciones (ver, editar, desactivar)
│   │   ├── DetalleEstudiante.tsx    — Vista de solo lectura
│   │   ├── FormEstudiante.tsx       — Formulario crear/editar (modo dual)
│   │   └── ImportarEstudiantes.tsx  — Importación masiva desde Excel
│   ├── tramites/
│   │   ├── ListaTramites.tsx        — Tabla de trámites (Coordinador)
│   │   ├── FormTramite.tsx          — Crear trámite con campos condicionales por proceso
│   │   └── DetalleTramite.tsx       — Detalle + hitos + documentos + timeline + generación
│   ├── convenios/
│   │   └── ListaConvenios.tsx       — Tabla con filtros locales y modal de detalle (Sprint 7)
│   ├── reportes/
│   │   └── Reportes.tsx             — Dashboard ejecutivo + Planificación semestral (Sprint 8)
│   └── configuracion/
│       └── Configuracion.tsx        — Administración de matriz RBAC (Sprint 8)
│
├── types/
│   ├── estudiante.ts           — Interfaces del módulo de estudiantes
│   ├── tramite.ts              — Interfaces de trámites (incl. modalidad, tiene_convenio, institucion_empresa)
│   ├── hito.ts                 — Interfaces del módulo de hitos
│   ├── documento.ts            — Interfaces del módulo de documentos
│   ├── documentoGenerado.ts    — Interfaces de generación (TipoDocumentoGenerado, ETIQUETAS_TIPO)
│   ├── convenio.ts             — Interfaces del módulo de convenios (Sprint 7)
│   └── reporte.ts              — Interfaces del módulo de reportes (Sprint 8)
│
└── utils/
    (vacío)
```

---

## Requisitos previos

- Node.js 20+
- El [backend](https://github.com/MoraEdg/ProyectoTesisBackend) corriendo en `http://localhost:5000`

---

## Configuración inicial

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/MoraEdg/ProyectoTesisFrontend.git
cd ProyectoTesisFrontend
npm install
```

### 2. Variables de entorno

Copiar `.env.example` a `.env` y ajustar la URL si el backend corre en otro puerto u host:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Levantar en desarrollo

```bash
npm run dev
```

Aplicación disponible en `http://localhost:5173`.

### 4. Build de producción

```bash
npm run build
npm run preview
```

---

## Autenticación

JWT Bearer token almacenado en `localStorage`.

- El token se añade automáticamente a cada request via interceptor de Axios.
- Si el servidor responde `401`, el token se elimina y se redirige a `/login`.

**Credenciales de prueba:**

| Campo           | Valor         |
| --------------- | ------------- |
| Usuario         | `admin`       |
| Contraseña      | `Admin1234`   |
| Rol             | `Coordinador` |
| Ruta post-login | `/dashboard`  |

---

## Rutas de la aplicación

| Ruta                    | Página                | Roles                      |
| ----------------------- | --------------------- | -------------------------- |
| `/login`                | Login                 | Pública                    |
| `/dashboard`            | Dashboard             | Todos                      |
| `/estudiantes`          | ListaEstudiantes      | Coordinador                |
| `/estudiantes/nuevo`    | FormEstudiante        | Coordinador                |
| `/estudiantes/:id`      | DetalleEstudiante     | Coordinador                |
| `/estudiantes/:id/editar` | FormEstudiante      | Coordinador                |
| `/estudiantes/importar` | ImportarEstudiantes   | Coordinador                |
| `/tramites`             | ListaTramites         | Coordinador                |
| `/tramites/nuevo`       | FormTramite           | Coordinador                |
| `/tramites/:id`         | DetalleTramite        | Coordinador, Estudiante    |
| `/mis-tramites`         | MisTramites           | Estudiante                 |
| `/mis-tramites/:id`     | DetalleTramite        | Estudiante                 |
| `/convenios`            | ListaConvenios        | Todos (autenticados)       |
| `/reportes`             | Reportes              | Coordinador                |
| `/configuracion`        | Configuracion         | Coordinador (settings.administrar) |

---

## Módulos implementados

### Módulo de Estudiantes (Sprint 2) — solo Coordinador

- Tabla con búsqueda, paginación y acciones Ver / Editar / Desactivar
- Registro manual con validación de cédula ecuatoriana (10 dígitos)
- Importación masiva desde Excel con reporte de creados / duplicados / errores
- Desactivación lógica (el estudiante deja de aparecer en la lista de selección de trámites)

### Módulo de Trámites (Sprint 3, 6.5) — Coordinador y Estudiante

**Campos condicionales en `FormTramite` según el tipo de proceso:**

| Campo               | PP                | RL              | Convalidación |
| ------------------- | ----------------- | --------------- | ------------- |
| Modalidad           | Obligatorio       | Oculto          | Oculto        |
| ¿Tiene convenio?    | Obligatorio       | Oculto          | Oculto        |
| Institución/Empresa | **Obligatorio**   | Opcional        | Oculto        |

**Códigos de trámite generados automáticamente:**
- Prácticas Preprofesionales → `PRAC-2026-001`
- Reconocimiento Laboral → `RLAB-2026-001`
- Convalidación → `CONV-2026-001`

### Módulo de Hitos (Sprint 4) — Coordinador y Estudiante

- Timeline visual con estado y acciones disponibles según el estado actual
- Aprobación automática del hito al aprobar su documento obligatorio
- El Coordinador no puede aprobar manualmente un hito con documento obligatorio

### Módulo de Documentos (Sprint 5) — Coordinador y Estudiante

- Subida de PDF con validación de extensión y tamaño
- Versionado automático (la versión anterior se marca REEMPLAZADO)
- El documento APROBADO no puede reemplazarse sin observarlo primero
- Historial de observaciones por documento

### Módulo de Generación Word (Sprint 6) — solo Coordinador

Botón "Generar documento" visible únicamente en trámites de Prácticas Preprofesionales.

| Tipo | Documento |
|---|---|
| 1 | FPP2 — Carta de Formalización (con convenio) |
| 2 | FPP2 — Carta de Formalización (sin convenio) |
| 3 | Carta de Petición                            |
| 4 | FPP3 — Formato de Seguimiento (plantilla vacía) |

### Módulo de Convenios (Sprint 7) — todos los roles

- Tabla con 3 filtros locales: búsqueda por empresa/código, estado (EN_PROCESO, VIGENTE, SUSPENDIDO, FINALIZADO, CADUCADO) y año
- Paginación local (10 registros/página)
- Modal de detalle con 4 secciones: información general, contacto, fechas, datos institucionales
- Soporte de múltiples correos (separador `;`) y duración con dos párrafos (separador `//`)

### Módulo de Permisos RBAC (Sprint 8) — solo Coordinador con `settings.administrar`

- Página `/configuracion` con tabla de roles × funcionalidades
- Permite habilitar o deshabilitar permisos por rol mediante checkboxes
- Los cambios tienen efecto inmediato en el backend (TTL=0)
- Usa `permisosApi.ts` y `PermisoRoute.tsx`

### Módulo de Reportes (Sprint 8) — solo Coordinador

**Tab 1 — Dashboard ejecutivo:**

| Métrica | Descripción |
|---|---|
| Total Estudiantes | Conteo global de estudiantes registrados |
| Con Actividad | Estudiantes con ≥ 1 trámite en estado ≠ INICIADO |
| Sin Actividad | Total − Con actividad |
| Total Trámites | Total de trámites en el sistema |
| Trámites Finalizados | Trámites en estado FINALIZADO |

4 gráficos (recharts): distribución por tipo de proceso (pie), origen de colocación (pie), modalidad (pie), estado de trámites (bar).

**Tab 2 — Planificación semestral:**

6 filtros opcionales (período, tipo de proceso, estado, carrera, modalidad, convenio) que se envían al backend. La paginación y la exportación son locales.

- Botón **"Exportar Excel"** genera un `.xlsx` con todos los registros del filtro actual (sin límite de página), con ajuste automático de ancho de columnas.

---

## Identidad visual

- Color primario: `#054690` (UISEK azul)
- Sidebar fijo izquierdo, navbar fijo superior
- Tailwind CSS con colores personalizados `uisek` y `uisek-dark`
- Font Awesome 6 para iconografía
- Responsive: sidebar colapsado en pantallas < lg

---

## Scripts disponibles

| Script            | Descripción                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Servidor de desarrollo (puerto 5173) |
| `npm run build`   | Build de producción                |
| `npm run preview` | Previsualización del build         |
| `npm run lint`    | Análisis estático con ESLint       |

---

## Estado del proyecto

| Sprint     | Módulo                                                           | Estado        |
| ---------- | ---------------------------------------------------------------- | ------------- |
| Sprint 1   | Autenticación, rutas protegidas, Tailwind, identidad UISEK       | ✅ Completado |
| Sprint 2   | Gestión de Estudiantes (CRUD, importación, paginación)           | ✅ Completado |
| Sprint 3   | Gestión de Trámites (estados, historial, layout dinámico)        | ✅ Completado |
| Sprint 4   | Gestión de Hitos (timeline, avance automático)                   | ✅ Completado |
| Sprint 5   | Gestión de Documentos (subida, versionado, aprobación)           | ✅ Completado |
| Sprint 6   | Generación de Documentos Word                                    | ✅ Completado |
| Sprint 6.5 | Ajustes: campos condicionales, hitos SIN/CON_CONVENIO, modal fix | ✅ Completado |
| Sprint 7   | Convenios (consulta, filtros locales, modal detalle)             | ✅ Completado |
| Sprint 8   | Reportes (dashboard, gráficos recharts, planificación, Excel)    | ✅ Completado |
| Sprint 8   | Configuración RBAC (matriz de permisos editable, `/configuracion`) | ✅ Completado |

**El desarrollo planificado de esta versión está finalizado (v1.0.0).** Funcionalidades
adicionales (notificaciones, interfaz para Director/Decano, sincronización en tiempo
real, etc.) se consideran mejoras o escalamiento futuro, con su propia planificación
y trazabilidad — no son alcance pendiente de esta versión.
