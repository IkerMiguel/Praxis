import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export default function NuevoReportePage() {
  return (
    <div className="flex min-h-screen flex-col font-sans text-ink">
      <Header />
      <div className="flex flex-1">
        <Sidebar active="nuevo-reporte" />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h1 className="font-display text-[28px] font-bold leading-9 tracking-[-0.7px]">
              Nuevo Reporte
            </h1>
            <p className="mt-1 text-[16px] leading-[26px] text-muted">
              Formulario de reporte de mantenimiento en construcción.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}