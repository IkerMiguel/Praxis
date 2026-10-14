"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons";

const MAX_FILES = 4;
const LIMITE_BYTES = 10 * 1024 * 1024; // 10 MB
const FORMATOS_PERMITIDOS = ["image/jpeg", "image/png"];

export type Adjunto = {
  id: string;
  name: string;
  sizeBytes: number;
  url: string;
};

function formatMB(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());
}

export function EvidenciaFotografica({
  value,
  onChange,
}: {
  value: Adjunto[];
  onChange: (items: Adjunto[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const totalMB = value.reduce((acc, i) => acc + i.sizeBytes, 0);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const archivos = Array.from(list);

    // Reglas de la DISE: solo JPG/PNG hasta 10MB por archivo.
    const formatoInvalido = archivos.find(
      (f) => !FORMATOS_PERMITIDOS.includes(f.type),
    );
    if (formatoInvalido) {
      setError(`«${formatoInvalido.name}» no es un formato admitido. Usa JPG o PNG.`);
      return;
    }

    const demasiadoGrande = archivos.find((f) => f.size > LIMITE_BYTES);
    if (demasiadoGrande) {
      setError(`«${demasiadoGrande.name}» supera el límite de 10MB por archivo.`);
      return;
    }

    const room = MAX_FILES - value.length;
    const nuevos = archivos.slice(0, room).map((f) => ({
      id: newId(),
      name: f.name,
      sizeBytes: f.size,
      url: URL.createObjectURL(f),
    }));
    if (nuevos.length > 0) {
      setError(null);
      onChange([...value, ...nuevos]);
    }
  };

  const remove = (item: Adjunto) => {
    if (item.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
    onChange(value.filter((i) => i.id !== item.id));
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-semibold leading-[18px] text-[#191c1e]">
          Archivos adjuntos ({value.length} de {MAX_FILES} permitidos)
        </span>
        <span className="text-[12px] leading-4 text-muted">
          Total: {formatMB(totalMB)}
        </span>
      </div>

      {value.length < MAX_FILES ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line bg-panel px-6 py-8 text-center"
        >
          <span className="flex size-14 items-center justify-center rounded-xl bg-white shadow-sm">
            <Icon name="uploadCloud" className="size-7 text-brand" />
          </span>
          <p className="mt-1 text-[13px] font-semibold leading-[18px] text-ink">
            Arrastra y suelta fotografías del daño o haz clic para explorar
          </p>
          <p className="text-[12px] leading-4 text-muted">
            Formatos admitidos: JPG, PNG hasta 10MB por archivo (Máx.{" "}
            {MAX_FILES} fotos)
          </p>
          <span className="mt-2 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm">
            <Icon name="image" className="size-3 text-brand" />
            <span className="text-[11px] font-semibold tracking-[0.44px] text-brand">
              Seleccionar desde este dispositivo
            </span>
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            className="hidden"
            onChange={onChangeInput}
          />
        </div>
      ) : null}

      {value.length > 0 ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {value.map((item) => (
            <div
              key={item.id}
              className="relative flex items-center gap-3 rounded-md bg-panel p-3 shadow-sm"
            >
              <Image
                src={item.url}
                alt={item.name}
                width={64}
                height={64}
                className="size-16 rounded-md object-cover shadow-sm"
              />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold leading-[18px] text-[#191c1e]">
                  {item.name}
                </p>
                <p className="text-[12px] leading-4 text-muted">
                  {formatMB(item.sizeBytes)}
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold leading-[14px] tracking-[0.44px] text-[#047857]">
                  <Icon name="check" className="size-3" />
                  Carga completada
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(item)}
                aria-label={`Eliminar ${item.name}`}
                className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-md bg-white shadow-sm transition-colors hover:bg-line"
              >
                <Icon name="trash" className="size-3 text-[#ba1a1a]" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-md border border-[#ba1a1a]/40 bg-[#fdecea] px-3 py-2 text-[12px] leading-4 text-[#7f1d1d]"
        >
          <Icon name="alertTriangle" className="mt-px size-3 shrink-0 text-[#ba1a1a]" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
