import Link from "next/link";

export function PlaceholderPage({
  title,
  message = "Sección en construcción / disponible en próxima entrega",
}: {
  title: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4 p-6">
      <h1 className="text-xl font-semibold text-ink">{title}</h1>
      <p className="max-w-md text-sm text-muted">{message}</p>
      <Link
        href="/panel"
        className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white"
      >
        Volver al panel
      </Link>
    </div>
  );
}