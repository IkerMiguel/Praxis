"use client";

import { Icon } from "@/components/icons";

export function NotificationsBell({ conteo }: { conteo: number }) {
  const hayPendientes = conteo > 0;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={
          hayPendientes
            ? `Notificaciones, ${conteo} pendientes`
            : "Notificaciones, sin pendientes"
        }
        className="relative flex size-9 items-center justify-center rounded-md bg-panel text-muted transition-colors hover:bg-btn"
      >
        <Icon name="bell" className="size-[17px]" />
        {hayPendientes && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ba1a1a] px-1 text-[11px] font-semibold leading-[11px] text-white">
            {conteo}
          </span>
        )}
      </button>
    </div>
  );
}
