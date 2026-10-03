import Link from "next/link";
import { Header } from "@/components/header";
import { Sidebar, type SidebarActive } from "@/components/sidebar";

export function PlaceholderPage({
  title,
  message = "Sección en construcción / disponible en próxima entrega",
  active,
}: {
  title: string;
  message?: string;
  active: SidebarActive;
}) {
  return (
    <div className="flex min-h-screen flex-col font-sans text-ink">
      <Header />
      <div className="flex flex-1">
        <Sidebar active={active} />
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h1 className="font-display text-[28px] font-bold leading-9 tracking-[-0.7px]">
              {title}
            </h1>
            <p className="mt-1 text-[16px] leading-[26px] text-muted">
              {message}
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center rounded-md bg-ink px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-ink/90"
            >
              Volver al panel
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}
