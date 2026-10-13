import { Icon } from "@/components/icons";
import type { EstadoTicket } from "@/lib/api";

const ESTILOS: Record<
  EstadoTicket,
  { label: string; className: string; dot: string }
> = {
  EN_PROCESO: {
    label: "En Proceso",
    className: "bg-sky-50 text-brand",
    dot: "bg-brand",
  },
  PENDIENTE_INFORMACION: {
    label: "Pendiente de Información",
    className: "bg-pending text-pending-ink",
    dot: "bg-pending-dot",
  },
  RESUELTO: {
    label: "Resuelto",
    className: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

export function EstadoBadge({ estado }: { estado: EstadoTicket }) {
  const s = ESTILOS[estado];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.className}`}
    >
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function AvisoAlerta({
  mensaje,
  tono = "warning",
}: {
  mensaje: string;
  tono?: "warning" | "success";
}) {
  return (
    <p
      className={`inline-flex items-start gap-1.5 text-xs ${
        tono === "success" ? "text-emerald-700" : "text-pending-ink"
      }`}
    >
      <Icon
        name={tono === "success" ? "checkCircle" : "alertTriangle"}
        className="mt-px size-3.5 shrink-0"
      />
      {mensaje}
    </p>
  );
}
