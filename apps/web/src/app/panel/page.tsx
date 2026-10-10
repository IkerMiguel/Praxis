import Link from "next/link";
import { Icon } from "@/components/icons";
import { RecentReportsList } from "@/components/recent-reports-list";
import { recentReports } from "@/app/lib/mock-recent-reports";
import {
  apiGet,
  FALLBACK_RESUMEN,
  type ReporteReciente,
  type ResumenPanel,
} from "@/lib/api";
import { toRecentReports } from "@/lib/adapters";

export default async function PanelPage() {
  const [resumen, reportes] = await Promise.all([
    apiGet<ResumenPanel>("/dashboard/resumen", FALLBACK_RESUMEN),
    apiGet<ReporteReciente[] | null>("/reportes/recientes", null),
  ]);

  const items = Array.isArray(reportes)
    ? toRecentReports(reportes)
    : recentReports;
  const { solicitudesActivas: total, enProceso, pendienteInformacion: pendiente } =
    resumen;
  const atencion = Math.min(100, Math.max(0, resumen.porcentajeAtencion));

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <section className="rounded-xl border border-line/60 bg-white p-5 shadow-sm lg:p-6">
        <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.55px] text-muted">
          <span className="inline-block size-2 rounded-full bg-emerald-500" />
          {resumen.campusLabel} •{" "}
          {resumen.periodoActivo ? "PERIODO ACTIVO" : "PERIODO INACTIVO"}
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink lg:text-3xl">
          Hola, {resumen.nombreUsuario}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Gestiona y consulta el estado de tus reportes de infraestructura en{" "}
          {resumen.sede} en tiempo real.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="flex flex-col rounded-xl border border-line/60 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-ink">
            Reportar Daño o Falla
          </h2>
          <p className="mt-2 flex-1 text-sm text-muted">
            Notifica novedades locativas o técnicas en el campus en pocos
            segundos.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4">
            <p className="flex items-center gap-2 text-xs text-muted">
              <Icon name="zap" className="size-4 text-brand" />
              Asignación técnica en menos de 24h
            </p>
            <Link
              href="/reportes/nuevo"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white"
            >
              + Nuevo Reporte
            </Link>
          </div>
        </section>

        <section className="flex flex-col rounded-xl border border-line/60 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-ink">
            Tus solicitudes activas
          </h2>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink">
              <span className="text-3xl font-bold leading-none">{total}</span>{" "}
              <span className="text-muted">solicitudes activas</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-brand">
                <span className="size-1.5 rounded-full bg-brand" />
                {enProceso} En Proceso
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-pending px-2.5 py-1 text-xs font-medium text-pending-ink">
                <span className="size-1.5 rounded-full bg-pending-dot" />
                {pendiente} Pendiente
              </span>
            </div>
          </div>

          <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-btn">
            <div
              className="h-full bg-brand"
              style={{ width: `${atencion}%` }}
            />
            <div
              className="h-full bg-[#b8d4e6]"
              style={{ width: `${100 - atencion}%` }}
            />
          </div>

          <Link
            href="/mis-solicitudes"
            className="mt-4 text-sm font-medium text-brand hover:underline"
          >
            Ver todas mis solicitudes →
          </Link>
        </section>
      </div>
      <RecentReportsList items={items} />
    </div>
  );
}