"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import type { ConfirmacionReporte } from "@/lib/api";

// Pantalla de confirmación (KAN-84, diseño 4:1016).
export function ConfirmacionRegistro({
  conf,
  onCrearOtro,
}: {
  conf: ConfirmacionReporte;
  onCrearOtro: () => void;
}) {
  const [copiado, setCopiado] = useState(false);

  const fecha = new Date(conf.fechaRegistro);
  const fechaTexto = fecha.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const horaTexto = fecha.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(conf.id);
    } catch {
      // Portapapeles no disponible; mostramos igual la confirmación.
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-[820px]">
      <nav aria-label="Ruta de navegación" className="flex items-center gap-1.5">
        <Link
          href="/panel"
          className="flex items-center gap-1.5 text-[12px] leading-4 text-muted transition-colors hover:text-ink"
        >
          <Icon name="home" className="size-3" />
          Inicio
        </Link>
        <Icon name="chevronRight" className="size-2.5 text-[#c5c6cd]" />
        <span className="text-[11px] font-semibold tracking-[0.55px] text-[#191c1e]">
          CONFIRMACIÓN DE TICKET
        </span>
      </nav>

      <section className="mt-4 overflow-hidden rounded-xl border border-line/60 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-3 border-b border-line/60 bg-panel px-6 py-8 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-emerald-50">
            <Icon name="checkCircle" className="size-8 text-emerald-600" />
          </span>
          <span className="rounded-full bg-[#cce5ff] px-2.5 py-1 text-[11px] font-semibold tracking-[0.44px] text-[#001d31]">
            CONFIRMACIÓN OFICIAL
          </span>
          <h1 className="font-display text-[24px] font-bold leading-8 tracking-[-0.6px]">
            ¡Reporte Registrado con Éxito!
          </h1>
          <p className="max-w-[560px] text-[14px] leading-5 text-muted">
            Tu solicitud ha sido ingresada en el sistema PRAXIS ECCI y
            debidamente notificada a la Coordinación de Mantenimiento e
            Infraestructura.
          </p>
        </div>

        <div className="grid gap-4 px-6 py-6 sm:grid-cols-2">
          <div className="rounded-lg border border-line/60 bg-panel p-4 sm:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.44px] text-muted">
              Identificador único
            </p>
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-[20px] font-bold tracking-[-0.5px] text-brand">
                #{conf.id}
              </p>
              <button
                type="button"
                onClick={copiar}
                aria-live="polite"
                className="inline-flex items-center gap-2 rounded-lg bg-btn px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:bg-line"
              >
                <Icon name={copiado ? "check" : "copy"} className="size-3.5" />
                {copiado ? "¡Copiado!" : "Copiar Código"}
              </button>
            </div>
          </div>

          <DatoConfirmacion label="Fecha de registro" valor={fechaTexto} sub={horaTexto} />
          <DatoConfirmacion label="Estado inicial" valor={conf.estadoInicial} />
          <DatoConfirmacion
            label="Ubicación registrada"
            valor={conf.ubicacion.campus}
            sub={`${conf.ubicacion.bloque} • ${conf.ubicacion.piso} • ${conf.ubicacion.espacio}`}
          />
          <DatoConfirmacion label="Categoría" valor={conf.categoria} />
        </div>

        <div className="px-6 pb-2">
          <p className="flex items-start gap-2 rounded-lg bg-panel px-4 py-3 text-[12px] leading-4 text-muted">
            <Icon name="info" className="mt-px size-3 shrink-0 text-brand" />
            Recibirás notificaciones en tu correo institucional cuando la
            Coordinación de Mantenimiento valide y priorice tu solicitud.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-6 py-5">
          <Link
            href={`/mis-solicitudes/${conf.id}`}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-5 text-[14px] font-medium leading-5 text-white shadow-sm transition-colors hover:bg-[#00517f]"
          >
            Ver Detalle de este Ticket
            <Icon name="arrowRight" className="size-3.5" />
          </Link>
          <button
            type="button"
            onClick={onCrearOtro}
            className="inline-flex h-10 items-center rounded-md bg-btn px-5 text-[14px] font-medium leading-5 text-ink shadow-sm transition-colors hover:bg-line"
          >
            Crear Nuevo Reporte
          </button>
          <Link
            href="/mis-solicitudes"
            className="inline-flex h-10 items-center rounded-md px-3 text-[14px] font-medium leading-5 text-brand transition-colors hover:underline"
          >
            Ir a Mis Solicitudes
          </Link>
        </div>
      </section>
    </div>
  );
}

function DatoConfirmacion({
  label,
  valor,
  sub,
}: {
  label: string;
  valor: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-line/60 bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.44px] text-muted">
        {label}
      </p>
      <p className="mt-1.5 text-[14px] font-semibold leading-5 text-ink">{valor}</p>
      {sub ? <p className="mt-1 text-[13px] leading-4 text-muted">{sub}</p> : null}
    </div>
  );
}
