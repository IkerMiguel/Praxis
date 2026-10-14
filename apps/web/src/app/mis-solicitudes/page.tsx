import type { Metadata } from "next";
import { ExploradorSolicitudes } from "@/components/mis-solicitudes/explorador";

export const metadata: Metadata = {
  title: "Mis Solicitudes · PRAXIS ECCI",
};

export default function MisSolicitudesPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <ExploradorSolicitudes />
    </div>
  );
}
