import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-[0.44px] ${className}`}
    >
      {label}
    </span>
  );
}

type Ticket = {
  id: string;
  status: { label: string; badge: string };
  time: string;
  title: string;
  location: string;
  locationColor?: string;
  metaIcon: IconName;
  meta: string;
  metaColor?: string;
  action: { label: string; className: string };
  tinted?: boolean;
};

const tickets: Ticket[] = [
  {
    id: "#TKT-2026-0489",
    status: { label: "En Proceso", badge: "bg-[#cce5ff] text-[#001d31]" },
    time: "• Hace 45 min",
    title: "Fuga de agua en lavamanos piso 3",
    location: "Sede Cali • Bloque A • Baño Hombres",
    metaIcon: "wrench",
    meta: "Cuadrilla Hidráulica 02",
    action: { label: "Ver Detalle", className: "bg-btn text-ink" },
  },
  {
    id: "#TKT-2026-0472",
    status: {
      label: "Pendiente de Información",
      badge: "bg-[#fef3c7] text-[#92400e]",
    },
    time: "• Ayer, 16:30",
    title: "Lámpara LED parpadeante en Lab 302",
    location: "Sede Cali • Bloque B • Lab Sistemas",
    metaIcon: "help",
    meta: "Requiere aclaración técnica de balastro",
    metaColor: "text-[#92400e]",
    action: {
      label: "Completar Información Requerida",
      className: "bg-[#f59e0b] text-white shadow-sm",
    },
    tinted: true,
  },
  {
    id: "#TKT-2026-0450",
    status: { label: "Resuelto", badge: "bg-[#d1fae5] text-[#065f46]" },
    time: "• 02 Mar 2026",
    title: "Cerradura averiada en Aula Magna 101",
    location: "Sede Cali • Bloque B • Auditorio 101",
    metaIcon: "check",
    meta: "Conformidad firmada",
    metaColor: "text-[#047857]",
    action: { label: "Ver Detalle", className: "bg-btn text-ink" },
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans text-ink">
      <Header />

      <div className="flex flex-1">
        <Sidebar active="inicio" />

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#34d399]" />
              <p className="text-[11px] font-semibold tracking-[0.55px] text-muted">
                CAMPUS CALI • PERIODO ACTIVO
              </p>
            </div>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[44px] tracking-[-0.72px]">
              Hola, Ing. Carlos Mendoza
            </h1>
            <p className="mt-1 text-[16px] leading-[26px] text-muted">
              Gestiona y consulta el estado de tus reportes de infraestructura
              en Sede Cali en tiempo real.
            </p>
          </section>

          <h2 className="mt-8 font-display text-[16px] font-bold leading-6 tracking-[-0.4px]">
            Reportar Daño o Falla
          </h2>

          <div className="mt-3 grid gap-6 md:grid-cols-2">
            <section className="flex flex-col rounded-lg bg-white p-6 shadow-sm">
              <h3 className="font-display text-[16px] font-bold leading-6 tracking-[-0.4px]">
                Reportar Daño o Falla
              </h3>
              <p className="mt-1 text-[12px] leading-[19px] text-muted">
                Notifica novedades locativas o técnicas en el campus en pocos
                segundos.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
                <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.44px] text-muted">
                  <Icon name="clock" className="size-3 text-brand" />
                  Asignación técnica en menos de 24h
                </span>
                <Link
                  href="/nuevo-reporte"
                  className="flex h-9 items-center gap-2 rounded-md bg-brand px-4 text-[13px] font-semibold leading-[18px] text-white shadow-sm transition-colors hover:bg-[#00517f]"
                >
                  <Icon name="plus" className="size-3" />
                  Nuevo Reporte
                </Link>
              </div>
            </section>

            <section className="flex flex-col rounded-lg bg-white p-6 shadow-sm">
              <h3 className="font-display text-[16px] font-bold leading-6 tracking-[-0.4px]">
                Tus solicitudes activas
              </h3>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                <p className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold leading-6">
                    3
                  </span>
                  <span className="text-[13px] font-medium leading-[18px] text-muted">
                    solicitudes activas
                  </span>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    label="2 En Proceso"
                    className="bg-[#cce5ff] text-[#001d31]"
                  />
                  <StatusBadge
                    label="1 Pendiente"
                    className="bg-[#fef3c7] text-[#92400e]"
                  />
                </div>
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-[#eceef0]">
                <div className="h-full w-[66%] rounded-full bg-brand" />
              </div>
              <div className="mt-4 flex-1" />
              <a
                href="#"
                className="mt-3 inline-flex items-center gap-2 text-[13px] font-semibold leading-[18px] text-brand"
              >
                Ver todas mis solicitudes
                <Icon name="arrowRight" className="size-3" />
              </a>
            </section>
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-[28px] font-bold leading-9 tracking-[-0.7px]">
                Mis Reportes Recientes
              </h2>
              <p className="mt-1 text-[14px] leading-5 text-muted">
                Seguimiento al estado de tus requerimientos radicados en el
                sistema PRAXIS.
              </p>
            </div>
            <button
              type="button"
              className="flex h-9 items-center gap-2 rounded-md bg-btn px-4 text-[13px] font-semibold leading-[18px] text-ink transition-colors hover:bg-line"
            >
              <Icon name="fileText" className="size-3" />
              Historial Completo
            </button>
          </div>

          <section className="mt-4 overflow-hidden rounded-lg bg-white shadow-md">
            {tickets.map((t) => (
              <div key={t.id}>
                <article
                  className={`flex flex-wrap items-center justify-between gap-4 px-6 py-5 ${
                    t.tinted ? "bg-[#fffbeb]" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-bold leading-[18px] text-ink">
                        {t.id}
                      </span>
                      <StatusBadge label={t.status.label} className={t.status.badge} />
                      <span className="text-[11px] font-semibold leading-[14px] tracking-[0.44px] text-muted">
                        {t.time}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-[16px] font-semibold leading-6 tracking-[-0.08px] text-[#191c1e]">
                      {t.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] leading-4 tracking-[0.12px]">
                      <span className="flex items-center gap-1.5 text-muted">
                        <Icon name="mapPin" className="size-3 text-brand" />
                        {t.location}
                      </span>
                      <span
                        className={`flex items-center gap-1.5 ${
                          t.metaColor ?? "text-muted"
                        }`}
                      >
                        <Icon
                          name={t.metaIcon}
                          className={`size-3 ${t.metaColor ?? "text-muted"}`}
                        />
                        {t.meta}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`flex h-8 items-center gap-2 rounded-md px-3.5 text-[13px] font-semibold leading-[18px] transition-colors ${t.action.className}`}
                  >
                    {t.action.label}
                    {t.tinted ? <Icon name="arrowRight" className="size-3" /> : null}
                  </button>
                </article>
                {t.id !== tickets[tickets.length - 1].id ? (
                  <div className="mx-6 h-px bg-line" />
                ) : null}
              </div>
            ))}
          </section>

          <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-panel p-5 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink">
                <Icon name="bookOpen" className="size-4 text-white" />
              </span>
              <div>
                <h4 className="font-display text-[16px] font-bold leading-6 tracking-[-0.08px]">
                  ¿Primera vez registrando una falla física?
                </h4>
                <p className="mt-1 text-[12px] leading-4 text-muted">
                  Consulta las guías de clasificación técnica para agilizar la
                  gestión y atención técnica de infraestructura.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="flex h-9 items-center gap-2 rounded-md bg-white px-4 text-[13px] font-semibold leading-[18px] text-ink shadow-sm transition-colors hover:bg-panel"
            >
              <Icon name="bookOpen" className="size-3" />
              Guía de Usuario PRAXIS
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}