import Image from "next/image";
import { Icon } from "@/components/icons";

export function Header({
  campus = "Docente / Solicitante | Sede Cali",
}: {
  campus?: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src="/logo-praxis.png"
            alt="PRAXIS ECCI"
            width={32}
            height={32}
            className="size-8"
          />
          <span className="h-6 w-px bg-line" aria-hidden="true" />
          <div className="min-w-0">
            <p className="font-display text-[16px] font-semibold leading-6 tracking-[-0.4px]">
              PRAXIS ECCI
            </p>
            <p className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.44px] text-muted">
              Gestión de Infraestructura
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-xl bg-panel px-3.5 py-2 text-muted md:flex">
            <Icon name="mapPin" className="size-[14px] text-brand" />
            <span className="text-[13px] font-semibold leading-[18px]">
              Universidad ECCI - Campus Cali
            </span>
            <Icon name="chevronDown" className="size-3.5" />
          </div>

          <div className="relative">
            <button
              type="button"
              aria-label="Notificaciones"
              className="flex size-9 items-center justify-center rounded-md bg-panel text-muted"
            >
              <Icon name="bell" className="size-[17px]" />
            </button>
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ba1a1a] px-1 text-[11px] font-semibold leading-[11px] text-white">
              3
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-panel py-1 pl-1 pr-3">
            <Image
              src="/avatar-mendoza.png"
              alt="Ing. Carlos Mendoza"
              width={32}
              height={32}
              className="size-8"
            />
            <div className="hidden lg:block">
              <p className="text-[13px] font-semibold leading-[16px] text-[#191c1e]">
                Ing. Carlos Mendoza
              </p>
              <p className="text-[11px] font-semibold leading-[12px] tracking-[0.44px] text-muted">
                {campus}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}