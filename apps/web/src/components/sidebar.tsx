"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";

const linkBase =
  "flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors";
const linkIdle = `${linkBase} text-muted hover:bg-panel text-[14px] leading-5`;
const linkActive = `${linkBase} bg-ink text-[13px] font-semibold leading-[18px] text-white shadow-sm`;

const items = [
  { href: "/panel", label: "Inicio / Panel", icon: "home" as const },
  { href: "/reportes/nuevo", label: "+ Nuevo Reporte", icon: "plus" as const },
  {
    href: "/mis-solicitudes",
    label: "Mis Solicitudes",
    icon: "inbox" as const,
    badge: 3,
  },
  {
    href: "/ayuda",
    label: "Ayuda / Preguntas Frecuentes",
    icon: "help" as const,
    support: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const principal = items.filter((i) => !i.support);
  const soporte = items.filter((i) => i.support);

  const badgeTone =
    pathname === "/reportes/nuevo" || pathname === "/mis-solicitudes"
      ? "bg-btn text-muted"
      : "bg-brand text-white";

  function NavLink({
    href,
    label,
    icon,
    badge,
  }: {
    href: string;
    label: string;
    icon: "home" | "plus" | "inbox" | "help";
    badge?: number;
  }) {
    const active = pathname === href;
    return (
      <Link href={href} className={active ? linkActive : linkIdle}>
        <Icon
          name={icon}
          className={`size-4 ${
            active ? "" : icon === "plus" ? "text-brand" : "text-muted"
          }`}
        />
        {label}
        {badge != null && (
          <span
            className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[12px] font-bold leading-4 ${badgeTone}`}
          >
            {badge}
          </span>
        )}
      </Link>
    );
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-line/60 bg-white px-3 pb-3 pt-4 lg:flex">
      <div>
        <p className="px-3 text-[11px] font-semibold tracking-[0.55px] text-muted">
          PRINCIPAL
        </p>
        <nav className="mt-3 space-y-1">
          {principal.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <p className="mt-6 px-3 text-[11px] font-semibold tracking-[0.55px] text-muted">
          SOPORTE
        </p>
        <nav className="mt-3 space-y-1">
          {soporte.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
      </div>

      <div className="rounded-md bg-panel p-3">
        <p className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.44px] text-muted">
          PRAXIS ECCI v1.0 —{" "}
          {pathname === "/reportes/nuevo" ? "Campus Cali" : "MVP"}
        </p>
        <p className="mt-1 text-[12px] leading-4 text-muted">
          Mesa de Ayuda Operacional
        </p>
      </div>
    </aside>
  );
}