import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import {
  BotonCopiarCodigo,
  BotonResponderYSubsanar,
} from "@/components/mis-solicitudes/acciones-detalle";
import { EstadoBadge } from "@/components/mis-solicitudes/estado-badge";
import { apiGet, FALLBACK_DETALLE, type DetalleReporte } from "@/lib/api";

export const metadata: Metadata = {
  title: "Detalle de Solicitud · PRAXIS ECCI",
};

export default async function DetalleSolicitudPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const idBuscado = id.toUpperCase();
  const detalle =
    (await apiGet<DetalleReporte | null>(
      `/reportes/solicitudes/${encodeURIComponent(id)}`,
      null,
      0,
    )) ??
    // Sin backend, mostramos el ticket de ejemplo si coincide.
    (idBuscado === FALLBACK_DETALLE.id ? FALLBACK_DETALLE : null);

  if (!detalle) notFound();

  const pendiente = detalle.estado === "PENDIENTE_INFORMACION";

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <nav
        aria-label="Ruta de navegación"
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/mis-solicitudes"
            className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink"
          >
            <Icon name="chevronLeft" className="size-4" />
            Volver al Listado
          </Link>
          <span className="text-[#c5c6cd]">|</span>
          <h1 className="font-display text-lg font-bold tracking-tight text-ink">
            Ticket <span className="text-brand">#{detalle.id}</span>
          </h1>
          <EstadoBadge estado={detalle.estado} />
        </div>
        <BotonCopiarCodigo codigo={detalle.id} />
      </nav>

      {pendiente && (
        <section className="mt-5 rounded-xl border border-pending-dot/60 bg-pending-row p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-pending">
                <Icon
                  name="alertTriangle"
                  className="size-4.5 text-pending-ink"
                />
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-pending-ink">
                  Acción Requerida del Solicitante
                </h2>
                <p className="mt-1 text-sm text-ink">
                  {detalle.requerimientoTecnico}
                </p>
              </div>
            </div>
            <BotonResponderYSubsanar ticketId={detalle.id} />
          </div>
        </section>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-xl border border-line/60 bg-white p-5 shadow-sm lg:p-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.55px] text-muted">
            Detalles Generales
          </h2>

          <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <Dato label="Campus / Sede" valor={detalle.campus} />
            <Dato label="Ubicación física" valor={detalle.ubicacionFisica} />
            <Dato label="Categoría" valor={detalle.categoriaTecnica} />
            <Dato label="Fecha radicación" valor={detalle.fechaRadicacion} />
          </dl>

          <hr className="my-6 border-line/60" />

          <h3 className="text-sm font-semibold text-ink">
            Descripción inicial del reporte:
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            {detalle.descripcionInicial}
          </p>

          <h3 className="mt-6 text-sm font-semibold text-ink">
            Evidencias fotográficas ({detalle.evidencias.length} archivo
            {detalle.evidencias.length === 1 ? "" : "s"}):
          </h3>
          <ul className="mt-3 flex flex-wrap gap-3">
            {detalle.evidencias.map((archivo) => (
              <li
                key={archivo}
                className="flex items-center gap-2.5 rounded-lg border border-line/60 bg-panel px-3.5 py-2.5"
              >
                <span className="flex size-9 items-center justify-center rounded-md bg-white shadow-sm">
                  <Icon name="image" className="size-4 text-brand" />
                </span>
                <span className="text-xs font-medium text-ink">{archivo}</span>
              </li>
            ))}
          </ul>
        </section>

        <aside className="rounded-xl border border-line/60 bg-white p-5 shadow-sm lg:p-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.55px] text-muted">
            Trazabilidad Técnica
          </h2>

          <ol className="mt-4 space-y-5">
            {detalle.trazabilidad.map((evento, i) => (
              <li key={`${evento.estado}-${i}`} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1 size-2.5 shrink-0 rounded-full ${
                      i === 0 ? "bg-pending-dot" : "bg-brand"
                    }`}
                  />
                  {i < detalle.trazabilidad.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-line" />
                  )}
                </div>
                <div className="min-w-0 pb-1">
                  <p className="text-sm font-semibold text-ink">
                    {evento.estado}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-brand">
                    {evento.fecha}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {evento.descripcion}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}

function Dato({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.44px] text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-ink">{valor}</dd>
    </div>
  );
}
