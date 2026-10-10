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
  meta: string;
  accionPrincipal: AccionTicket;
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
