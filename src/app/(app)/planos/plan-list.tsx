"use client";

import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { CalendarDays, Check, ChevronRight, Clock } from "lucide-react";
import { KeyMark } from "@/components/brand/key-mark";
import { planPalette } from "@/components/emotions/tones";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/cn";
import { THEME_LABEL } from "@/lib/domain/practices";
import { EASE, SPRING } from "@/lib/motion";

export type PlanCardData = {
  slug: string;
  title: string;
  summary: string;
  theme: string;
  palette: string;
  minutesPerDay: string;
  totalDays: number;
  completedDays: number;
  percent: number;
  isStarted: boolean;
  isComplete: boolean;
};

/** Lista com filtro por tema. Trocar o filtro reorganiza os cards com animação de layout. */
export function PlanList({ plans }: { plans: PlanCardData[] }) {
  const themes = ["todos", ...new Set(plans.map((plan) => plan.theme))];
  const [theme, setTheme] = useState("todos");
  const visible = theme === "todos" ? plans : plans.filter((plan) => plan.theme === theme);

  return (
    <div className="flex flex-col gap-5">
      <LayoutGroup id="plan-filters">
        <div role="group" aria-label="Filtrar planos por tema" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          {themes.map((item) => {
            const active = item === theme;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => setTheme(item)}
                className={cn(
                  "relative h-10 shrink-0 rounded-full px-4 text-sm font-semibold active:scale-95",
                  active ? "text-white" : "bg-surface/70 text-text-soft shadow-soft hover:text-ink",
                )}
              >
                {active ? (
                  <motion.span layoutId="plan-filter" transition={SPRING.select} className="absolute inset-0 rounded-full bg-navy" />
                ) : null}
                <span className="relative">{item === "todos" ? "Todos" : (THEME_LABEL[item] ?? item)}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <motion.ul layout className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((plan, index) => (
            <motion.li
              key={plan.slug}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE.outSoft, delay: 0.05 + index * 0.06 } }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2, ease: EASE.exit } }}
              transition={{ layout: { duration: 0.42, ease: EASE.inOutSoft } }}
            >
              <Link
                href={`/planos/${plan.slug}`}
                transitionTypes={["nav-forward"]}
                className="group flex items-stretch gap-4 rounded-card border border-white/70 bg-surface/85 p-3 shadow-soft hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.985] md:h-full md:flex-col md:gap-3"
              >
                <span
                  aria-hidden
                  className="relative w-24 shrink-0 overflow-hidden rounded-t-[48px] rounded-b-[20px] md:h-36 md:w-full md:rounded-t-[96px]"
                  style={{ background: planPalette(plan.palette) }}
                >
                  <KeyMark className="absolute -right-3 -bottom-4 h-24 w-auto opacity-30 transition-transform duration-[600ms] ease-out-expo group-hover:scale-110 group-hover:-rotate-6 md:right-4 md:-bottom-8 md:h-32" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1.5 py-1.5 md:px-2 md:pb-2">
                  <span className="flex items-center gap-2">
                    <span className="eyebrow text-lav-700">{THEME_LABEL[plan.theme] ?? plan.theme}</span>
                    {plan.isComplete ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-2 py-0.5 text-[11px] font-bold text-success">
                        <Check className="size-3" strokeWidth={3} aria-hidden /> Concluído
                      </span>
                    ) : null}
                  </span>
                  <span className="type-display text-[24px] text-ink">{plan.title}</span>
                  <span className="line-clamp-2 text-[13px] leading-5 text-text-soft">{plan.summary}</span>
                  <span className="flex items-center gap-3 pt-0.5 text-xs font-medium text-muted">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5" aria-hidden /> {plan.totalDays} dias
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" aria-hidden /> {plan.minutesPerDay}
                    </span>
                  </span>
                  {plan.isStarted && !plan.isComplete ? (
                    <span className="flex items-center gap-2 pt-1">
                      <ProgressBar percent={plan.percent} label={`Progresso em ${plan.title}`} className="flex-1" />
                      <span className="tabular text-[11px] font-bold text-muted">
                        {plan.completedDays}/{plan.totalDays}
                      </span>
                    </span>
                  ) : null}
                </span>
                <ChevronRight className="size-5 shrink-0 self-center text-muted group-hover:translate-x-0.5 group-hover:text-ink md:hidden" aria-hidden />
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
