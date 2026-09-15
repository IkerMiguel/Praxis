import Link from "next/link";
import { Icon } from "@/components/icons";

const linkBase =
  "flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors";
const linkIdle = `${linkBase} text-muted hover:bg-panel`;

export function Sidebar({
  active = "inicio",
}: {
  active?: "inicio" | "nuevo-reporte";
}) {
  const badgeTone =
    active === "nuevo-reporte"
      ? "bg-btn text-muted"
      : "bg-brand text-white";

  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-line/60 bg-white px-3 pb-3 pt-4 lg:flex">
      <div>
        <p className="px-3 text-[11px] font-semibold tracking-[0.55px] text-muted">
          PRINCIPAL
        </p>
        <nav className="mt-3 space-y-1">
          {active === "inicio" ? (
            <span
              className={`${linkBase} bg-ink text-[13px] font-semibold leading-[18px] text-white shadow-sm`}
            >
              <Icon name="home" className="size-4" />
              Inicio / Panel
            </span>
          ) : (
            <Link href="/" className={`${linkIdle} text-[14px] leading-5`}>
              <Icon name="home" className="size-4 text-muted" />
              Inicio / Panel
            </Link>
          )}

          {active === "nuevo-reporte" ? (
            <span
              className={`${linkBase} bg-[#1e293b] text-[13px] font-semibold leading-[18px] text-white shadow-sm`}
            >
              <Icon name="plus" className="size-4" />
              Nuevo Reporte
            </span>
          ) : (
            <Link
              href="/nuevo-reporte"
              className={`${linkIdle} text-[14px] leading-5`}
            >
              <Icon name="plus" className="size-4 text-brand" />
              + Nuevo Reporte
            </Link>
          )}

          <a
            href="#"
            className={`${linkIdle} text-[14px] leading-5`}
          >
            <Icon name="inbox" className="size-4 text-muted" />
            Mis Solicitudes
            <span
              className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[12px] font-bold leading-4 ${badgeTone}`}
            >
              3
            </span>
          </a>
        </nav>

        <p className="mt-6 px-3 text-[11px] font-semibold tracking-[0.55px] text-muted">
          SOPORTE
        </p>
        <nav className="mt-3 space-y-1">
          <a
            href="#"
            className={`${linkIdle} text-[14px] leading-5`}
          >
            <Icon name="help" className="size-4 text-muted" />
            Ayuda / Preguntas
            <br />
            Frecuentes
          </a>
        </nav>
      </div>

      <div className="rounded-md bg-panel p-3">
        <p className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.44px] text-muted">
          PRAXIS ECCI v1.0 — {active === "nuevo-reporte" ? "Campus Cali" : "MVP"}
        </p>
        <p className="mt-1 text-[12px] leading-4 text-muted">
          Mesa de Ayuda Operacional
        </p>
      </div>
    </aside>
  );
}