"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { AvisoAlerta, EstadoBadge } from "@/components/mis-solicitudes/estado-badge";
import { useCompletarInfo } from "@/components/mis-solicitudes/completar-info-modal";
import {
  apiGetEstado,
  FALLBACK_SOLICITUDES,
  type ReporteReciente,
  type ResultadoApi,
} from "@/lib/api";

const POR_PAGINA = 4;

const FILTROS_ESTADO = [
  { valor: "", label: "Todos los estados" },
  { valor: "PENDIENTE_INFORMACION", label: "Pendiente de Información" },
  { valor: "EN_PROCESO", label: "En Proceso" },
  { valor: "RESUELTO", label: "Resuelto" },
];

const FILTROS_CATEGORIA = [
  { valor: "", label: "Todas las categorías" },
  { valor: "Electricidad", label: "Electricidad" },
  { valor: "Hidráulica", label: "Hidráulica" },
  { valor: "Cerrajería", label: "Cerrajería" },
];

const FILTROS_RANGO = [
  { valor: "", label: "Todos los períodos" },
  { valor: "30", label: "Últimos 30 días" },
  { valor: "7", label: "Últimos 7 días" },
  { valor: "hoy", label: "Hoy" },
];

function desdeDeRango(rango: string): number {
  if (rango === "hoy") {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  if (rango === "7") return Date.now() - 7 * 24 * 60 * 60 * 1000;
  if (rango === "30") return Date.now() - 30 * 24 * 60 * 60 * 1000;
  return 0;
}

export function ExploradorSolicitudes() {
  const { abrir: abrirCompletarInfo, version } = useCompletarInfo();
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");
  const [categoria, setCategoria] = useState("");
  const [rango, setRango] = useState("");
  const [pagina, setPagina] = useState(1);
  const [resultado, setResultado] = useState<ResultadoApi<ReporteReciente[]>>({
    estado: "ok",
    datos: FALLBACK_SOLICITUDES,
  });
  const [cargandoInicial, setCargandoInicial] = useState(true);

  // Carga inicial + re-fetch; `version` cambia al completar información,
  // lo que refresca el listado sin recargar la página.
  useEffect(() => {
    let vivo = true;
    apiGetEstado<ReporteReciente[]>("/reportes/solicitudes").then((r) => {
      if (!vivo) return;
      setResultado(r);
      setCargandoInicial(false);
    });
    return () => {
      vivo = false;
    };
  }, [version]);

  const items = useMemo(
    () => (resultado.estado === "ok" ? resultado.datos : []),
    [resultado],
  );

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return items.filter((r) => {
      if (estado && r.estado !== estado) return false;
      if (categoria && r.categoria !== categoria) return false;
      if (rango) {
        const ts = Date.parse(r.actualizadoEn ?? "");
        if (Number.isNaN(ts) || ts < desdeDeRango(rango)) return false;
      }
      if (!q) return true;
      return (
        r.id.toLowerCase().includes(q) ||
        r.titulo.toLowerCase().includes(q) ||
        r.ubicacion.toLowerCase().includes(q) ||
        (r.mensajeAlerta ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, busqueda, estado, categoria, rango]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = filtrados.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA,
  );

  const refrescar = () => {
    setCargandoInicial(true);
    apiGetEstado<ReporteReciente[]>("/reportes/solicitudes").then((r) => {
      setResultado(r);
      setCargandoInicial(false);
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] font-bold leading-9 tracking-[-0.7px] text-ink">
            Mis Solicitudes
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Consulta y da seguimiento a tus novedades e incidentes de
            infraestructura reportados.
          </p>
        </div>
        <Link
          href="/reportes/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#00517f]"
        >
          <Icon name="plus" className="size-4" />
          Nuevo Reporte
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line/60 bg-white p-3.5 shadow-sm">
        <div className="relative min-w-56 flex-1">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
            placeholder="Buscar por código (#TKT), espacio o avería..."
            aria-label="Buscar solicitudes"
            className="w-full rounded-md border border-line bg-white py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition-colors focus:border-brand"
          />
        </div>

        <SelectFiltro
          label="Estado"
          valor={estado}
          onChange={(v) => {
            setEstado(v);
            setPagina(1);
          }}
          opciones={FILTROS_ESTADO}
        />
        <SelectFiltro
          label="Categoría"
          valor={categoria}
          onChange={(v) => {
            setCategoria(v);
            setPagina(1);
          }}
          opciones={FILTROS_CATEGORIA}
        />
        <SelectFiltro
          label="Rango"
          valor={rango}
          onChange={(v) => {
            setRango(v);
            setPagina(1);
          }}
          opciones={FILTROS_RANGO}
        />
      </div>

      {cargandoInicial ? (
        <p className="rounded-xl border border-line/60 bg-white p-10 text-center text-sm text-muted shadow-sm">
          Cargando solicitudes...
        </p>
      ) : resultado.estado === "error" ? (
        <div className="rounded-xl border border-line/60 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-ink">
            No pudimos cargar tus solicitudes.
          </p>
          <p className="mt-1 text-sm text-muted">
            Ocurrió un error al consultar el servicio. Intenta de nuevo.
          </p>
          <button
            type="button"
            onClick={refrescar}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#00517f]"
          >
            Reintentar
          </button>
        </div>
      ) : resultado.estado === "vacio" || filtrados.length === 0 ? (
        <Vacio
          conFiltros={
            resultado.estado === "ok" && filtrados.length === 0 && items.length > 0
          }
          onLimpiar={() => {
            setBusqueda("");
            setEstado("");
            setCategoria("");
          }}
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-line/60 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line/60 bg-panel text-[11px] font-semibold uppercase tracking-[0.5px] text-muted">
                  <th className="px-5 py-3.5">Código / Fecha</th>
                  <th className="px-5 py-3.5">Novedad &amp; Ubicación</th>
                  <th className="px-5 py-3.5">Categoría</th>
                  <th className="px-5 py-3.5">Estado</th>
                  <th className="px-5 py-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {visibles.map((r) => (
                  <tr
                    key={r.id}
                    className={
                      r.estado === "PENDIENTE_INFORMACION"
                        ? "bg-pending-row"
                        : undefined
                    }
                  >
                    <td className="px-5 py-4 align-top">
                      <p className="font-semibold text-ink">#{r.id}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {r.actualizadoHace}
                      </p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <p className="font-semibold text-ink">{r.titulo}</p>
                      <p className="mt-1 text-xs text-muted">{r.ubicacion}</p>
                      {r.mensajeAlerta && (
                        <div className="mt-1.5">
                          <AvisoAlerta
                            mensaje={r.mensajeAlerta}
                            tono={r.estado === "RESUELTO" ? "success" : "warning"}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 align-top text-muted">
                      {r.categoria}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <EstadoBadge estado={r.estado} />
                      <p className="mt-1 text-xs text-muted">{r.meta}</p>
                    </td>
                    <td className="px-5 py-4 text-right align-top">
                      {r.accionPrincipal === "COMPLETAR_INFORMACION" ? (
                        <button
                          type="button"
                          onClick={() => abrirCompletarInfo(r.id)}
                          className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-pending-action px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#d97706]"
                        >
                          Completar Información Requerida
                          <Icon name="arrowRight" className="size-3.5" />
                        </button>
                      ) : (
                        <Link
                          href={`/mis-solicitudes/${r.id}`}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-btn px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:bg-line"
                        >
                          Ver Detalle
                          <Icon name="chevronRight" className="size-3.5" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Mostrando {visibles.length} de {filtrados.length} solicitudes
            </p>
            <div className="flex items-center gap-2">
              <BotonPagina
                deshabilitado={paginaActual === 1}
                onClick={() => setPagina(paginaActual - 1)}
              >
                <Icon name="chevronLeft" className="size-3.5" />
                Anterior
              </BotonPagina>
              <span className="flex size-8 items-center justify-center rounded-md bg-brand text-sm font-semibold text-white">
                {paginaActual}
              </span>
              <BotonPagina
                deshabilitado={paginaActual === totalPaginas}
                onClick={() => setPagina(paginaActual + 1)}
              >
                Siguiente
                <Icon name="chevronRight" className="size-3.5" />
              </BotonPagina>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SelectFiltro({
  label,
  valor,
  onChange,
  opciones,
}: {
  label: string;
  valor: string;
  onChange: (v: string) => void;
  opciones: { valor: string; label: string }[];
}) {
  return (
    <div className="relative">
      <label htmlFor={`filtro-${label}`} className="sr-only">
        {label}
      </label>
      <select
        id={`filtro-${label}`}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-md border border-line bg-white py-2.5 pl-3.5 pr-9 text-sm text-ink outline-none transition-colors focus:border-brand"
      >
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevronDown"
        className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

function Vacio({
  conFiltros,
  onLimpiar,
}: {
  conFiltros: boolean;
  onLimpiar: () => void;
}) {
  return (
    <div className="rounded-xl border border-line/60 bg-white px-6 py-14 text-center shadow-sm">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-panel">
        <Icon name="inbox" className="size-7 text-muted" />
      </span>
      <h2 className="mt-4 font-display text-lg font-semibold text-ink">
        {conFiltros
          ? "No encontramos solicitudes con esos filtros"
          : "Aún no tienes solicitudes registradas"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        {conFiltros
          ? "Prueba con otros términos de búsqueda o limpia los filtros para ver todas tus solicitudes."
          : "Cuando reportes una avería o novedad de infraestructura en tu campus, podrás consultar su avance, estado técnico y radicado en este panel."}
      </p>
      {conFiltros ? (
        <button
          type="button"
          onClick={onLimpiar}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-btn px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-line"
        >
          <Icon name="x" className="size-4" />
          Limpiar filtros
        </button>
      ) : (
        <Link
          href="/reportes/nuevo"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#00517f]"
        >
          <Icon name="plus" className="size-4" />
          Crear Mi Primer Reporte
        </Link>
      )}
    </div>
  );
}

function BotonPagina({
  deshabilitado,
  onClick,
  children,
}: {
  deshabilitado: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={deshabilitado}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md bg-btn px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-line disabled:opacity-40"
    >
      {children}
    </button>
  );
}
