"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion } from "motion/react";
import { BookOpenText, Footprints, HeartHandshake, Sun, type LucideIcon } from "lucide-react";
import { KeyMark } from "@/components/brand/key-mark";
import { cn } from "@/lib/cn";
import { SPRING } from "@/lib/motion";

type Tab = { href: "/hoje" | "/check-in" | "/planos" | "/jornada"; label: string; Icon: LucideIcon };

const TABS: Tab[] = [
  { href: "/hoje", label: "Hoje", Icon: Sun },
  { href: "/check-in", label: "Check-in", Icon: HeartHandshake },
  { href: "/planos", label: "Planos", Icon: BookOpenText },
  { href: "/jornada", label: "Jornada", Icon: Footprints },
];

/**
 * Uma única navegação que muda de forma com a largura da tela:
 * - celular: pílula flutuante no rodapé;
 * - tablet (md): barra lateral estreita, só ícones com rótulo pequeno;
 * - desktop (lg): barra lateral completa com logo, rótulos e avatar.
 * Mesmo DOM em todos os tamanhos: a pílula ativa continua deslizando entre os itens.
 */
export function AppNav({ displayName, initial }: { displayName: string; initial: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      style={{ viewTransitionName: "app-nav" }}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[var(--app-max)] px-4 pb-[max(env(safe-area-inset-bottom),10px)]",
        "md:sticky md:inset-auto md:top-0 md:flex md:h-dvh md:w-[96px] md:max-w-none md:shrink-0 md:flex-col md:px-3 md:py-6 lg:w-[256px] lg:px-5",
      )}
    >
      {/* Logo (só na barra lateral) */}
      <Link
        href="/hoje"
        transitionTypes={["nav-tab"]}
        aria-label="CLAVIS VIA, ir para Hoje"
        className="hidden items-center gap-2.5 rounded-2xl text-ink md:mb-8 md:flex md:justify-center lg:justify-start lg:px-3"
      >
        <KeyMark className="h-9 w-auto" />
        <span className="hidden font-display text-[15px] font-semibold tracking-[0.2em] lg:inline">CLAVIS VIA</span>
      </Link>

      <LayoutGroup id="app-nav">
        <ul
          className={cn(
            "flex h-[var(--nav-height)] items-center justify-between rounded-[28px] border border-white/80 bg-surface/80 px-2 shadow-float backdrop-blur-xl",
            "md:h-auto md:flex-col md:items-stretch md:justify-start md:gap-1.5 md:rounded-none md:border-0 md:bg-transparent md:px-0 md:shadow-none md:backdrop-blur-none",
          )}
        >
          {TABS.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href} className="flex-1 md:flex-none">
                <Link
                  href={href}
                  transitionTypes={["nav-tab"]}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative mx-auto flex h-[54px] w-full max-w-[84px] flex-col items-center justify-center gap-1 rounded-2xl active:scale-95",
                    "md:h-16 md:max-w-none md:hover:bg-white/50",
                    "lg:h-12 lg:flex-row lg:justify-start lg:gap-3 lg:px-4",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      transition={SPRING.select}
                      aria-hidden
                      className="absolute inset-0 rounded-2xl bg-[image:var(--grad-aurora)] md:shadow-soft"
                    />
                  ) : null}
                  <Icon
                    aria-hidden
                    strokeWidth={active ? 2.2 : 1.8}
                    className={cn(
                      "relative size-[22px] transition-colors duration-[var(--dur-micro)]",
                      active ? "text-ink" : "text-muted",
                    )}
                  />
                  <span
                    className={cn(
                      "relative text-[11px] leading-none transition-colors duration-[var(--dur-micro)] lg:text-[15px]",
                      active ? "font-bold text-ink" : "font-medium text-muted",
                    )}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </LayoutGroup>

      {/* Avatar e nota de demonstração (só na barra lateral) */}
      <div className="hidden md:mt-auto md:flex md:flex-col md:items-center md:gap-3 lg:items-stretch">
        <Link
          href="/jornada"
          transitionTypes={["nav-tab"]}
          aria-label={`Minha jornada de ${displayName}`}
          className="flex items-center gap-3 rounded-2xl md:justify-center lg:justify-start lg:px-3 lg:py-2 lg:hover:bg-white/50"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[image:var(--grad-aurora)] text-sm font-bold text-ink shadow-soft ring-2 ring-white">
            {initial}
          </span>
          <span className="hidden min-w-0 flex-col lg:flex">
            <span className="truncate text-sm font-bold text-ink">{displayName}</span>
            <span className="text-xs text-muted">Visitante de demonstração</span>
          </span>
        </Link>
      </div>
    </nav>
  );
}
