export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-line/60 bg-white px-3 pb-3 pt-4 lg:flex">
      <div>
        <p className="px-3 text-[11px] font-semibold tracking-[0.55px] text-muted">
          PRINCIPAL
        </p>
        <nav className="mt-3 space-y-1" />

        <p className="mt-6 px-3 text-[11px] font-semibold tracking-[0.55px] text-muted">
          SOPORTE
        </p>
        <nav className="mt-3 space-y-1" />
      </div>
    </aside>
  );
}