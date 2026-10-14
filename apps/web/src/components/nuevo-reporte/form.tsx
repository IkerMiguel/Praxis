"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { DescripcionDano } from "@/components/nuevo-reporte/descripcion";
import { EvidenciaFotografica, type Adjunto } from "@/components/nuevo-reporte/evidencia";
import { ConfirmacionRegistro } from "@/components/nuevo-reporte/confirmacion";
import {
  apiGet,
  apiPost,
  FALLBACK_CATEGORIAS,
  subcategoriasDe,
  type CategoriaSitio,
  type ConfirmacionReporte,
  type Subcategoria,
} from "@/lib/api";

const SEDES = [
  "Universidad ECCI - Campus Cali",
  "Universidad ECCI - Campus Bogotá",
];
const BLOQUES = [
  "Bloque Principal (Aulas y Labs)",
  "Bloque A",
  "Bloque B",
];
const PISOS = ["Piso 1", "Piso 2", "Piso 3", "Piso 4"];

type ErroresCampo = Partial<
  Record<"sede" | "bloque" | "piso" | "espacioEspecifico" | "categoriaSitioId" | "clasificacion" | "descripcion", string>
>;

const ESTADO_INICIAL: {
  sede: string; bloque: string; piso: string; espacioEspecifico: string;
  categoriaSitioId: string; clasificacion: string; descripcion: string;
  fotos: Adjunto[];
} = {
  sede: "", bloque: "", piso: "", espacioEspecifico: "",
  categoriaSitioId: "", clasificacion: "", descripcion: "", fotos: [],
};

export function NuevoReporteForm() {
  const router = useRouter();

  const [form, setForm] = useState(ESTADO_INICIAL);
  const [categorias, setCategorias] = useState<CategoriaSitio[]>([]);
  const [subsCargadas, setSubsCargadas] = useState<Subcategoria[]>([]);
  const [errores, setErrores] = useState<ErroresCampo>({});
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [confirmacion, setConfirmacion] = useState<ConfirmacionReporte | null>(null);

  const set = <K extends keyof typeof ESTADO_INICIAL>(campo: K, valor: (typeof ESTADO_INICIAL)[K]) => {
    setForm((f) => ({ ...f, [campo]: valor }));
  };

  // Carga inicial del catálogo de categorías.
  useEffect(() => {
    let vivo = true;
    apiGet<CategoriaSitio[]>("/catalogos/categorias", FALLBACK_CATEGORIAS, 0).then((cats) => {
      if (vivo) setCategorias(cats);
    });
    return () => { vivo = false; };
  }, []);

  // Subcategorías reactivas: se cargan según la categoría elegida y la
  // selección se limpia en el mismo handler del cambio (no en un effect).
  useEffect(() => {
    if (!form.categoriaSitioId) return;
    let vivo = true;
    apiGet<Subcategoria[]>(
      `/catalogos/subcategorias?categoriaId=${form.categoriaSitioId}`,
      subcategoriasDe(form.categoriaSitioId),
      0,
    ).then((subs) => {
      if (vivo) setSubsCargadas(subs);
    });
    return () => { vivo = false; };
  }, [form.categoriaSitioId]);

  // Nunca se muestran subcategorías de otra categoría (evita el parpadeo
  // de la lista anterior mientras carga la nueva).
  const subcategorias = subsCargadas.filter(
    (s) => s.categoriaId === form.categoriaSitioId,
  );

  const cancelar = () => {
    if (window.history.length > 1) router.back();
    else router.push("/panel");
  };

  const reiniciar = () => {
    setForm(ESTADO_INICIAL);
    setErrores({});
    setErrorEnvio(null);
    setConfirmacion(null);
  };

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setErrorEnvio(null);

    const errs: ErroresCampo = {};
    if (!form.sede) errs.sede = "Selecciona la sede / campus.";
    if (!form.bloque) errs.bloque = "Selecciona el bloque / edificio.";
    if (!form.piso) errs.piso = "Selecciona el piso / nivel.";
    if (form.espacioEspecifico.trim().length < 5) {
      errs.espacioEspecifico = "Describe el espacio específico (mín. 5 caracteres).";
    }
    if (!form.categoriaSitioId) errs.categoriaSitioId = "Selecciona una categoría principal.";
    if (!form.clasificacion) errs.clasificacion = "Selecciona una subcategoría.";
    if (form.descripcion.trim().length < 15) {
      errs.descripcion = "La descripción debe tener al menos 15 caracteres.";
    }

    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    setEnviando(true);
    const res = await apiPost<ConfirmacionReporte>("/reportes/crear", {
      sede: form.sede,
      bloque: form.bloque,
      piso: form.piso,
      espacioEspecifico: form.espacioEspecifico.trim(),
      categoriaSitioId: form.categoriaSitioId,
      clasificacion: form.clasificacion,
      descripcion: form.descripcion.trim(),
      referenciasEvidencia: form.fotos.map((f) => f.name),
    });
    setEnviando(false);

    if (res.ok) {
      setConfirmacion(res.datos);
      window.scrollTo({ top: 0 });
    } else {
      setErrorEnvio("No se pudo registrar el reporte. Verifica los datos e intenta de nuevo.");
    }
  };

  if (confirmacion) {
    return <ConfirmacionRegistro conf={confirmacion} onCrearOtro={reiniciar} />;
  }

  const categoriaSeleccionada = categorias.find((c) => c.id === form.categoriaSitioId);

  return (
    <div>
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
          NUEVO REPORTE DE MANTENIMIENTO
        </span>
      </nav>

      <div className="mt-4">
        <h1 className="font-display text-[28px] font-bold leading-9 tracking-[-0.7px]">
          Nuevo Reporte de Mantenimiento
        </h1>
        <p className="mt-1 max-w-[708px] text-[14px] leading-5 text-muted">
          Diligencia los datos de la novedad locativa para que la
          Coordinación de Mantenimiento valide y gestione su atención
          técnica.
        </p>
      </div>

      {errorEnvio ? (
        <div className="mt-5 flex items-start gap-3 rounded-lg border border-[#ba1a1a]/40 bg-[#fdecea] px-4 py-3">
          <Icon name="alertTriangle" className="mt-0.5 size-4 shrink-0 text-[#ba1a1a]" />
          <p className="text-[13px] leading-5 text-[#7f1d1d]">{errorEnvio}</p>
        </div>
      ) : null}

      <form onSubmit={enviar} className="mt-6 space-y-5">
        <FormSection
          step="1"
          title="Ubicación Exacta"
          subtitle="Identifica el punto georreferenciado de la falla"
          tag="OBLIGATORIO"
        >
          <div className="grid gap-5 md:grid-cols-3">
            <SelectCampo
              id="sede"
              label="Sede / Campus"
              valor={form.sede}
              onChange={(v) => set("sede", v)}
              error={errores.sede}
              opciones={SEDES.map((s) => ({ valor: s, etiqueta: s }))}
            />
            <SelectCampo
              id="bloque"
              label="Bloque / Edificio"
              valor={form.bloque}
              onChange={(v) => set("bloque", v)}
              error={errores.bloque}
              opciones={BLOQUES.map((b) => ({ valor: b, etiqueta: b }))}
            />
            <SelectCampo
              id="piso"
              label="Piso / Nivel"
              valor={form.piso}
              onChange={(v) => set("piso", v)}
              error={errores.piso}
              opciones={PISOS.map((p) => ({ valor: p, etiqueta: p }))}
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="espacio"
              className="text-[13px] font-semibold leading-[18px] text-[#191c1e]"
            >
              Espacio específico / Referencia visual{" "}
              <span className="text-[#ba1a1a]">*</span>
            </label>
            <div className="relative mt-2">
              <Icon
                name="mapPin"
                className="pointer-events-none absolute left-3.5 top-1/2 size-3 -translate-y-1/2 text-muted"
              />
              <input
                id="espacio"
                type="text"
                value={form.espacioEspecifico}
                onChange={(e) => set("espacioEspecifico", e.target.value)}
                placeholder="Ej: Lab. Sistemas 302 - Ala Norte, junto a sala de racks"
                style={errores.espacioEspecifico ? { borderColor: "#ba1a1a" } : undefined}
                className="w-full rounded-md border border-[#6b7280] bg-white py-2.5 pl-9 pr-3.5 text-[14px] leading-5 text-[#191c1e] shadow-sm outline-none transition-colors placeholder:text-muted focus:border-brand"
              />
            </div>
            {errores.espacioEspecifico ? (
              <p className="mt-1.5 text-[12px] leading-4 text-[#ba1a1a]">
                {errores.espacioEspecifico}
              </p>
            ) : (
              <p className="mt-3 flex items-start gap-2 text-[12px] leading-4 text-muted">
                <Icon name="info" className="mt-px size-3 shrink-0 text-brand" />
                Agrega detalles o referencias clave del lugar (como número de
                aula, columnas o equipos cercanos) para que el equipo técnico
                lo localice rápidamente.
              </p>
            )}
          </div>
        </FormSection>

        <FormSection
          step="2"
          title="Clasificación y Detalle"
          subtitle="Taxonomía operativa del incidente para despacho ágil"
          tag="PASO CLAVE"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <SelectCampo
              id="categoria"
              label="Categoría Principal"
              hint="Área técnica"
              valor={form.categoriaSitioId}
              onChange={(v) => {
                // Cambiar la categoría invalida la subcategoría elegida.
                setForm((f) => ({ ...f, categoriaSitioId: v, clasificacion: "" }));
              }}
              error={errores.categoriaSitioId}
              opciones={categorias.map((c) => ({ valor: c.id, etiqueta: c.etiqueta }))}
            />
            <SelectCampo
              id="subcategoria"
              label="Subcategoría"
              hint={categoriaSeleccionada ? "Según la categoría elegida" : "Elige primero la categoría"}
              hintClass={categoriaSeleccionada ? "text-brand" : "text-muted"}
              valor={form.clasificacion}
              onChange={(v) => set("clasificacion", v)}
              error={errores.clasificacion}
              deshabilitado={!form.categoriaSitioId}
              opciones={subcategorias.map((s) => ({ valor: s.id, etiqueta: s.etiqueta }))}
            />
          </div>

          <div className="mt-6">
            <DescripcionDano
              value={form.descripcion}
              onChange={(v) => set("descripcion", v)}
              error={errores.descripcion}
            />
          </div>
        </FormSection>

        <FormSection
          step="3"
          title="Evidencia Fotográfica"
          subtitle="Archivos de soporte visual para diagnóstico previo de cuadrilla"
          tag="Recomendado"
          badge
        >
          <EvidenciaFotografica
            value={form.fotos}
            onChange={(items) => set("fotos", items)}
          />
        </FormSection>

        <footer className="flex flex-wrap items-center gap-4 rounded-lg bg-white px-6 py-4 shadow-sm">
          <button
            type="button"
            onClick={cancelar}
            className="flex h-10 items-center rounded-md bg-panel px-5 text-[14px] font-medium leading-5 text-muted shadow-sm transition-colors hover:bg-line"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={enviando}
            className="flex h-10 items-center gap-2 rounded-md bg-brand px-5 text-[14px] font-medium leading-5 text-white shadow-sm transition-colors hover:bg-[#00517f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? "Enviando…" : "Enviar Reporte de Falla"}
            <Icon name="arrowRight" className="size-3.5" />
          </button>
        </footer>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------
// Helpers de layout del formulario
// ---------------------------------------------------------------

function FormSection({
  step,
  title,
  subtitle,
  tag,
  tagClass = "text-muted",
  badge = false,
  children,
}: {
  step: string;
  title: string;
  subtitle: string;
  tag?: string;
  tagClass?: string;
  badge?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-ink text-[13px] font-semibold leading-[18px] text-white">
            {step}
          </span>
          <div>
            <h2 className="font-display text-[16px] font-semibold leading-5 tracking-[-0.08px]">
              {title}
            </h2>
            <p className="text-[12px] leading-4 text-muted">{subtitle}</p>
          </div>
        </div>
        {tag ? (
          badge ? (
            <span className="rounded-full bg-[#cce5ff] px-2 py-0.5 text-[11px] font-semibold tracking-[0.44px] text-[#001d31]">
              {tag}
            </span>
          ) : (
            <span className={`text-[11px] font-semibold tracking-[0.44px] ${tagClass}`}>
              {tag}
            </span>
          )
        ) : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function SelectCampo({
  id,
  label,
  hint,
  hintClass = "text-muted",
  valor,
  onChange,
  error,
  opciones,
  deshabilitado = false,
}: {
  id: string;
  label: string;
  hint?: string;
  hintClass?: string;
  valor: string;
  onChange: (valor: string) => void;
  error?: string;
  opciones: { valor: string; etiqueta: string }[];
  deshabilitado?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={id}
          className="text-[13px] font-semibold leading-[18px] text-[#191c1e]"
        >
          {label} <span className="text-[#ba1a1a]">*</span>
        </label>
        {hint ? (
          <span className={`text-[11px] font-semibold tracking-[0.44px] ${hintClass}`}>
            {hint}
          </span>
        ) : null}
      </div>
      <div className="relative mt-2">
        <select
          id={id}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          disabled={deshabilitado}
          style={{ borderColor: error ? "#ba1a1a" : undefined }}
          className="w-full appearance-none rounded-md border border-[#c5c6cd] bg-white px-3.5 py-2.5 text-[14px] leading-5 text-[#191c1e] shadow-sm outline-none transition-colors focus:border-brand disabled:cursor-not-allowed disabled:bg-panel disabled:text-muted"
        >
          <option value="">Selecciona…</option>
          {opciones.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.etiqueta}
            </option>
          ))}
        </select>
        <Icon
          name="chevronDown"
          className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-muted"
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-[12px] leading-4 text-[#ba1a1a]">{error}</p>
      ) : null}
    </div>
  );
}
