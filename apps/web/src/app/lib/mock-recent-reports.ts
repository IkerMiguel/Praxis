export type ReportStatus = "en_proceso" | "pendiente_info" | "resuelto";
export type ReportAction = "ver_detalle" | "completar_info";
export type MetaTone = "muted" | "warning" | "success";

export type RecentReport = {
  id: string;
  status: ReportStatus;
  updatedLabel: string;  
  title: string;
  location: string;
  meta: { icon: "users" | "message" | "checkCircle"; text: string; tone: MetaTone };
  action: ReportAction;
};

export const recentReports: RecentReport[] = [
  {
    id: "#TKT-2026-0472",
    status: "pendiente_info",
    updatedLabel: "Ayer, 16:30",
    title: "Lámpara LED parpadeante en Lab 302",
    location: "Sede Cali • Bloque B • Lab Sistemas 302",
    meta: {
      icon: "message",
      text: "Reclamo técnico: requiere aclaración de balastro",
      tone: "warning",
    },
    action: "completar_info",
  },
  {
    id: "#TKT-2026-0489",
    status: "en_proceso",
    updatedLabel: "Hace 45 min",
    title: "Fuga de agua en lavamanos piso 3",
    location: "Sede Cali • Bloque A • Baño Hombres",
    meta: { icon: "users", text: "Cuadrilla Hidráulica 02", tone: "muted" },
    action: "ver_detalle",
  },
  {
    id: "#TKT-2026-0450",
    status: "resuelto",
    updatedLabel: "02 Mar 2026",
    title: "Cerradura averiada en Aula Magna 101",
    location: "Sede Cali • Bloque C • Aula Magna",
    meta: { icon: "checkCircle", text: "Conformidad firmada", tone: "success" },
    action: "ver_detalle",
  },
];
