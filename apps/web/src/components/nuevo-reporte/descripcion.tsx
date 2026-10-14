"use client";

import { Icon } from "@/components/icons";

const MAX = 500;

export function DescripcionDano({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-[13px] font-semibold leading-[18px] text-[#191c1e]">
          Descripción detallada del daño{" "}
          <span className="text-[#ba1a1a]">*</span>
        </label>
        <span className="text-[11px] font-semibold tracking-[0.44px] text-muted">
          {value.length} / {MAX} caracteres
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX))}
        rows={4}
        placeholder="Describe con detalle la falla: qué ocurre, desde cuándo, si hay riesgo de seguridad o interrupción de clases…"
        style={error ? { borderColor: "#ba1a1a" } : undefined}
        className="mt-2 w-full resize-none rounded-md border border-[#c5c6cd] bg-white px-4 py-3 text-[14px] leading-5 text-[#191c1e] shadow-sm outline-none transition-colors placeholder:text-muted focus:border-brand focus:ring-1 focus:ring-brand"
      />
      {error ? (
        <p className="mt-1.5 text-[12px] leading-4 text-[#ba1a1a]">{error}</p>
      ) : (
        <p className="mt-3 flex items-start gap-2 text-[12px] leading-4 text-muted">
          <Icon name="info" className="mt-px size-3 shrink-0 text-brand" />
          Detalla el impacto del daño: indica si genera riesgos de seguridad
          (como chispas o sobrecalentamiento) o si interrumpe el desarrollo de
          clases.
        </p>
      )}
    </div>
  );
}
