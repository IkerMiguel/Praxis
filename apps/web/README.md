# Frontend PRAXIS ECCI

Guía técnica del frontend de **PRAXIS**, la mesa de ayuda para reportar y hacer seguimiento a fallas de infraestructura en la Universidad ECCI, Campus Cali.

Esta guía está pensada para la persona que continúa el desarrollo: explica cómo levantar el proyecto, cómo está organizado, cómo se conecta con la API y cuáles son los flujos y reglas que ya están implementados.

---

## Contenido

1. [Para empezar en 5 minutos](#para-empezar-en-5-minutos)
2. [Qué cubre este frontend](#qué-cubre-este-frontend)
3. [Mapa de pantallas](#mapa-de-pantallas)
4. [Estructura de carpetas](#estructura-de-carpetas)
5. [Arquitectura](#arquitectura)
6. [Capa de datos](#capa-de-datos)
7. [Endpoints que consume el frontend](#endpoints-que-consume-el-frontend)
8. [Componentes principales](#componentes-principales)
9. [Flujos de usuario](#flujos-de-usuario)
10. [Estados de interfaz](#estados-de-interfaz)
11. [Reglas y validaciones de la UI](#reglas-y-validaciones-de-la-ui)
12. [Estilos y sistema de diseño](#estilos-y-sistema-de-diseño)
13. [Accesibilidad](#accesibilidad)
14. [Variables de entorno](#variables-de-entorno)
15. [Convenciones de código y trabajo](#convenciones-de-código-y-trabajo)
16. [Recetas para extender el frontend](#recetas-para-extender-el-frontend)
17. [Pruebas manuales](#pruebas-manuales)
18. [Glosario](#glosario)
19. [Enlaces y contacto](#enlaces-y-contacto)

---

## Para empezar en 5 minutos

### Requisitos

- **Node.js 22+**
- **pnpm 11.24.0** (el proyecto lo fija en `package.json`)
- **Docker** (para la base de datos, si vas a trabajar también con la API)
- La API de PRAXIS corriendo en `http://localhost:3001`

### Pasos

Desde la raíz del monorepo:

```bash
# 1. Instalar dependencias de todo el workspace
pnpm install

# 2. Configurar la URL de la API (opcional en local)
#    Copia apps/web/.env.example a apps/web/.env.local
#    NEXT_PUBLIC_API_URL=http://localhost:3001

# 3. Levantar la API (en otra terminal, desde la raíz)
pnpm dev:api

# 4. Levantar el frontend
pnpm dev:web
```

Abre **http://localhost:3000**. La ruta `/` redirige automáticamente a `/panel`.

### Comandos del frontend

| Comando | Qué hace |
|---|---|
| `pnpm dev:web` | Inicia Next.js en desarrollo con recarga en caliente |
| `pnpm build:web` | Compila el frontend para producción |
| `pnpm lint:web` | Ejecuta ESLint con la configuración de Next.js |
| `pnpm --filter web start` | Sirve el build de producción |

> El pipeline de CI ejecuta `lint` y `build` sobre `apps/web`.

### Verificación rápida

Si todo está en orden deberías poder navegar por:

- `/panel` → panel principal con saludo, contadores y reportes recientes.
- `/reportes/nuevo` → formulario de nuevo reporte.
- `/mis-solicitudes` → listado con búsqueda, filtros y paginación.
- `/mis-solicitudes/TKT-2026-0472` → detalle del ticket de ejemplo.
- `/ayuda` → guía de uso y preguntas frecuentes.

---

## Qué cubre este frontend

El frontend implementa la experiencia completa del solicitante: consultar el panel, radicar un reporte, hacer seguimiento y responder cuando la coordinación técnica pide información adicional.

| Módulo | Qué incluye |
|---|---|
| **Layout general** | Header con perfil y notificaciones, sidebar con navegación activa y badge, contenedor global del modal |
| **Panel de inicio** | Saludo, sede y periodo, contadores de solicitudes, barra de atención, reportes recientes y acceso a la guía |
| **Nuevo reporte** | Formulario en 3 pasos, catálogos desde la API, subcategoría reactiva, validaciones, evidencias con vista previa y pantalla de confirmación |
| **Mis solicitudes** | Listado con búsqueda, filtros por estado/categoría/fecha, paginación, estados de carga/vacío/error y acciones por fila |
| **Detalle de solicitud** | Datos generales, evidencias, trazabilidad técnica, aviso de acción requerida y copia del código |
| **Completar información** | Modal global, requerimiento del técnico, respuesta, fotos adicionales y refresco automático del listado y del detalle |
| **Notificaciones** | Campana con badge, popover, listado real desde la API, cierre por clic fuera/Escape y "marcar todas como leídas" |
| **Centro de ayuda** | Guía rápida en 3 pasos, descarga del PDF y preguntas frecuentes en acordeón con estados de carga, vacío y error |

### Trazabilidad de la implementación

| Referencia | Trabajo realizado |
|---|---|
| KAN-7 / KAN-8 / KAN-9 | Layout, header, sidebar, menú principal/soporte y perfil del usuario |
| PRAX-19 / PRAX-20 / PRAX-21 | Rutas base, estado activo de navegación y placeholders |
| PRAX-28 / PRAX-29 | Saludo, tarjetas del panel y listado de reportes recientes |
| PRAX-30 / KAN-34 | Historial, guía para usuarios nuevos y centro de ayuda |
| KAN-42 / KAN-43 | Campana con conteo, popover y cierre por interacción |
| KAN-91 | Listado de Mis Solicitudes con explorador, filtros y estados de carga |
| KAN-92 | Detalle con trazabilidad, evidencias y aviso de acción requerida |
| KAN-93 | Modal de Completar Información con provider global |
| KAN-94 | Panel migrado a `/reportes/solicitudes` y CTA conectado al modal |
| KAN-81 / 82 / 83 / 84 | Nuevo reporte con catálogo del backend, subcategoría reactiva, evidencia validada y confirmación |
| Correcciones finales | Badge dinámico del sidebar, filtro de fecha, guard 409, re-fetch tras completar, overflow de tabla, títulos largos y vista previa de evidencias |

---

## Mapa de pantallas

| Ruta | Archivo | Tipo | Propósito |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Server | Redirige a `/panel` |
| `/panel` | `src/app/panel/page.tsx` | Server | Panel principal del solicitante |
| `/reportes/nuevo` | `src/app/reportes/nuevo/page.tsx` | Server + Client | Formulario de radicación y confirmación |
| `/mis-solicitudes` | `src/app/mis-solicitudes/page.tsx` | Server + Client | Listado y seguimiento de solicitudes |
| `/mis-solicitudes/[id]` | `src/app/mis-solicitudes/[id]/page.tsx` | Server | Detalle de un ticket |
| `/ayuda` | `src/app/ayuda/page.tsx` | Server + Client | Guía, PDF y preguntas frecuentes |

Todas las pantallas comparten el layout de `src/app/layout.tsx`: header fijo, sidebar y el proveedor global del modal.

---

## Estructura de carpetas

```text
apps/web/
├── public/
│   ├── logo-praxis.png
│   ├── avatar-mendoza.png
│   ├── tkt-panel-luces.png
│   ├── tkt-techo-luminarias.png
│   └── guias/praxis-guia-usuario.pdf
├── src/
│   ├── app/
│   │   ├── layout.tsx                 Layout global (header, sidebar, provider)
│   │   ├── globals.css                Tailwind 4 + tokens de diseño
│   │   ├── page.tsx                   Redirección a /panel
│   │   ├── panel/page.tsx             Panel principal
│   │   ├── reportes/nuevo/page.tsx    Nuevo reporte
│   │   ├── mis-solicitudes/
│   │   │   ├── page.tsx               Listado
│   │   │   └── [id]/page.tsx          Detalle
│   │   ├── ayuda/
│   │   │   ├── page.tsx               Centro de ayuda
│   │   │   ├── faq.tsx                Acordeón de preguntas (Client)
│   │   │   └── faqs.ts                Preguntas locales de respaldo
│   │   └── lib/
│   │       └── mock-recent-reports.ts Modelo de presentación de reportes recientes
│   ├── components/
│   │   ├── header.tsx                 Header (Server)
│   │   ├── sidebar.tsx                Navegación lateral (Client)
│   │   ├── notifications-bell.tsx     Campana y popover (Client)
│   │   ├── icons.tsx                  Set de iconos SVG
│   │   ├── recent-reports-list.tsx    Lista de reportes recientes (Client)
│   │   ├── placeholder-page.tsx       Componente de página genérica
│   │   ├── mis-solicitudes/
│   │   │   ├── explorador.tsx         Listado, filtros y paginación (Client)
│   │   │   ├── estado-badge.tsx       Badges de estado y avisos
│   │   │   ├── acciones-detalle.tsx   Copiar código y responder (Client)
│   │   │   └── completar-info-modal.tsx Provider + modal (Client)
│   │   └── nuevo-reporte/
│   │       ├── form.tsx               Formulario completo (Client)
│   │       ├── descripcion.tsx        Textarea con contador
│   │       ├── evidencia.tsx          Carga de imágenes y vista previa
│   │       └── confirmacion.tsx       Pantalla de éxito
│   └── lib/
│       ├── api.ts                     URL, tipos, fallbacks y funciones HTTP
│       ├── adapters.ts                Conversión API → modelo de presentación
│       └── notificaciones.ts          Tipos y respaldo de notificaciones
├── .env.example
├── eslint.config.mjs
├── next.config.ts
├── package.json
└── tsconfig.json
```

El alias `@/*` apunta a `src/*`, por eso los imports se ven como `@/components/header` o `@/lib/api`.

---

## Arquitectura

### App Router y componentes

El proyecto usa **Next.js 16** con **App Router**. La regla es simple:

- **Server Components por defecto**: las páginas y el header consultan la API en el servidor.
- **Client Components solo cuando hay interactividad**: estado, eventos, `useEffect`, `useRouter`, portapapeles, arrastrar y soltar, etc. Se marcan con `"use client"`.

```text
Navegador
└── src/app/layout.tsx (Server)
    ├── Header (Server)          → perfil, notificaciones y listado
    ├── Sidebar (Client)         ← contador de pendientes
    ├── CompletarInfoProvider    → modal disponible en toda la app
    └── página
        ├── Server               → panel, detalle, ayuda
        └── Client               → explorador, formulario, campana, FAQ
```

### Layout global

`src/app/layout.tsx` hace tres cosas:

1. Carga las fuentes **Inter** (texto) y **Plus Jakarta Sans** (títulos).
2. Consulta `GET /reportes/contador` y pasa `pendienteInformacion` al sidebar.
3. Envuelve toda la aplicación en `CompletarInfoProvider`, para que cualquier pantalla pueda abrir el modal de "Completar Información" sin duplicar estado.

### Dos contadores distintos (a propósito)

Es fácil confundirlos, pero miden cosas diferentes:

| Elemento | Fuente | Qué representa |
|---|---|---|
| Badge del sidebar | `GET /reportes/contador` → `pendienteInformacion` | Tickets que esperan información del solicitante y requieren acción |
| Badge de la campana | `GET /notificaciones/resumen` → `notificacionesPendientes` | Notificaciones sin leer del usuario |

No deben unificarse: un ticket puede estar pendiente de información y aun así no tener una notificación nueva, y viceversa.

### Estrategia de datos

El frontend usa `fetch` nativo con las utilidades de `src/lib/api.ts`. Cada pantalla decide si necesita datos frescos o puede reutilizar caché:

| Pantalla | Revalidación |
|---|---|
| Panel, Mis Solicitudes, Detalle, Formulario, Campana, Contador | `0` (sin caché, datos frescos) |
| Perfil del header | `30` segundos |

Si la API no responde, la UI usa **datos de ejemplo locales** para mantenerse navegable. Esto aplica a perfil, resumen del panel, reportes recientes, catálogos y el detalle del ticket `TKT-2026-0472`. El listado de Mis Solicitudes es la excepción: distingue explícitamente entre vacío y error para poder mostrar un botón de reintento.

### Refresco después de completar información

El modal global mantiene un contador de versión:

1. Al enviar la respuesta, el provider incrementa `version`.
2. El explorador escucha `version` y vuelve a consultar el listado.
3. El modal llama `router.refresh()` para refrescar también el detalle en el servidor.

Así la interfaz se actualiza sin recargar la página ni perder el contexto del usuario.

---

## Capa de datos

Todo vive en `src/lib/api.ts`.

### URL base

```ts
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
```

### Funciones HTTP

| Función | Comportamiento |
|---|---|
| `apiGet<T>(path, fallback, revalidate = 30)` | `GET`. Si la respuesta no es `ok` o falla la red, devuelve `fallback`. |
| `apiGetEstado<T>(path, revalidate = 0)` | `GET` con resultado discriminado: `{ estado: "ok", datos }`, `{ estado: "vacio" }` o `{ estado: "error" }`. Un arreglo vacío se considera `vacio`. |
| `apiPost<T>(path, body)` | `POST` con JSON. Devuelve `{ ok: true, datos }` o `{ ok: false }`. |

### Datos de respaldo

Se usan cuando la API no está disponible o para tener una primera pintura estable:

| Constante | Uso |
|---|---|
| `FALLBACK_PERFIL` | Perfil del header |
| `FALLBACK_RESUMEN` | Tarjetas y contadores del panel |
| `FALLBACK_CONTADOR` | Badge del sidebar |
| `FALLBACK_SOLICITUDES` | Estado inicial del explorador |
| `FALLBACK_DETALLE` | Detalle del ticket `TKT-2026-0472` sin API |
| `FALLBACK_CATEGORIAS` | Catálogo del formulario |
| `FALLBACK_SUBCATEGORIAS` | Subcategorías por categoría |
| `FALLBACK_NOTIFICACIONES` | Listado vacío de notificaciones |

### Tipos del contrato

Los tipos que describen la API están en `src/lib/api.ts`:

`PerfilUsuario`, `ResumenPanel`, `ReporteReciente`, `DetalleReporte`, `TrazabilidadItem`, `CategoriaSitio`, `Subcategoria`, `CrearReportePayload`, `ConfirmacionReporte`, `CompletarInformacionRespuesta`, `ResumenNotificaciones` y `ContadorReportes`.

Si cambia un contrato del backend, actualiza el tipo aquí y revisa los componentes que lo consumen.

### Adaptador de presentación

`src/lib/adapters.ts` convierte `ReporteReciente` (contrato de la API) en `RecentReport` (modelo que espera `RecentReportsList`). Ahí se traducen:

- `estado` → `status` (`EN_PROCESO` → `en_proceso`, etc.).
- `accionPrincipal` → `action` (`COMPLETAR_INFORMACION` → `completar_info`).
- `meta` → icono y tono visual.
- El código del ticket recibe el prefijo `#`.

Este patrón evita que los componentes de presentación dependan directamente del contrato del backend.

---

## Endpoints que consume el frontend

| Método | Ruta | Se usa en | Para qué |
|---|---|---|---|
| `GET` | `/user/me` | Header | Nombre, rol, sede, campus y avatar |
| `GET` | `/dashboard/resumen` | Panel | Saludo, solicitudes activas, en proceso, pendientes y porcentaje de atención |
| `GET` | `/reportes/contador` | Layout / Sidebar | Cantidad de tickets pendientes de información |
| `GET` | `/reportes/solicitudes` | Panel y Mis Solicitudes | Listado de solicitudes |
| `GET` | `/reportes/solicitudes/:id` | Detalle y modal | Detalle completo del ticket |
| `POST` | `/reportes/crear` | Nuevo reporte | Radicar una solicitud y recibir el acuse |
| `POST` | `/reportes/solicitudes/:id/completar` | Modal | Enviar aclaración y fotos adicionales |
| `GET` | `/catalogos/categorias` | Formulario | Categorías principales |
| `GET` | `/catalogos/subcategorias?categoriaId=...` | Formulario | Subcategorías según la categoría elegida |
| `GET` | `/notificaciones/resumen` | Header | Conteo de notificaciones sin leer |
| `GET` | `/notificaciones/listado` | Header / Campana | Notificaciones del usuario |
| `POST` | `/notificaciones/marcar-leidas` | Campana | Marcar todas como leídas |
| `GET` | `/ayuda/faqs` | Centro de ayuda | Preguntas frecuentes; si no está disponible se usan las locales |

### Respuestas que el frontend espera

**`GET /reportes/solicitudes`**

```json
[
  {
    "id": "TKT-2026-0472",
    "estado": "PENDIENTE_INFORMACION",
    "titulo": "Lámpara LED parpadeante en Lab 302",
    "actualizadoHace": "Ayer, 16:30",
    "actualizadoEn": "2026-03-03T21:30:00.000Z",
    "ubicacion": "Sede Cali • Bloque B • Lab Sistemas 302",
    "categoria": "Electricidad",
    "meta": "Cuadrilla Eléctrica",
    "accionPrincipal": "COMPLETAR_INFORMACION",
    "mensajeAlerta": "Reclamo técnico: requiere aclaración de balastro"
  }
]
```

**`POST /reportes/crear`**

```json
{
  "sede": "Universidad ECCI - Campus Cali",
  "bloque": "Bloque B",
  "piso": "Piso 3",
  "espacioEspecifico": "Lab. Sistemas 302 - Ala Norte",
  "categoriaSitioId": "CAT-ELEC",
  "clasificacion": "SUB-ELEC-LUM",
  "descripcion": "Dos luminarias parpadean de forma intermitente.",
  "referenciasEvidencia": ["panel_fallas.jpg", "techo_lab.jpg"]
}
```

Respuesta:

```json
{
  "id": "TKT-2026-0492",
  "fechaRegistro": "2026-03-13T15:20:00.000Z",
  "estadoInicial": "Abierto • En Validación",
  "categoria": "Electricidad",
  "ubicacion": {
    "campus": "Universidad ECCI - Campus Cali",
    "bloque": "Bloque B",
    "piso": "Piso 3",
    "espacio": "Lab. Sistemas 302 - Ala Norte"
  }
}
```

**`POST /reportes/solicitudes/:id/completar`**

```json
{
  "respuestaTexto": "La luminaria no genera olor a quemado.",
  "fotosAdicionales": ["balastro.jpg"]
}
```

Respuesta:

```json
{
  "exito": true,
  "mensaje": "Información enviada exitosamente. El área técnica ha sido notificada.",
  "nuevoEstado": "EN_PROCESO"
}
```

---

## Componentes principales

| Componente | Archivo | Tipo | Responsabilidad |
|---|---|---|---|
| `Header` | `components/header.tsx` | Server | Logo, campus, perfil, campana y listado de notificaciones |
| `Sidebar` | `components/sidebar.tsx` | Client | Navegación, estado activo y badge de pendientes |
| `NotificationsBell` | `components/notifications-bell.tsx` | Client | Botón, badge, popover, cierre por fuera/Escape y marcar leídas |
| `RecentReportsList` | `components/recent-reports-list.tsx` | Client | Lista de reportes recientes con acción según estado |
| `ExploradorSolicitudes` | `components/mis-solicitudes/explorador.tsx` | Client | Búsqueda, filtros, paginación, estados y acciones |
| `EstadoBadge` | `components/mis-solicitudes/estado-badge.tsx` | Server/Client | Etiqueta visual del estado del ticket |
| `BotonCopiarCodigo` | `components/mis-solicitudes/acciones-detalle.tsx` | Client | Copia el código radicado al portapapeles |
| `BotonResponderYSubsanar` | `components/mis-solicitudes/acciones-detalle.tsx` | Client | Abre el modal global para el ticket |
| `CompletarInfoProvider` | `components/mis-solicitudes/completar-info-modal.tsx` | Client | Estado global y render del modal |
| `NuevoReporteForm` | `components/nuevo-reporte/form.tsx` | Client | Formulario, catálogos, validaciones, envío y confirmación |
| `DescripcionDano` | `components/nuevo-reporte/descripcion.tsx` | Client | Textarea con contador de 500 caracteres |
| `EvidenciaFotografica` | `components/nuevo-reporte/evidencia.tsx` | Client | Selección, arrastre, validación y vista previa de imágenes |
| `ConfirmacionRegistro` | `components/nuevo-reporte/confirmacion.tsx` | Client | Acuse, copia del código y acciones posteriores |
| `AyudaFaq` | `app/ayuda/faq.tsx` | Client | Acordeón de preguntas con carga, vacío, error y reintento |
| `Icon` | `components/icons.tsx` | Server/Client | Iconos SVG por nombre |

### Detalle del header y la campana

- El header consulta perfil, conteo y listado en paralelo.
- Si `avatarUrl` empieza por `http`, se usa esa URL; de lo contrario se usa `/avatar-mendoza.png`.
- La campana recibe ``key={`${conteo}-${items.length}`}`` para reiniciar su estado local cuando cambian los datos del servidor.
- Al marcar todas como leídas, la UI actualiza el estado local de inmediato y luego sincroniza el conteo con la respuesta de la API.
- El popover se cierra al hacer clic fuera o al presionar **Escape**.
- Cada notificación enlaza a `/mis-solicitudes/{ticketId}`.

### Detalle del formulario

- Los catálogos se cargan al montar el componente; si la API falla, se usan los fallbacks.
- Al cambiar la categoría se limpia la subcategoría y se consultan las subcategorías de la nueva categoría.
- Mientras llegan las subcategorías, se filtran por `categoriaId` para no mostrar las de la categoría anterior.
- El formulario valida en el cliente antes de enviar y vuelve a mostrar el error de la API si el envío falla.
- Al confirmar, se reemplaza el formulario por la pantalla de acuse; "Crear Nuevo Reporte" reinicia el estado.

---

## Flujos de usuario

### 1. Radicar un nuevo reporte

1. El usuario entra a `/reportes/nuevo` desde el panel, el sidebar o el listado.
2. **Paso 1 — Ubicación:** selecciona sede, bloque y piso, y describe el espacio específico.
3. **Paso 2 — Clasificación:** elige categoría principal y subcategoría; la segunda depende de la primera. Describe el daño (máximo 500 caracteres).
4. **Paso 3 — Evidencia:** arrastra o selecciona hasta 4 imágenes JPG/PNG de máximo 10 MB cada una. Puede eliminar cada una antes de enviar.
5. Al enviar, el frontend valida los campos y llama `POST /reportes/crear` con las referencias de las evidencias.
6. Si la API responde bien, se muestra la pantalla de confirmación con el código del ticket, fecha, estado inicial, ubicación y categoría.
7. Desde el acuse puede copiar el código, ver el detalle del ticket, crear otro reporte o ir a Mis Solicitudes.

### 2. Consultar Mis Solicitudes

1. Al entrar a `/mis-solicitudes`, el explorador consulta `GET /reportes/solicitudes`.
2. Mientras carga, muestra el estado de carga.
3. Si la API responde con datos, se habilitan búsqueda, filtros y paginación.
4. Si responde vacío, muestra el estado "Aún no tienes solicitudes" con acceso a crear la primera.
5. Si falla, muestra el estado de error con botón **Reintentar**.
6. Cada fila ofrece **Ver Detalle** o **Completar Información Requerida** según `accionPrincipal`.

**Búsqueda:** código, título, ubicación y mensaje de alerta.

**Filtros:**

- Estado: todos, pendiente de información, en proceso, resuelto.
- Categoría: todas, electricidad, hidráulica, cerrajería.
- Rango: todos, últimos 30 días, últimos 7 días, hoy. Se calcula sobre `actualizadoEn`.

**Paginación:** 4 solicitudes por página. Al cambiar un filtro o la búsqueda se vuelve a la página 1.

### 3. Ver el detalle de una solicitud

1. La página consulta `GET /reportes/solicitudes/:id`.
2. Si el ticket está en `PENDIENTE_INFORMACION`, aparece un aviso destacado con el requerimiento técnico y el botón **Responder y Subsanar**.
3. Se muestran datos generales, descripción inicial, evidencias y línea de tiempo de trazabilidad.
4. El botón **Copiar Código Radicado** copia el identificador y confirma visualmente durante 2 segundos.
5. Si el ticket no existe, se muestra la página 404 de Next.js.

Sin API disponible, el detalle solo se muestra para el ticket de ejemplo `TKT-2026-0472`; cualquier otro identificador lleva a 404.

### 4. Completar información requerida

1. El usuario abre el modal desde el listado, el panel o el detalle.
2. El modal consulta el detalle del ticket y muestra el requerimiento del técnico.
3. El usuario escribe una aclaración (mínimo 5 caracteres) y, si lo necesita, adjunta fotos adicionales JPG/PNG de hasta 10 MB.
4. Al enviar, se llama `POST /reportes/solicitudes/:id/completar`.
5. Si la API responde bien, el modal se cierra, el listado se vuelve a consultar y el detalle se refresca.
6. Si la API rechaza la operación (por ejemplo, porque el ticket ya no está pendiente), el modal muestra un mensaje de error y permite intentar de nuevo.

El modal se cierra con **Escape**, con el botón de cerrar o haciendo clic en el fondo, y bloquea el scroll del cuerpo mientras está abierto.

### 5. Notificaciones

1. El header carga el conteo y el listado de notificaciones.
2. La campana muestra un badge solo cuando el conteo es mayor que 0.
3. Al abrir el popover se listan las notificaciones con tipo, ticket, tiempo y mensaje.
4. Las no leídas se destacan con fondo.
5. **Marcar todas como leídas** actualiza la UI y llama a la API; el badge desaparece.
6. Si no hay notificaciones, se muestra un estado vacío con icono.

### 6. Centro de ayuda

1. `/ayuda` presenta la guía rápida en 3 pasos y el enlace de descarga del PDF.
2. Debajo, el acordeón de preguntas frecuentes carga desde `GET /ayuda/faqs`.
3. Si el endpoint responde 404 o falla la red, se muestran las preguntas locales de `app/ayuda/faqs.ts`.
4. Si responde con un error distinto de 404, se muestra el estado de error con **Reintentar**.
5. Si responde vacío, se muestra el estado "Aún no hay preguntas publicadas".
6. Todas las preguntas se abren por defecto y se pueden contraer individualmente.

### 7. Panel principal

1. Carga en paralelo `GET /dashboard/resumen` y `GET /reportes/solicitudes`.
2. Muestra el saludo, la sede y el estado del periodo.
3. Presenta la tarjeta de acceso a nuevo reporte y la de solicitudes activas.
4. La barra de atención usa `porcentajeAtencion`, acotado entre 0 y 100.
5. Lista los reportes recientes y permite abrir el detalle o el modal de completar información.

---

## Estados de interfaz

| Estado | Dónde se ve | Comportamiento |
|---|---|---|
| **Carga** | Mis Solicitudes, FAQ | Texto de carga y esqueletos animados; `aria-busy` en FAQ |
| **Vacío sin datos** | Mis Solicitudes, FAQ | Mensaje explicativo y acceso a crear el primer reporte |
| **Vacío por filtros** | Mis Solicitudes | Mensaje distinto y botón **Limpiar filtros** |
| **Error** | Mis Solicitudes, FAQ | Mensaje, contexto y botón **Reintentar** |
| **Enviando** | Formulario, modal | Botón deshabilitado con texto "Enviando…" |
| **Éxito** | Nuevo reporte | Pantalla de confirmación con código y acciones |
| **Sin notificaciones** | Campana | Icono y mensaje "Sin notificaciones pendientes" |
| **API no disponible** | Panel, header, formulario | Se usan datos de ejemplo para mantener la navegación |

---

## Reglas y validaciones de la UI

### Nuevo reporte

| Campo | Regla |
|---|---|
| Sede / campus | Obligatorio |
| Bloque / edificio | Obligatorio |
| Piso / nivel | Obligatorio |
| Espacio específico | Obligatorio, mínimo 5 caracteres |
| Categoría principal | Obligatoria |
| Subcategoría | Obligatoria y dependiente de la categoría |
| Descripción | Obligatoria, mínimo 15 caracteres, máximo 500 |
| Evidencias | Opcionales, máximo 4 archivos, JPG/PNG, máximo 10 MB por archivo |

### Completar información

| Campo | Regla |
|---|---|
| Aclaración o respuesta | Obligatoria, mínimo 5 caracteres |
| Fotos adicionales | Opcionales, JPG/PNG, máximo 10 MB por archivo |

### Estados del ticket

| Valor | Etiqueta visual | Significado |
|---|---|---|
| `EN_PROCESO` | En Proceso | La cuadrilla está atendiendo el ticket |
| `PENDIENTE_INFORMACION` | Pendiente de Información | El técnico necesita una aclaración o evidencia adicional |
| `RESUELTO` | Resuelto | El trabajo terminó y se firmó conformidad |

### Acción principal

| Valor | Acción en la UI |
|---|---|
| `VER_DETALLE` | Enlace a `/mis-solicitudes/{id}` |
| `COMPLETAR_INFORMACION` | Abre el modal global |

### Otras reglas

- El badge del sidebar se oculta cuando el valor es 0.
- El badge del sidebar cambia de tono en `/reportes/nuevo` y `/mis-solicitudes`.
- La paginación nunca queda en una página fuera de rango.
- El filtro de fecha usa `actualizadoEn`; si la fecha no es válida, el ticket no pasa el filtro.
- La campana no muestra badge cuando el conteo es 0.
- El botón de copiar confirma con "¡Copiado!" durante 2 segundos.

---

## Estilos y sistema de diseño

### Tailwind CSS 4

El proyecto usa **Tailwind CSS 4** con configuración dentro de CSS. No hay `tailwind.config.ts`: los tokens se declaran en `src/app/globals.css` con `@theme`.

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-inter);
  --font-display: var(--font-jakarta);

  --color-ink: #091426;
  --color-muted: #45474c;
  --color-brand: #006398;
  --color-page: #f7f9fb;
  --color-panel: #f2f4f6;
  --color-line: #e0e3e5;
  --color-btn: #e6e8ea;
  --color-pending: #ffe8d1;
  --color-pending-row: #fff6ed;
  --color-pending-ink: #c45c26;
  --color-pending-dot: #f7a364;
  --color-pending-action: #f59e0b;
}
```

### Tokens principales

| Token | Uso |
|---|---|
| `ink` | Texto principal y fondos oscuros |
| `muted` | Texto secundario |
| `brand` | Azul institucional, enlaces y botones primarios |
| `page` | Fondo general |
| `panel` | Fondos suaves de tarjetas y bloques |
| `line` | Bordes y separadores |
| `btn` | Botones secundarios |
| `pending*` | Estados de pendiente de información y acciones de atención |

### Tipografía

- **Inter** para texto general (`font-sans`).
- **Plus Jakarta Sans** para títulos (`font-display`).

Ambas se cargan con `next/font/google` en el layout, sin requests externos en tiempo de ejecución.

### Iconos

`src/components/icons.tsx` contiene un set propio de SVG. Se usan así:

```tsx
import { Icon } from "@/components/icons";

<Icon name="bell" className="size-4 text-brand" />
```

El tipo `IconName` está exportado para tipar nombres de iconos en props y arreglos.

### Responsive

- El sidebar se oculta por debajo de `lg`; las páginas siguen siendo accesibles por URL y desde los accesos directos del panel y del listado.
- La etiqueta de campus del header se oculta por debajo de `md`.
- Los datos del usuario se ocultan por debajo de `lg`.
- La tabla de Mis Solicitudes tiene scroll horizontal interno.
- Los formularios y tarjetas usan grids que pasan de una a varias columnas.

### Imágenes

`next.config.ts` permite imágenes remotas de `localhost:3001` y `ui-avatars.com`, y compila en modo `standalone` para despliegue con Docker.

---

## Accesibilidad

El frontend incluye varias prácticas que conviene mantener al agregar pantallas:

- Botones con `aria-label` cuando solo muestran un icono.
- Campana con `aria-haspopup`, `aria-expanded` y descripción del conteo.
- Popover y modal que se cierran con **Escape**.
- Modal con `role="dialog"`, `aria-modal="true"` y bloqueo del scroll de fondo.
- Acordeón de FAQ con `aria-expanded` y `aria-controls`.
- Estados de carga con `aria-busy` y `aria-live` donde aplica.
- Formularios con `label` asociado por `htmlFor` y mensajes de error visibles.
- Foco visible mediante clases de `focus:border-brand` y `focus:ring`.
- Textos alternativos en imágenes y `aria-hidden` en elementos decorativos.

---

## Variables de entorno

| Variable | Obligatoria | Valor por defecto | Descripción |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:3001` | URL base de la API de PRAXIS |

Archivo de ejemplo: `apps/web/.env.example`.

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Notas:

- En local puedes usar `apps/web/.env.local`.
- Al cambiar la variable, reinicia el servidor de desarrollo.
- En producción, el valor se incorpora en el build; si cambia, hay que volver a compilar.
- En Docker se pasa como `ARG`/`ENV` durante la construcción (`docker/Dockerfile.web`).

---

## Convenciones de código y trabajo

### Código

- **Alias `@/`** para imports desde `src`.
- **Server Components por defecto**; `"use client"` solo si hay hooks o eventos.
- **Componentes en PascalCase**, archivos en kebab-case.
- **Tipos de la API centralizados** en `src/lib/api.ts`.
- **Datos de respaldo** junto a sus tipos, para que la UI siga funcionando sin API.
- **Tokens de color** de `globals.css` en lugar de valores sueltos cuando sea posible.
- **Textos de interfaz en español** y mensajes claros para el usuario final.
- **Iconos** siempre desde `components/icons.tsx`, no SVG sueltos en las páginas.

### Git y revisión

- Rama nueva desde `main` con el formato `feature/PRAX-...` o `feature/web-...`.
- Commits descriptivos, con la referencia de Jira cuando aplique (`KAN-91`, `PRAX-30`).
- Pull Request hacia `main`.
- CI debe pasar: ESLint y build del frontend.
- Revisión del área afectada y validación de QA antes del merge.

### Estructura de un componente nuevo

```text
components/mi-modulo/
├── mi-componente.tsx        # UI
└── mi-componente-aux.tsx    # Piezas específicas del módulo
```

Si el componente necesita datos del servidor, deja la página como Server Component y aísla la interactividad en un componente cliente.

---

## Recetas para extender el frontend

### Agregar una página que consume la API

```tsx
// src/app/mi-pagina/page.tsx
import { apiGet, FALLBACK_RESUMEN, type ResumenPanel } from "@/lib/api";

export default async function MiPagina() {
  const resumen = await apiGet<ResumenPanel>(
    "/dashboard/resumen",
    FALLBACK_RESUMEN,
    0,
  );

  return <h1>Hola, {resumen.nombreUsuario}</h1>;
}
```

Agrega la ruta al menú en `components/sidebar.tsx` si debe ser visible.

### Abrir el modal de completar información

```tsx
"use client";

import { useCompletarInfo } from "@/components/mis-solicitudes/completar-info-modal";

export function MiBoton({ ticketId }: { ticketId: string }) {
  const { abrir } = useCompletarInfo();

  return (
    <button type="button" onClick={() => abrir(ticketId)}>
      Completar información
    </button>
  );
}
```

El componente debe estar dentro de `CompletarInfoProvider`, que ya envuelve toda la app desde el layout.

### Enviar datos a la API

```tsx
import { apiPost, type ConfirmacionReporte } from "@/lib/api";

const res = await apiPost<ConfirmacionReporte>("/reportes/crear", payload);

if (!res.ok) {
  // Mostrar error y permitir reintentar
  return;
}

// Usar res.datos
```

### Agregar un endpoint nuevo

1. Añade el tipo de respuesta en `src/lib/api.ts`.
2. Define un fallback si la pantalla debe seguir siendo navegable sin API.
3. Consume con `apiGet` o `apiGetEstado` según necesites distinguir vacío/error.
4. Documenta la ruta en la tabla de endpoints de este README.

---

## Pruebas manuales

La validación del frontend se hace contra la API local. Estos son los escenarios recomendados:

| # | Escenario | Pasos | Resultado esperado |
|---|---|---|---|
| 1 | Navegación base | Abrir `/` | Redirige a `/panel` |
| 2 | Panel con datos | Entrar a `/panel` con la API activa | Saludo, contadores y reportes reales |
| 3 | Panel sin API | Detener la API y recargar `/panel` | Se muestran datos de ejemplo sin romper la pantalla |
| 4 | Validación de ubicación | Enviar el formulario vacío | Errores en sede, bloque, piso y espacio específico |
| 5 | Validación de descripción | Escribir menos de 15 caracteres | Error en el campo de descripción |
| 6 | Subcategoría reactiva | Cambiar la categoría principal | Se limpia la subcategoría y aparecen solo las de la nueva categoría |
| 7 | Evidencia inválida | Intentar subir un archivo que no sea JPG/PNG | Mensaje de formato no admitido |
| 8 | Evidencia por tamaño | Subir una imagen de más de 10 MB | Mensaje de límite superado |
| 9 | Evidencia completa | Adjuntar 4 imágenes | Se muestran las 4 con vista previa y no permite más |
| 10 | Crear reporte | Completar el formulario y enviar | Pantalla de confirmación con código, fecha y ubicación |
| 11 | Copiar código | Pulsar "Copiar Código" | Texto "¡Copiado!" durante 2 segundos |
| 12 | Ver detalle | Abrir un ticket desde el listado | Datos, evidencias y trazabilidad |
| 13 | Aviso de acción | Abrir `TKT-2026-0472` | Aviso de acción requerida y botón "Responder y Subsanar" |
| 14 | Completar información | Responder con menos de 5 caracteres | Error de validación en el modal |
| 15 | Envío exitoso | Responder correctamente | El modal se cierra y el listado se actualiza |
| 16 | Búsqueda | Buscar por código, título o ubicación | La tabla se filtra en vivo |
| 17 | Filtro de fecha | Elegir "Hoy" | Solo aparecen tickets actualizados hoy |
| 18 | Filtros sin resultados | Combinar filtros que no coincidan | Estado "No encontramos solicitudes" y "Limpiar filtros" |
| 19 | Paginación | Crear más de 4 tickets y avanzar | Se muestran 4 por página y se respeta el rango |
| 20 | Error del listado | Detener la API y entrar a Mis Solicitudes | Estado de error con "Reintentar" |
| 21 | Campana con conteo | Abrir la campana con notificaciones | Badge, listado y notificaciones no leídas destacadas |
| 22 | Marcar leídas | Pulsar "Marcar todas como leídas" | El badge desaparece y el listado queda como leído |
| 23 | Cierre del popover | Abrir la campana y pulsar Escape o fuera | El popover se cierra |
| 24 | FAQ | Abrir `/ayuda` | Guía, PDF y preguntas desplegadas |
| 25 | FAQ sin endpoint | Simular 404 en `/ayuda/faqs` | Se muestran las preguntas locales |
| 26 | Responsive | Reducir a ancho móvil | Sidebar oculto, contenido apilado y tabla con scroll interno |

---

## Glosario

| Término | Significado |
|---|---|
| **Ticket / solicitud** | Reporte de una falla o novedad de infraestructura |
| **Radicado** | Registro oficial del ticket en el sistema |
| **Solicitante** | Persona que reporta la falla (docente, administrativo, etc.) |
| **Cuadrilla** | Equipo técnico encargado de atender el ticket |
| **Evidencia** | Foto o archivo que soporta el reporte |
| **Trazabilidad** | Línea de tiempo de los cambios y acciones del ticket |
| **Pendiente de información** | Estado en el que el técnico necesita una aclaración del solicitante |
| **Fallback** | Dato local que se usa cuando la API no está disponible |
| **Provider** | Componente que comparte estado global, en este caso el modal de completar información |

---

## Enlaces y contacto

| Recurso | Enlace |
|---|---|
| Repositorio | https://github.com/IkerMiguel/Praxis |
| API | `http://localhost:3001` en desarrollo |
| Frontend | `http://localhost:3000` en desarrollo |
| Guía de usuario (PDF) | `apps/web/public/guias/praxis-guia-usuario.pdf` |
| Documentación general del monorepo | `README.md` en la raíz |
| Tablero Jira | _completar_ |
| Diseño / Figma | _completar_ |
| Responsable de la entrega | _completar_ |
| Contacto técnico | _completar_ |

### Antes de la primera sesión

1. Confirma acceso al repositorio y a la rama `main`.
2. Solicita acceso al tablero de Jira y al archivo de diseño.
3. Verifica que puedes levantar la API en `http://localhost:3001`.
4. Ejecuta `pnpm install`, `pnpm dev:web` y navega por las cinco pantallas.
5. Revisa los escenarios de prueba manual de la sección anterior.

---

**Stack:** Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 · pnpm 11.24.0
