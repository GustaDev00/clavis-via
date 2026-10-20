import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { AppNav } from "@/components/nav/app-nav";
import { ScrollReset } from "@/components/nav/scroll-reset";
import { requireViewer } from "@/lib/dal/viewer";

/**
 * Casca do app autenticado.
 * - Celular: cabeçalho no topo e navegação flutuante embaixo.
 * - Tablet/desktop (md+): barra lateral à esquerda (com logo e avatar) e conteúdo largo ao lado.
 * Cabeçalho e navegação ficam ancorados durante as transições de rota.
 */
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const viewer = await requireViewer();
  const initial = viewer.displayName.trim().charAt(0).toUpperCase() || "V";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[var(--app-max)] flex-col md:max-w-none md:flex-row">
      <header
        style={{ viewTransitionName: "app-header" }}
        className="sticky top-0 z-40 flex h-[var(--app-header)] items-center justify-between px-5 pt-[max(env(safe-area-inset-top),10px)] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] backdrop-blur-md md:hidden"
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

      <AppNav displayName={viewer.displayName} initial={initial} />

      <main className="pb-safe min-w-0 flex-1 px-5 md:px-8 md:py-8 lg:px-12 lg:py-10">
        <div className="mx-auto w-full md:max-w-[760px] lg:max-w-[1080px]">{children}</div>
      </main>

      <ScrollReset />
    </div>
  );
}
