import { Icon } from "@/components/icons";

const linkIdle =
  "flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-line/60 bg-white px-3 pb-3 pt-4 lg:flex">
      <div>
        <p className="px-3 text-[11px] font-semibold tracking-[0.55px] text-muted">
          PRINCIPAL
        </p>
        <nav className="mt-3 space-y-1">
          <a
            href="#"
            className={`${linkIdle} bg-ink text-[13px] font-semibold leading-[18px] text-white shadow-sm`}
          >
            <Icon name="home" className="size-4" />
            Inicio / Panel
          </a>
          <a
            href="#"
            className={`${linkIdle} text-[14px] leading-5 text-muted hover:bg-panel`}
          >
            <Icon name="plus" className="size-4 text-brand" />
            + Nuevo Reporte
          </a>
          <a
            href="#"
            className={`${linkIdle} text-[14px] leading-5 text-muted hover:bg-panel`}
          >
            <Icon name="inbox" className="size-4 text-muted" />
            Mis Solicitudes
          </a>
        </nav>

        <p className="mt-6 px-3 text-[11px] font-semibold tracking-[0.55px] text-muted">
          SOPORTE
        </p>
        <nav className="mt-3 space-y-1">
          <a
            href="#"
            className={`${linkIdle} text-[14px] leading-5 text-muted hover:bg-panel`}
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
          PRAXIS ECCI v1.0 — MVP
        </p>
        <p className="mt-1 text-[12px] leading-4 text-muted">
          Mesa de Ayuda Operacional
        </p>
      </div>
    </aside>
  );
}