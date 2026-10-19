"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion } from "motion/react";
import { BookOpenText, Footprints, HeartHandshake, Sun, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { SPRING } from "@/lib/motion";

type Tab = { href: "/hoje" | "/check-in" | "/planos" | "/jornada"; label: string; Icon: LucideIcon };

const TABS: Tab[] = [
  { href: "/hoje", label: "Hoje", Icon: Sun },
  { href: "/check-in", label: "Check-in", Icon: HeartHandshake },
  { href: "/planos", label: "Planos", Icon: BookOpenText },
  { href: "/jornada", label: "Jornada", Icon: Footprints },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      style={{ viewTransitionName: "app-nav" }}
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[var(--app-max)] px-4 pb-[max(env(safe-area-inset-bottom),10px)]"
    >
      <LayoutGroup id="bottom-nav">
        <ul className="flex h-[var(--nav-height)] items-center justify-between rounded-[28px] border border-white/80 bg-surface/80 px-2 shadow-float backdrop-blur-xl">
          {TABS.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  transitionTypes={["nav-tab"]}
                  aria-current={active ? "page" : undefined}
                  className="relative mx-auto flex h-[54px] w-full max-w-[84px] flex-col items-center justify-center gap-1 rounded-2xl active:scale-95"
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      transition={SPRING.select}
                      aria-hidden
                      className="absolute inset-0 rounded-2xl bg-[image:var(--grad-aurora)]"
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
                      "relative text-[11px] leading-none transition-colors duration-[var(--dur-micro)]",
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
    </nav>
  );
}
