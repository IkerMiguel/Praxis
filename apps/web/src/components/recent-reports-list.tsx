import Link from "next/link";
import { Icon } from "@/components/icons";
import { recentReports } from "@/app/lib/mock-recent-reports";

export function RecentReportsList() {
  return (
    <section className="rounded-xl border border-line/60 bg-white p-5 shadow-sm lg:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">
            Mis Reportes Recientes
          </h2>
          <p className="mt-1 text-sm text-muted">
            Seguimiento al estado de tus requerimientos radicados en el sistema
            PRAXIS.
          </p>
        </div>
        <Link
          href="/mis-solicitudes"
          className="inline-flex items-center gap-2 rounded-lg bg-btn px-3 py-2 text-sm font-medium text-ink"
        >
          <Icon name="fileText" className="size-4" />
          Historial Completo
        </Link>
      </div>

      {/* Lista */}
      <ul className="mt-4 divide-y divide-line/60">
        {recentReports.map((r) => (
          <li
            key={r.id}
            className={`flex flex-col gap-3 py-5 lg:flex-row lg:items-center lg:justify-between ${
              r.status === "pendiente_info"
                ? "rounded-xl bg-pending-row px-4"
                : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-ink">{r.id}</span>
                <StatusBadge status={r.status} />
                <span className="text-muted">• {r.updatedLabel}</span>
              </div>

              <p className="mt-1 text-base font-semibold text-ink">{r.title}</p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="mapPin" className="size-4 text-brand" />
                  {r.location}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 ${
                    r.meta.tone === "warning"
                      ? "text-orange-700"
                      : r.meta.tone === "success"
                        ? "text-emerald-700"
                        : "text-muted"
                  }`}
                >
                  <Icon
                    name={
                      r.meta.icon === "users"
                        ? "inbox"
                        : r.meta.icon === "checkCircle"
                          ? "check"
                          : "info"
                    }
                    className="size-4"
                  />
                  {r.meta.text}
                </span>
              </div>
            </div>

            {r.action === "completar_info" ? (
              <Link
                href="/mis-solicitudes"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-pending-action px-4 py-2.5 text-sm font-semibold text-white"
              >
                Completar Información Requerida
                <Icon name="arrowRight" className="size-4" />
              </Link>
            ) : (
              <Link
                href="/mis-solicitudes"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-btn px-4 py-2.5 text-sm font-semibold text-ink"
              >
                Ver Detalle
                <Icon name="chevronRight" className="size-4" />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function StatusBadge({ status }: { status: (typeof recentReports)[number]["status"] }) {
  const map = {
    en_proceso: {
      label: "En Proceso",
      className: "bg-sky-50 text-brand",
      dot: "bg-brand",
    },
    pendiente_info: {
      label: "Pendiente de Información",
      className: "bg-pending text-pending-ink",
      dot: "bg-pending-dot",
    },
    resuelto: {
      label: "Resuelto",
      className: "bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    },
  } as const;

  const s = map[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.className}`}
    >
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}