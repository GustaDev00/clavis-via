import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { DemoBadge } from "@/components/ui/card";
import { getPlansWithProgress } from "@/lib/dal/progress";
import { PlanList, type PlanCardData } from "./plan-list";

export const metadata: Metadata = { title: "Planos" };

export default async function PlansPage() {
  const plans = await getPlansWithProgress();

  const cards: PlanCardData[] = plans.map((plan) => ({
    slug: plan.slug,
    title: plan.title,
    summary: plan.summary,
    theme: plan.theme,
    palette: plan.palette,
    minutesPerDay: plan.minutes_per_day,
    totalDays: plan.progress.totalDays,
    completedDays: plan.progress.completedDays,
    percent: plan.progress.percent,
    isStarted: plan.progress.isStarted,
    isComplete: plan.progress.isComplete,
  }));

  return (
    <PageTransition>
      <section className="flex flex-col gap-6 pt-2">
        <header className="flex flex-col gap-3">
          <Reveal>
            <p className="eyebrow text-lav-700">Planos temáticos</p>
          </Reveal>
          <RevealHeading className="type-display text-[clamp(30px,5.4dvh,40px)] text-ink">Um passo por dia</RevealHeading>
          <Reveal delay={0.25} className="flex flex-col items-start gap-3">
            <p className="text-[15px] leading-6 text-text-soft">
              Planos curtos, com uma mensagem, uma ação pequena e um espaço para você registrar como foi.
            </p>
            <DemoBadge />
          </Reveal>
        </header>

        <Reveal delay={0.3}>
          <PlanList plans={cards} />
        </Reveal>
      </section>
    </PageTransition>
  );
}
