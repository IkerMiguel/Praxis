"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { API_URL } from "@/lib/api";
import { FAQS_AYUDA, type FaqItem } from "@/app/ayuda/faqs";

type EstadoFaq = "carga" | "ok" | "vacio" | "error";

async function cargarFaq(): Promise<{ estado: EstadoFaq; items: FaqItem[] }> {
  try {
    const res = await fetch(`${API_URL}/ayuda/faqs`, {
      headers: { Accept: "application/json" },
    });
    if (res.status === 404) return { estado: "ok", items: FAQS_AYUDA };
    if (!res.ok) return { estado: "error", items: [] };

    const data: unknown = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return { estado: "vacio", items: [] };
    }
    return { estado: "ok", items: data as FaqItem[] };
  } catch {
    return { estado: "ok", items: FAQS_AYUDA };
  }
}

export function AyudaFaq() {
  const [estado, setEstado] = useState<EstadoFaq>("carga");
  const [items, setItems] = useState<FaqItem[]>([]);
  const [abiertos, setAbiertos] = useState<string[]>([]);

  const aplicarResultado = useCallback(
    (resultado: { estado: EstadoFaq; items: FaqItem[] }) => {
      setItems(resultado.items);
      setAbiertos(resultado.items.map((item) => item.id));
      setEstado(resultado.estado);
    },
    [],
  );

  useEffect(() => {
    let activo = true;
    cargarFaq().then((resultado) => {
      if (activo) aplicarResultado(resultado);
    });
    return () => {
      activo = false;
    };
  }, [aplicarResultado]);

  const reintentar = () => {
    setEstado("carga");
    cargarFaq().then(aplicarResultado);
  };

  const alternar = (id: string) =>
    setAbiertos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  if (estado === "carga") {
    return (
      <div className="space-y-3" aria-busy="true" aria-live="polite">
        <p className="text-sm text-muted">Cargando preguntas frecuentes…</p>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl border border-line/60 bg-white"
          />
        ))}
      </div>
    );
  }

  if (estado === "error") {
    return (
      <div className="rounded-xl border border-line/60 bg-white p-6 text-center">
        <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-panel">
          <Icon name="info" className="size-5 text-muted" />
        </span>
        <p className="mt-3 text-sm font-medium text-ink">
          No pudimos cargar las preguntas frecuentes.
        </p>
        <p className="mt-1 text-sm text-muted">
          Ocurrió un error al consultar la guía. Vuelve a intentarlo en unos
          minutos.
        </p>
        <button
          type="button"
          onClick={reintentar}
          className="mt-4 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (estado === "vacio" || items.length === 0) {
    return (
      <div className="rounded-xl border border-line/60 bg-white p-6 text-center">
        <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-panel">
          <Icon name="help" className="size-5 text-muted" />
        </span>
        <p className="mt-3 text-sm font-medium text-ink">
          Aún no hay preguntas frecuentes publicadas.
        </p>
        <p className="mt-1 text-sm text-muted">
          La Mesa de Ayuda está preparando nuevas guías. Mientras tanto, sigue
          la Guía Rápida de Reporte en 3 Pasos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((faq) => {
        const abierto = abiertos.includes(faq.id);
        return (
          <article
            key={faq.id}
            className="overflow-hidden rounded-xl border border-line/60 bg-white shadow-sm"
          >
            <h3>
              <button
                type="button"
                aria-expanded={abierto}
                aria-controls={`faq-${faq.id}`}
                onClick={() => alternar(faq.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="flex items-center gap-3">
                  <Icon
                    name="help"
                    className="size-5 shrink-0 text-brand"
                    aria-hidden="true"
                  />
                  <span className="text-base font-semibold text-ink">
                    {faq.pregunta}
                  </span>
                </span>
                <Icon
                  name={abierto ? "chevronUp" : "chevronDown"}
                  className="size-5 shrink-0 text-muted"
                />
              </button>
            </h3>
            {abierto && (
              <div id={`faq-${faq.id}`} className="px-5 pb-5">
                <div className="flex items-start gap-3 rounded-lg bg-panel p-4">
                  <Icon
                    name={faq.icono}
                    className="mt-0.5 size-5 shrink-0 text-brand"
                  />
                  <div className="text-sm leading-6 text-muted">
                    <p>{faq.respuesta}</p>
                    {faq.nota ? (
                      <p
                        className={`mt-2 text-[13px] leading-5 ${
                          faq.notaTone === "ink"
                            ? "font-semibold text-ink"
                            : "font-medium text-brand"
                        }`}
                      >
                        {faq.nota}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
