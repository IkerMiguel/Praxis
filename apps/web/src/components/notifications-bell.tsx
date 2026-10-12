"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";

export function NotificationsBell({ conteo }: { conteo: number }) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);
  const hayPendientes = conteo > 0;

  useEffect(() => {
    if (!abierto) return;

    const alClicarFuera = (evento: MouseEvent) => {
      if (!contenedor.current?.contains(evento.target as Node)) {
        setAbierto(false);
      }
    };
    const alPresionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAbierto(false);
    };

    document.addEventListener("mousedown", alClicarFuera);
    document.addEventListener("keydown", alPresionarTecla);
    return () => {
      document.removeEventListener("mousedown", alClicarFuera);
      document.removeEventListener("keydown", alPresionarTecla);
    };
  }, [abierto]);

  return (
    <div className="relative" ref={contenedor}>
      <button
        type="button"
        aria-label={
          hayPendientes
            ? `Notificaciones, ${conteo} pendientes`
            : "Notificaciones, sin pendientes"
        }
        aria-haspopup="dialog"
        aria-expanded={abierto}
        onClick={() => setAbierto((actual) => !actual)}
        className="relative flex size-9 items-center justify-center rounded-md bg-panel text-muted transition-colors hover:bg-btn"
      >
        <Icon name="bell" className="size-[17px]" />
        {hayPendientes && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ba1a1a] px-1 text-[11px] font-semibold leading-[11px] text-white">
            {conteo}
          </span>
        )}
      </button>

      {abierto && (
        <div
          role="dialog"
          aria-label={`Notificaciones (${conteo})`}
          className="absolute right-0 top-11 z-50 w-72 overflow-hidden rounded-xl border border-line/60 bg-white shadow-lg"
        >
          <p className="border-b border-line/60 px-4 py-3 text-sm font-semibold text-ink">
            Notificaciones ({conteo})
          </p>
          <div className="flex flex-col items-center gap-3 px-4 py-6 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-panel">
              <Icon
                name={hayPendientes ? "bell" : "bellOff"}
                className="size-5 text-muted"
              />
            </span>
            <p className="text-sm text-muted">
              {hayPendientes
                ? "Próximamente: aquí verás los avisos de tus reportes."
                : "Sin notificaciones pendientes"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
