export const CONTEO_MOCK_NOTIFICACIONES = 0;

export type TipoNotificacion =
  | "ASIGNACION"
  | "COMENTARIO"
  | "SOLICITUD_INFORMACION";

export type ItemNotificacion = {
  id: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  ticketId: string;
  tiempo: string;
  leida: boolean;
};

// Fallback si la API no responde: sin notificaciones y sin badge.
export const FALLBACK_NOTIFICACIONES: ItemNotificacion[] = [];
