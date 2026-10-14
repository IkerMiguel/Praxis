import type { Metadata } from "next";
import { NuevoReporteForm } from "@/components/nuevo-reporte/form";

export const metadata: Metadata = {
  title: "Nuevo Reporte de Mantenimiento · PRAXIS ECCI",
};

export default function NuevoReportePage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <NuevoReporteForm />
    </div>
  );
}
