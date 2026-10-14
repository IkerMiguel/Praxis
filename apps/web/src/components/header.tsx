import Image from "next/image";
import { Icon } from "@/components/icons";
import { NotificationsBell } from "@/components/notifications-bell";
import {
  apiGet,
  FALLBACK_PERFIL,
  type PerfilUsuario,
  type ResumenNotificaciones,
} from "@/lib/api";
import {
  CONTEO_MOCK_NOTIFICACIONES,
  FALLBACK_NOTIFICACIONES,
  type ItemNotificacion,
} from "@/lib/notificaciones";

type ListadoNotificaciones = {
  items: ItemNotificacion[];
};

export async function Header() {
  const [perfil, resumen, listado] = await Promise.all([
    apiGet<PerfilUsuario>("/user/me", FALLBACK_PERFIL),
    apiGet<ResumenNotificaciones>(
      "/notificaciones/resumen",
      { notificacionesPendientes: CONTEO_MOCK_NOTIFICACIONES },
      0,
    ),
    apiGet<ListadoNotificaciones>(
      "/notificaciones/listado",
      { items: FALLBACK_NOTIFICACIONES },
      0,
    ),
  ]);
  const conteoNotificaciones =
    typeof resumen.notificacionesPendientes === "number" &&
    Number.isFinite(resumen.notificacionesPendientes) &&
    resumen.notificacionesPendientes >= 0
      ? Math.floor(resumen.notificacionesPendientes)
      : CONTEO_MOCK_NOTIFICACIONES;
  const avatar = perfil.avatarUrl.startsWith("http")
    ? perfil.avatarUrl
    : "/avatar-mendoza.png";

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src="/logo-praxis.png"
            alt="PRAXIS ECCI"
            width={32}
            height={32}
            className="size-8"
          />
          <span className="h-6 w-px bg-line" aria-hidden="true" />
          <div className="min-w-0">
            <p className="font-display text-[16px] font-semibold leading-6 tracking-[-0.4px]">
              PRAXIS ECCI
            </p>
            <p className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.44px] text-muted">
              Gestión de Infraestructura
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-xl bg-panel px-3.5 py-2 text-muted md:flex">
            <Icon name="mapPin" className="size-[14px] text-brand" />
            <span className="text-[13px] font-semibold leading-[18px]">
              {perfil.campusLabel}
            </span>
            <Icon name="chevronDown" className="size-3.5" />
          </div>

          <NotificationsBell
            key={`${conteoNotificaciones}-${listado.items.length}`}
            conteo={conteoNotificaciones}
            items={listado.items}
          />

          <div className="flex items-center gap-2 rounded-xl bg-panel py-1 pl-1 pr-3">
            <Image
              src={avatar}
              alt={perfil.nombre}
              width={32}
              height={32}
              className="size-8"
            />
            <div className="hidden lg:block">
              <p className="text-[13px] font-semibold leading-[16px] text-[#191c1e]">
                {perfil.nombre}
              </p>
              <p className="text-[11px] font-semibold leading-[12px] tracking-[0.44px] text-muted">
                {perfil.rol} | {perfil.sede}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}