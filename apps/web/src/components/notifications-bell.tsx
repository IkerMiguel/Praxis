"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import {
  apiPost,
  type ResumenNotificaciones,
} from "@/lib/api";
import {
  type ItemNotificacion,
  type TipoNotificacion,
} from "@/lib/notificaciones";

const ICONO_TIPO: Record<TipoNotificacion, "alertTriangle" | "wrench" | "message"> = {
  SOLICITUD_INFORMACION: "alertTriangle",
  ASIGNACION: "wrench",
  COMENTARIO: "message",
};

const CLASE_TIPO: Record<TipoNotificacion, string> = {
  SOLICITUD_INFORMACION: "bg-pending text-pending-ink",
  ASIGNACION: "bg-sky-50 text-brand",
  COMENTARIO: "bg-panel text-muted",
};

export function NotificationsBell({
  conteo,
  items,
}: {
  conteo: number;
  items: ItemNotificacion[];
}) {
  // El padre (header server) remonta la campana con key cuando cambian los
  // datos, así el estado local siempre arranca fresco sin efectos de sync.
  const [abierto, setAbierto] = useState(false);
  const [conteoActual, setConteoActual] = useState(conteo);
  const [notificaciones, setNotificaciones] = useState(items);
  const contenedor = useRef<HTMLDivElement>(null);
  const pendientes = notificaciones.filter((n) => !n.leida);

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

  const marcarTodas = async () => {
    const res = await apiPost<ResumenNotificaciones>(
      "/notificaciones/marcar-leidas",
      {},
    );

    // Aunque la API falle, el usuario ve el resultado de su acción en local.
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
    if (res.ok) {
      setConteoActual(res.datos.notificacionesPendientes);
    } else {
      setConteoActual(0);
    }
  };

  return (
    <div className="relative" ref={contenedor}>
      <button
        type="button"
        aria-label={
          conteoActual > 0
            ? `Notificaciones, ${conteoActual} pendientes`
            : "Notificaciones, sin pendientes"
        }
        aria-haspopup="dialog"
        aria-expanded={abierto}
        onClick={() => setAbierto((actual) => !actual)}
        className="relative flex size-9 items-center justify-center rounded-md bg-panel text-muted transition-colors hover:bg-btn"
      >
        <Icon name="bell" className="size-[17px]" />
        {conteoActual > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ba1a1a] px-1 text-[11px] font-semibold leading-[11px] text-white">
            {conteoActual}
          </span>
        )}
      </button>

      {abierto && (
        <div
          role="dialog"
          aria-label={`Notificaciones (${conteoActual})`}
          className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-xl border border-line/60 bg-white shadow-lg"
        >
          <div className="flex items-center justify-between gap-2 border-b border-line/60 px-4 py-3">
            <p className="text-sm font-semibold text-ink">
              Notificaciones ({conteoActual})
            </p>
            <button
              type="button"
              onClick={marcarTodas}
              disabled={pendientes.length === 0}
              className="text-xs font-medium text-brand transition-colors hover:underline disabled:text-muted disabled:no-underline"
            >
              Marcar todas como leídas
            </button>
          </div>

          {notificaciones.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-panel">
                <Icon name="bellOff" className="size-5 text-muted" />
              </span>
              <p className="text-sm text-muted">Sin notificaciones pendientes</p>
            </div>
          ) : (
            <ul className="max-h-80 divide-y divide-line/60 overflow-y-auto">
              {notificaciones.map((n) => (
                <li
                  key={n.id}
                  className={`px-4 py-3 ${n.leida ? "" : "bg-pending-row"}`}
                >
                  <Link
                    href={`/mis-solicitudes/${n.ticketId}`}
                    onClick={() => setAbierto(false)}
                    className="flex gap-3"
                  >
                    <span
                      className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${CLASE_TIPO[n.tipo]}`}
                    >
                      <Icon name={ICONO_TIPO[n.tipo]} className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-semibold text-ink">
                          #{n.ticketId}
                        </span>
                        <span className="shrink-0 text-[11px] text-muted">
                          {n.tiempo}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-xs font-medium text-brand">
                        {n.titulo}
                      </span>
                      <span className="mt-0.5 block text-xs leading-4 text-muted">
                        {n.mensaje}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
