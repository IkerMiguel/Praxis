export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type PerfilUsuario = {
  nombre: string;
  rol: string;
  sede: string;
  campusLabel: string;
  avatarUrl: string;
};

export type ResumenPanel = {
  nombreUsuario: string;
  sede: string;
  campusLabel: string;
  periodoActivo: boolean;
  solicitudesActivas: number;
  enProceso: number;
  pendienteInformacion: number;
  porcentajeAtencion: number;
};

export type EstadoTicket = "EN_PROCESO" | "PENDIENTE_INFORMACION" | "RESUELTO";
export type AccionTicket = "VER_DETALLE" | "COMPLETAR_INFORMACION";

export type ReporteReciente = {
  id: string;
  estado: EstadoTicket;
  titulo: string;
  actualizadoHace: string;
  ubicacion: string;
  categoria: string;
  meta: string;
  accionPrincipal: AccionTicket;
  mensajeAlerta?: string;
};

export type TrazabilidadItem = {
  estado: string;
  fecha: string;
  descripcion: string;
};

export type DetalleReporte = ReporteReciente & {
  campus: string;
  ubicacionFisica: string;
  categoriaTecnica: string;
  fechaRadicacion: string;
  descripcionInicial: string;
  evidencias: string[];
  requerimientoTecnico?: string;
  trazabilidad: TrazabilidadItem[];
};

export type CompletarInformacionRespuesta = {
  exito: boolean;
  mensaje: string;
  nuevoEstado: EstadoTicket;
};

export type ResumenNotificaciones = {
  notificacionesPendientes: number;
};

export type CategoriaSitio = {
  id: string;
  etiqueta: string;
};

export type Subcategoria = {
  id: string;
  etiqueta: string;
  categoriaId: string;
};

export type CrearReportePayload = {
  sede: string;
  bloque: string;
  piso: string;
  espacioEspecifico: string;
  categoriaSitioId: string;
  clasificacion: string;
  descripcion: string;
  referenciasEvidencia: string[];
};

export type ConfirmacionReporte = {
  id: string;
  fechaRegistro: string;
  estadoInicial: string;
  categoria: string;
  ubicacion: {
    campus: string;
    bloque: string;
    piso: string;
    espacio: string;
  };
};

export const FALLBACK_PERFIL: PerfilUsuario = {
  nombre: "Ing. Carlos Mendoza",
  rol: "Docente / Solicitante",
  sede: "Sede Cali",
  campusLabel: "Universidad ECCI - Campus Cali",
  avatarUrl: "",
};

export const FALLBACK_RESUMEN: ResumenPanel = {
  nombreUsuario: "Ing. Carlos Mendoza",
  sede: "Sede Cali",
  campusLabel: "CAMPUS CALI",
  periodoActivo: true,
  solicitudesActivas: 3,
  enProceso: 2,
  pendienteInformacion: 1,
  porcentajeAtencion: 66,
};

export const FALLBACK_SOLICITUDES: ReporteReciente[] = [
  {
    id: "TKT-2026-0472",
    estado: "PENDIENTE_INFORMACION",
    titulo: "Lámpara LED parpadeante en Lab 302",
    actualizadoHace: "Ayer, 16:30",
    ubicacion: "Sede Cali • Bloque B • Lab Sistemas 302",
    categoria: "Electricidad",
    meta: "Cuadrilla Eléctrica",
    accionPrincipal: "COMPLETAR_INFORMACION",
    mensajeAlerta: "Reclamo técnico: requiere aclaración de balastro",
  },
  {
    id: "TKT-2026-0489",
    estado: "EN_PROCESO",
    titulo: "Fuga de agua en lavamanos piso 3",
    actualizadoHace: "Hace 45 min",
    ubicacion: "Sede Cali • Bloque A • Baño Hombres",
    categoria: "Hidráulica",
    meta: "Cuadrilla Hidráulica 02",
    accionPrincipal: "VER_DETALLE",
  },
  {
    id: "TKT-2026-0450",
    estado: "RESUELTO",
    titulo: "Cerradura averiada en Aula Magna 101",
    actualizadoHace: "02 Mar 2026",
    ubicacion: "Sede Cali • Bloque C • Aula Magna",
    categoria: "Cerrajería",
    meta: "Cerrajería",
    accionPrincipal: "VER_DETALLE",
    mensajeAlerta: "Conformidad firmada",
  },
];

// Detalle offline del ticket de ejemplo (evita el 404 sin backend).
export const FALLBACK_DETALLE: DetalleReporte = {
  id: "TKT-2026-0472",
  estado: "PENDIENTE_INFORMACION",
  titulo: "Lámpara LED parpadeante en Lab 302",
  actualizadoHace: "Ayer, 16:30",
  ubicacion: "Sede Cali • Bloque B • Lab Sistemas 302",
  categoria: "Electricidad",
  categoriaTecnica: "Electricidad",
  meta: "Cuadrilla Eléctrica",
  accionPrincipal: "COMPLETAR_INFORMACION",
  mensajeAlerta: "Reclamo técnico: requiere aclaración de balastro",
  campus: "Sede Cali",
  ubicacionFisica: "Bloque B • Lab Sistemas 302",
  fechaRadicacion: "05 Mar 2026, 09:12",
  descripcionInicial:
    "La lámpara LED del laboratorio 302 parpadea de forma intermitente durante las clases, generando molestias visuales a los estudiantes.",
  requerimientoTecnico:
    "Adjunta una foto del balastro o el número de serie del luminario para gestionar el repuesto.",
  evidencias: ["panel_fallas.jpg", "techo_lab.jpg"],
  trazabilidad: [
    {
      estado: "Pendiente de información",
      fecha: "Ayer, 16:30",
      descripcion:
        "El técnico asignado solicita la serie del balastro para gestionar el repuesto.",
    },
    {
      estado: "Asignado a cuadrilla",
      fecha: "Ayer, 10:05",
      descripcion:
        "El ticket fue asignado a la Cuadrilla Eléctrica para diagnóstico.",
    },
    {
      estado: "Radicado",
      fecha: "05 Mar 2026, 09:12",
      descripcion: "El reporte fue creado por el solicitante.",
    },
  ],
};

// Catálogos del formulario de nuevo reporte (mismos datos que la API).
export const FALLBACK_CATEGORIAS: CategoriaSitio[] = [
  { id: "CAT-ELEC", etiqueta: "Electricidad / Iluminación" },
  { id: "CAT-HIDR", etiqueta: "Hidráulica / Plomería" },
  { id: "CAT-MOB", etiqueta: "Mobiliario / Carpintería" },
  { id: "CAT-TEC", etiqueta: "Tecnología / Redes y Equipos" },
  { id: "CAT-INFRA", etiqueta: "Infraestructura / Obra Civil" },
];

export const FALLBACK_SUBCATEGORIAS: Subcategoria[] = [
  { id: "SUB-ELEC-LUM", etiqueta: "Luminarias / Paneles de techo", categoriaId: "CAT-ELEC" },
  { id: "SUB-ELEC-TOM", etiqueta: "Tomas y cableado", categoriaId: "CAT-ELEC" },
  { id: "SUB-ELEC-TAB", etiqueta: "Tableros eléctricos", categoriaId: "CAT-ELEC" },
  { id: "SUB-ELEC-EME", etiqueta: "Iluminación de emergencia", categoriaId: "CAT-ELEC" },
  { id: "SUB-HIDR-FUG", etiqueta: "Fugas / Goteos", categoriaId: "CAT-HIDR" },
  { id: "SUB-HIDR-TAN", etiqueta: "Tanques y cisternas", categoriaId: "CAT-HIDR" },
  { id: "SUB-HIDR-DRE", etiqueta: "Drenajes y tuberías", categoriaId: "CAT-HIDR" },
  { id: "SUB-MOB-MES", etiqueta: "Mesas y sillas", categoriaId: "CAT-MOB" },
  { id: "SUB-MOB-PUE", etiqueta: "Puertas y cerraduras", categoriaId: "CAT-MOB" },
  { id: "SUB-MOB-EST", etiqueta: "Estanterías / Armarios", categoriaId: "CAT-MOB" },
  { id: "SUB-TEC-RED", etiqueta: "Redes y cableado", categoriaId: "CAT-TEC" },
  { id: "SUB-TEC-EQP", etiqueta: "Equipos de cómputo", categoriaId: "CAT-TEC" },
  { id: "SUB-TEC-PRO", etiqueta: "Proyectores y pantallas", categoriaId: "CAT-TEC" },
  { id: "SUB-INF-PIN", etiqueta: "Pintura", categoriaId: "CAT-INFRA" },
  { id: "SUB-INF-MUR", etiqueta: "Muros y pisos", categoriaId: "CAT-INFRA" },
  { id: "SUB-INF-TEC", etiqueta: "Techos y estructuras", categoriaId: "CAT-INFRA" },
];

export function subcategoriasDe(
  categoriaId: string,
  todas: Subcategoria[] = FALLBACK_SUBCATEGORIAS,
): Subcategoria[] {
  return todas.filter((s) => s.categoriaId === categoriaId);
}

export async function apiGet<T>(
  path: string,
  fallback: T,
  revalidate = 30,
): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

// Igual que apiGet pero distingue vacío, error y dato.
// Lo usa el listado de Mis Solicitudes para pintar sus 3 estados.
export type ResultadoApi<T> =
  | { estado: "ok"; datos: T }
  | { estado: "vacio" }
  | { estado: "error" };

export async function apiGetEstado<T>(
  path: string,
  revalidate = 0,
): Promise<ResultadoApi<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      cache: revalidate === 0 ? "no-store" : undefined,
      next: revalidate === 0 ? undefined : { revalidate },
    });
    if (!res.ok) return { estado: "error" };
    const datos = (await res.json()) as T;
    if (Array.isArray(datos) && datos.length === 0) {
      return { estado: "vacio" };
    }
    return { estado: "ok", datos };
  } catch {
    return { estado: "error" };
  }
}

export async function apiPost<T>(
  path: string,
  body: unknown,
): Promise<{ ok: true; datos: T } | { ok: false }> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) return { ok: false };
    return { ok: true, datos: (await res.json()) as T };
  } catch {
    return { ok: false };
  }
}
