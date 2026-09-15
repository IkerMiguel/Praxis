import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { DescripcionDano } from "@/components/nuevo-reporte/descripcion";
import { EvidenciaFotografica } from "@/components/nuevo-reporte/evidencia";

export const metadata: Metadata = {
  title: "Nuevo Reporte de Mantenimiento · PRAXIS ECCI",
};

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
  children: ReactNode;
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
            <span
              className={`rounded-full bg-[#cce5ff] px-2 py-0.5 text-[11px] font-semibold tracking-[0.44px] text-[#001d31]`}
            >
              {tag}
            </span>
          ) : (
            <span
              className={`text-[11px] font-semibold tracking-[0.44px] ${tagClass}`}
            >
              {tag}
            </span>
          )
        ) : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function FieldSelect({
  id,
  label,
  hint,
  hintClass = "text-muted",
  border,
  options,
}: {
  id: string;
  label: string;
  hint?: string;
  hintClass?: string;
  border: string;
  options: string[];
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
          <span
            className={`text-[11px] font-semibold tracking-[0.44px] ${hintClass}`}
          >
            {hint}
          </span>
        ) : null}
      </div>
      <div className="relative mt-2">
        <select
          id={id}
          defaultValue={options[0]}
          style={{ borderColor: border }}
          className="w-full appearance-none rounded-md border bg-white px-3.5 py-2.5 text-[14px] leading-5 text-[#191c1e] shadow-sm outline-none transition-colors focus:border-brand"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <Icon
          name="chevronDown"
          className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-muted"
        />
      </div>
    </div>
  );
}

export default function NuevoReportePage() {
  return (
    <div className="flex min-h-screen flex-col font-sans text-ink">
      <Header campus="Docente / Solicitante | Sede ECCI Cali" />

      <div className="flex flex-1">
        <Sidebar active="nuevo-reporte" />

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <nav
            aria-label="Ruta de navegación"
            className="flex items-center gap-1.5"
          >
            <Link
              href="/"
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

          <form className="mt-6 space-y-5">
            <FormSection
              step="1"
              title="Ubicación Exacta"
              subtitle="Identifica el punto georreferenciado de la falla"
              tag="OBLIGATORIO"
            >
              <div className="grid gap-5 md:grid-cols-3">
                <FieldSelect
                  id="sede"
                  label="Sede / Campus"
                  border="#6b7280"
                  options={[
                    "Universidad ECCI - Campus Cali",
                    "Universidad ECCI - Campus Bogotá",
                  ]}
                />
                <FieldSelect
                  id="bloque"
                  label="Bloque / Edificio"
                  border="#6b7280"
                  options={[
                    "Bloque Principal (Aulas y Labs)",
                    "Bloque A",
                    "Bloque B",
                  ]}
                />
                <FieldSelect
                  id="piso"
                  label="Piso / Nivel"
                  border="#6b7280"
                  options={["Piso 3", "Piso 1", "Piso 2", "Piso 4"]}
                />
              </div>

              <div className="mt-6">
                <label className="text-[13px] font-semibold leading-[18px] text-[#191c1e]">
                  Espacio específico / Referencia visual{" "}
                  <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative mt-2">
                  <Icon
                    name="mapPin"
                    className="pointer-events-none absolute left-3.5 top-1/2 size-3 -translate-y-1/2 text-muted"
                  />
                  <input
                    type="text"
                    defaultValue="Laboratorio de Sistemas 302 - Ala Norte, junto a sala de racks"
                    className="w-full rounded-md border border-[#6b7280] bg-white py-2.5 pl-9 pr-3.5 text-[14px] leading-5 text-[#191c1e] shadow-sm outline-none transition-colors focus:border-brand"
                  />
                </div>
                <p className="mt-3 flex items-start gap-2 text-[12px] leading-4 text-muted">
                  <Icon
                    name="info"
                    className="mt-px size-3 shrink-0 text-brand"
                  />
                  Agrega detalles o referencias clave del lugar (como número de
                  aula, columnas o equipos cercanos) para que el equipo técnico
                  lo localice rápidamente.
                </p>
              </div>
            </FormSection>

            <FormSection
              step="2"
              title="Clasificación y Detalle"
              subtitle="Taxonomía operativa del incidente para despacho ágil"
              tag="PASO CLAVE"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FieldSelect
                  id="categoria"
                  label="Categoría Principal"
                  hint="Área técnica"
                  border="#c5c6cd"
                  options={[
                    "Electricidad / Iluminación",
                    "Hidráulica / Fontanería",
                    "Carpintería / Cerrajería",
                    "Redes y Telecomunicaciones",
                  ]}
                />
                <FieldSelect
                  id="subcategoria"
                  label="Subcategoría"
                  hint="Específica"
                  hintClass="text-brand"
                  border="#c5c6cd"
                  options={[
                    "Luminarias / Paneles de techo",
                    "Tomas y cableado",
                    "Tableros eléctricos",
                  ]}
                />
              </div>

              <div className="mt-6">
                <DescripcionDano />
              </div>
            </FormSection>

            <FormSection
              step="3"
              title="Evidencia Fotográfica"
              subtitle="Archivos de soporte visual para diagnóstico previo de cuadrilla"
              tag="Recomendado"
              badge
            >
              <EvidenciaFotografica />
            </FormSection>

            <footer className="flex flex-wrap items-center gap-4 rounded-lg bg-white px-6 py-4 shadow-sm">
              <button
                type="button"
                className="flex h-10 items-center rounded-md bg-panel px-5 text-[14px] font-medium leading-5 text-muted shadow-sm transition-colors hover:bg-line"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex h-10 items-center gap-2 rounded-md bg-brand px-5 text-[14px] font-medium leading-5 text-white shadow-sm transition-colors hover:bg-[#00517f]"
              >
                Enviar Reporte de Falla
                <Icon name="arrowRight" className="size-3.5" />
              </button>
            </footer>
          </form>
        </main>
      </div>
    </div>
  );
}