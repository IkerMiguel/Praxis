"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";

const MAX = 500;
const INITIAL =
  "Se evidencia sobrecalentamiento y parpadeo constante en dos paneles de luminarias fluorescentes del techo sobre la fila de computadores 3 a 6. Emite zumbido intermitente.";

export function DescripcionDano() {
  const [value, setValue] = useState(INITIAL);

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
        onChange={(e) => setValue(e.target.value.slice(0, MAX))}
        rows={4}
        className="mt-2 w-full resize-none rounded-md border border-[#c5c6cd] bg-white px-4 py-3 text-[14px] leading-5 text-[#191c1e] shadow-sm outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
      />
      <p className="mt-3 flex items-start gap-2 text-[12px] leading-4 text-muted">
        <Icon name="info" className="mt-px size-3 shrink-0 text-brand" />
        Detalla el impacto del daño: indica si genera riesgos de seguridad
        (como chispas o sobrecalentamiento) o si interrumpe el desarrollo de
        clases.
      </p>
    </div>
  );
}