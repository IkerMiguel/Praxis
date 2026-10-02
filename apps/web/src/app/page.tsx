import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans text-ink">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-panel" />
      </div>
    </div>
  );
}