import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { BottomNav } from "@/components/nav/bottom-nav";
import { ScrollReset } from "@/components/nav/scroll-reset";
import { requireViewer } from "@/lib/dal/viewer";

/** Casca do app autenticado: cabeçalho e navegação ancorados durante as transições. */
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const viewer = await requireViewer();
  const initial = viewer.displayName.trim().charAt(0).toUpperCase() || "V";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[var(--app-max)] flex-col">
      <header
        style={{ viewTransitionName: "app-header" }}
        className="sticky top-0 z-40 flex h-[var(--app-header)] items-center justify-between px-5 pt-[max(env(safe-area-inset-top),10px)] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] backdrop-blur-md"
      >
        <Link href="/hoje" transitionTypes={["nav-tab"]} aria-label="CLAVIS VIA, ir para Hoje" className="rounded-full">
          <Logo />
        </Link>
        <Link
          href="/jornada"
          transitionTypes={["nav-tab"]}
          aria-label={`Minha jornada de ${viewer.displayName}`}
          className="grid size-10 place-items-center rounded-full bg-[image:var(--grad-aurora)] text-sm font-bold text-ink shadow-soft ring-2 ring-white hover:scale-105 active:scale-95"
        >
          {initial}
        </Link>
      </header>

      <main className="pb-safe flex-1 px-5">{children}</main>

      <BottomNav />
      <ScrollReset />
    </div>
  );
}
