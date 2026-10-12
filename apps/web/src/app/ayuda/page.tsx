import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { AyudaFaq } from "@/app/ayuda/faq";

const GUIA_PDF = "/guias/praxis-guia-usuario.pdf";

const pasos: {
  n: number;
  icono: IconName;
  titulo: string;
  texto: string;
  nota: string;
  notaIcono: IconName;
}[] = [
  {
    n: 1,
    icono: "mapPin",
    titulo: "1. Ubica el daño",
    texto: "Identifica con exactitud el bloque, piso y número de aula o espacio común en las instalaciones del Campus Cali.",
    nota: "Ejemplo: Bloque Principal, Piso 3, Lab 302",
    notaIcono: "mapPin",
  },
  {
    n: 2,
    icono: "camera",
    titulo: "2. Describe y fotografía",
    texto: "Sé específico con la novedad locativa y adjunta imágenes con buena iluminación que muestren la dimensión del daño.",
    nota: "Acelera el diagnóstico técnico hasta un 40%",
    notaIcono: "zap",
  },
  {
    n: 3,
    icono: "checkCircle",
    titulo: "3. Monitorea tu ticket",
    texto: "Recibe actualizaciones de estado en tiempo real y subsana información adicional si la coordinación técnica lo requiere.",
    nota: "Trazabilidad completa desde Mis Solicitudes",
    notaIcono: "barChart",
  },
];

export default function AyudaPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      <nav
        aria-label="Ruta de navegación"
        className="flex items-center gap-2 text-sm"
      >
        <Link
          href="/panel"
          className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-brand"
        >
          <Icon name="home" className="size-4" />
          Inicio
        </Link>
        <Icon name="chevronRight" className="size-4 text-muted" />
        <span className="font-medium text-brand">
          Ayuda y Preguntas Frecuentes
        </span>
      </nav>

      <section className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
            Centro de Ayuda: Aprende a reportar una falla en el campus
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
            Guía rápida para radicar novedades de infraestructura y resolver
            dudas frecuentes en la Sede Cali.
          </p>
        </div>
        <a
          href={GUIA_PDF}
          download
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-line/60 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-panel"
        >
          <Icon name="download" className="size-4 text-brand" />
          Descargar Guía de Usuario (PDF)
        </a>
      </section>

      <section aria-labelledby="guia-rapida">
        <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.55px] text-brand">
          Flujo de radicación
        </span>
        <h2
          id="guia-rapida"
          className="mt-3 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl"
        >
          Guía Rápida de Reporte en 3 Pasos
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {pasos.map((paso) => (
            <article
              key={paso.n}
              className="flex flex-col overflow-hidden rounded-xl border border-line/60 bg-white shadow-sm"
            >
              <span className="h-1 bg-brand" aria-hidden="true" />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-sky-50">
                    <Icon name={paso.icono} className="size-5 text-brand" />
                  </span>
                  <span className="rounded-full bg-btn px-2.5 py-1 text-[11px] font-semibold tracking-[0.44px] text-muted">
                    PASO {paso.n}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-ink">
                  {paso.titulo}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                  {paso.texto}
                </p>

                <div className="mt-4 flex items-start gap-2 rounded-lg bg-panel p-3">
                  <Icon
                    name={paso.notaIcono}
                    className="mt-0.5 size-4 shrink-0 text-brand"
                  />
                  <p className="text-xs leading-5 text-muted">{paso.nota}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="preguntas-frecuentes">
        <h2
          id="preguntas-frecuentes"
          className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl"
        >
          Preguntas Frecuentes Institucionales
        </h2>
        <p className="mt-1 text-sm text-muted">
          Respuestas estructuradas sobre el ciclo de vida de los reportes y
          gestión física.
        </p>
        <div className="mt-4">
          <AyudaFaq />
        </div>
      </section>
    </div>
  );
}
