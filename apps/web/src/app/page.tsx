import Link from "next/link";
import { Icon } from "@/components/icons";
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
        </main>
      </div>
    </div>
  );
}