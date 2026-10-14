"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { useCompletarInfo } from "@/components/mis-solicitudes/completar-info-modal";

export function BotonResponderYSubsanar({ ticketId }: { ticketId: string }) {
  const { abrir: abrirCompletarInfo } = useCompletarInfo();

  return (
    <button
      type="button"
      onClick={() => abrirCompletarInfo(ticketId)}
      className="inline-flex items-center gap-2 rounded-lg bg-pending-action px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d97706]"
    >
      Responder y Subsanar
      <Icon name="arrowRight" className="size-4" />
    </button>
  );
}

export function BotonCopiarCodigo({ codigo }: { codigo: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
    } catch {
      // El portapapeles puede no estar disponible; igualmente confirmamos.
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copiar}
      aria-live="polite"
      className="inline-flex items-center gap-2 rounded-lg bg-btn px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:bg-line"
    >
      <Icon name={copiado ? "check" : "copy"} className="size-3.5" />
      {copiado ? "¡Copiado!" : "Copiar Código Radicado"}
    </button>
  );
}
