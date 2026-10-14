import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { CompletarInfoProvider } from "@/components/mis-solicitudes/completar-info-modal";
import { apiGet, FALLBACK_CONTADOR, type ContadorReportes } from "@/lib/api";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PRAXIS ECCI · Gestión de Infraestructura",
  description: "Panel de gestión de reportes de infraestructura — Universidad ECCI, Sede Cali.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const contador = await apiGet<ContadorReportes>(
    "/reportes/contador",
    FALLBACK_CONTADOR,
    0,
  );

  return (
    <html lang="es" className={`${inter.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <div className="flex min-h-screen flex-col font-sans text-ink">
          <CompletarInfoProvider>
            <Header />
            <div className="flex flex-1">
              <Sidebar pendientesInformacion={contador.pendienteInformacion} />
              <main className="min-w-0 flex-1 bg-panel">{children}</main>
            </div>
          </CompletarInfoProvider>
        </div>
      </body>
    </html>
  );
}