import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PRAXIS ECCI · Gestión de Infraestructura",
  description: "Panel de gestión de reportes de infraestructura — Universidad ECCI, Sede Cali.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <div className="flex min-h-screen flex-col font-sans text-ink">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 bg-panel">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}