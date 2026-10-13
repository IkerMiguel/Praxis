"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import {
  apiGet,
  apiPost,
  type CompletarInformacionRespuesta,
  type DetalleReporte,
} from "@/lib/api";

type AbrirCompletarInfo = (ticketId: string) => void;

const CompletarInfoContext = createContext<AbrirCompletarInfo>(() => {});

export function useCompletarInfo() {
  return useContext(CompletarInfoContext);
}

const LIMITE_ARCHIVO = 10 * 1024 * 1024;

export function CompletarInfoProvider({ children }: { children: React.ReactNode }) {
  const [ticketId, setTicketId] = useState<string | null>(null);

  const abrir = useCallback((id: string) => setTicketId(id), []);
  const cerrar = useCallback(() => setTicketId(null), []);

  return (
    <CompletarInfoContext.Provider value={abrir}>
      {children}
      {ticketId && <Modal key={ticketId} ticketId={ticketId} onCerrar={cerrar} />}
    </CompletarInfoContext.Provider>
  );
}

function Modal({
  ticketId,
  onCerrar,
}: {
  ticketId: string;
  onCerrar: () => void;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [detalle, setDetalle] = useState<DetalleReporte | null>(null);
  const [respuesta, setRespuesta] = useState("");
  const [archivos, setArchivos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    apiGet<DetalleReporte | null>(
      `/reportes/solicitudes/${encodeURIComponent(ticketId)}`,
      null,
      0,
    ).then(setDetalle);

    const alPresionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", alPresionarTecla);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alPresionarTecla);
      document.body.style.overflow = "";
    };
  }, [ticketId, onCerrar]);

  const agregarArchivos = (lista: FileList | null) => {
    if (!lista) return;
    const nombres: string[] = [];
    let huboError = false;
    for (const archivo of Array.from(lista)) {
      if (archivo.size > LIMITE_ARCHIVO) {
        huboError = true;
        continue;
      }
      nombres.push(archivo.name);
    }
    if (huboError) {
      setError("Algunos archivos superan el límite de 10 MB y no se agregaron.");
    } else {
      setError(null);
    }
    setArchivos((prev) => [...prev, ...nombres]);
  };

  const enviar = async () => {
    if (respuesta.trim().length < 5) {
      setError("La aclaración o respuesta es obligatoria (mínimo 5 caracteres).");
      return;
    }

    setEnviando(true);
    setError(null);

    const res = await apiPost<CompletarInformacionRespuesta>(
      `/reportes/solicitudes/${encodeURIComponent(ticketId)}/completar`,
      { respuestaTexto: respuesta.trim(), fotosAdicionales: archivos },
    );

    setEnviando(false);

    if (!res.ok) {
      setError("No se pudo enviar la información. Intenta de nuevo.");
      return;
    }

    onCerrar();
    router.refresh();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Completar Información Requerida"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={onCerrar}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-line/60 px-5 py-4">
          <h2 className="font-display text-base font-semibold text-ink">
            Completar Información Requerida
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-panel"
          >
            <Icon name="x" className="size-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="rounded-lg bg-pending-row p-3.5">
            <p className="text-xs font-semibold text-pending-ink">
              Requerimiento del técnico:
            </p>
            <p className="mt-1.5 text-sm text-ink">
              {detalle?.requerimientoTecnico ??
                "Por favor indicar si el zumbido produce olor a quemado o si afecta todo el circuito del laboratorio."}
            </p>
          </div>

          <div>
            <label
              htmlFor="respuesta-info"
              className="text-sm font-semibold text-ink"
            >
              Aclaración o Respuesta <span className="text-[#ba1a1a]">*</span>
            </label>
            <textarea
              id="respuesta-info"
              rows={4}
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Ingresa los detalles solicitados..."
              className="mt-2 w-full resize-none rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-colors focus:border-brand"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">
              Adjuntar Fotos adicionales (Opcional)
            </p>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="mt-2 flex w-full flex-col items-center gap-1 rounded-lg border border-dashed border-line bg-panel px-4 py-5 text-center transition-colors hover:border-brand"
            >
              <Icon name="uploadCloud" className="size-6 text-muted" />
              <span className="text-sm text-ink">
                Arrastra o haz clic para subir archivo (JPG, PNG)
              </span>
              <span className="text-xs text-muted">Hasta 10 MB</span>
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={(e) => agregarArchivos(e.target.files)}
            />
            {archivos.length > 0 && (
              <ul className="mt-2 space-y-1">
                {archivos.map((nombre) => (
                  <li
                    key={nombre}
                    className="flex items-center justify-between rounded-md bg-panel px-3 py-1.5 text-xs text-ink"
                  >
                    <span className="inline-flex min-w-0 items-center gap-1.5">
                      <Icon name="image" className="size-3.5 shrink-0 text-muted" />
                      <span className="truncate">{nombre}</span>
                    </span>
                    <button
                      type="button"
                      aria-label={`Quitar ${nombre}`}
                      onClick={() =>
                        setArchivos((prev) => prev.filter((n) => n !== nombre))
                      }
                      className="shrink-0 text-muted transition-colors hover:text-ink"
                    >
                      <Icon name="x" className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && (
            <p className="text-sm text-[#ba1a1a]" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-line/60 bg-panel px-5 py-4">
          <button
            type="button"
            onClick={onCerrar}
            className="flex h-10 items-center rounded-md bg-white px-4 text-sm font-medium text-ink shadow-sm transition-colors hover:bg-line"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={enviar}
            disabled={enviando}
            className="flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#00517f] disabled:opacity-60"
          >
            {enviando ? "Enviando..." : "Enviar Información"}
            <Icon name="arrowRight" className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
