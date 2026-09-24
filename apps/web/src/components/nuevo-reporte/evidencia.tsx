"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons";

const MAX_FILES = 4;

type Attached = {
  id: string;
  name: string;
  sizeBytes: number;
  url: string;
};

const defaults: Attached[] = [
  {
    id: "d1",
    name: "panel_luces_falla1.jpg",
    sizeBytes: 2.4 * 1024 * 1024,
    url: "/tkt-panel-luces.png",
  },
  {
    id: "d2",
    name: "techo_luminarias_lab302.jpg",
    sizeBytes: 1.8 * 1024 * 1024,
    url: "/tkt-techo-luminarias.png",
  },
];

function formatMB(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());
}

export function EvidenciaFotografica() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Attached[]>(defaults);

  const totalMB = items.reduce((acc, i) => acc + i.sizeBytes, 0);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const files = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setItems((prev) => {
      const room = MAX_FILES - prev.length;
      const next = files.slice(0, room).map((f) => ({
        id: newId(),
        name: f.name,
        sizeBytes: f.size,
        url: URL.createObjectURL(f),
      }));
      return [...prev, ...next];
    });
  };

  const remove = (item: Attached) => {
    if (item.url.startsWith("blob:")) URL.revokeObjectURL(item.url);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-semibold leading-[18px] text-[#191c1e]">
          Archivos adjuntos ({items.length} de {MAX_FILES} permitidos)
        </span>
        <span className="text-[12px] leading-4 text-muted">
          Total: {formatMB(totalMB)}
        </span>
      </div>

      {items.length > 0 ? (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {items.map((item) => (
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

      {items.length < MAX_FILES ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line bg-panel px-6 py-8 text-center ${
            items.length ? "mt-4" : "mt-0"
          }`}
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
            onChange={onChange}
          />
        </div>
      ) : null}
    </div>
  );
}