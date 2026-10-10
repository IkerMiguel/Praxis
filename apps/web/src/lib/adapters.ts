import type { ReporteReciente } from "@/lib/api";
import type { RecentReport } from "@/app/lib/mock-recent-reports";

const statusMap: Record<ReporteReciente["estado"], RecentReport["status"]> = {
  EN_PROCESO: "en_proceso",
  PENDIENTE_INFORMACION: "pendiente_info",
  RESUELTO: "resuelto",
};

const metaMap: Record<
  ReporteReciente["estado"],
  Pick<RecentReport["meta"], "icon" | "tone">
> = {
  EN_PROCESO: { icon: "users", tone: "muted" },
  PENDIENTE_INFORMACION: { icon: "message", tone: "warning" },
  RESUELTO: { icon: "checkCircle", tone: "success" },
};

export function toRecentReports(items: ReporteReciente[]): RecentReport[] {
  return items.map((item) => ({
    id: item.id.startsWith("#") ? item.id : `#${item.id}`,
    status: statusMap[item.estado] ?? "en_proceso",
    updatedLabel: item.actualizadoHace,
    title: item.titulo,
    location: item.ubicacion,
    meta: {
      ...(metaMap[item.estado] ?? metaMap.EN_PROCESO),
      text: item.meta.trim(),
    },
    action:
      item.accionPrincipal === "COMPLETAR_INFORMACION"
        ? "completar_info"
        : "ver_detalle",
  }));
}
