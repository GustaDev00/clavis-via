import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Check, ChevronRight, Clock, Lock } from "lucide-react";
import { KeyMark } from "@/components/brand/key-mark";
import { planPalette } from "@/components/emotions/tones";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { BackLink } from "@/components/nav/back-link";
import { ButtonLink } from "@/components/ui/button";
import { Card, DemoBadge } from "@/components/ui/card";
import { FlashToast } from "@/components/ui/flash-toast";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getPlanWithProgress } from "@/lib/dal/progress";
import { cn } from "@/lib/cn";
import { THEME_LABEL } from "@/lib/domain/practices";
import { StartPlanForm } from "./start-plan-form";

export async function generateMetadata({ params }: PageProps<"/planos/[slug]">): Promise<Metadata> {
  const plan = await getPlanWithProgress((await params).slug);
  return { title: plan?.title ?? "Plano" };
}

export default async function PlanPage({ params, searchParams }: PageProps<"/planos/[slug]">) {
  const [{ slug }, { concluido }] = await Promise.all([params, searchParams]);
  const plan = await getPlanWithProgress(slug);
  if (!plan) notFound();

  const { progress } = plan;
  const justCompleted = typeof concluido === "string" ? Number(concluido) : null;
  const flash = justCompleted
    ? progress.isComplete
      ? "Plano concluído. Que bonito ver você chegar até aqui."
      : `Dia ${justCompleted} concluído. Que bom que você se deu esse tempo.`
    : null;

  return (
    <PageTransition>
      <section className="flex flex-col gap-6 pt-2 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:gap-y-6">
        <BackLink href="/planos" label="Planos" />

        <Reveal className="lg:col-start-1">
          <div
            className="relative h-[clamp(96px,17dvh,160px)] overflow-hidden rounded-card border border-white/70 shadow-lift lg:h-60"
            style={{ background: planPalette(plan.palette) }}
          >
            <KeyMark aria-hidden className="absolute -right-4 -bottom-8 h-56 w-auto opacity-30" />
            <span className="eyebrow absolute top-5 left-5 rounded-full bg-white/70 px-3 py-1.5 text-lav-700 backdrop-blur">
              {THEME_LABEL[plan.theme] ?? plan.theme}
            </span>
          </div>
        </Reveal>

        <header className="flex flex-col gap-3 lg:col-start-1">
          <RevealHeading className="type-display text-[clamp(30px,5.4dvh,38px)] text-ink lg:text-[48px]">{plan.title}</RevealHeading>
          <Reveal delay={0.2} className="flex flex-col gap-3">
            <p className="flex flex-wrap items-center gap-4 text-sm font-semibold text-text-soft">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden /> {progress.totalDays} dias
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden /> {plan.minutes_per_day} por dia
              </span>
            </p>
            <p className="text-[15px] leading-6 text-text-soft">{plan.description}</p>
            <DemoBadge className="self-start" />
          </Reveal>
        </header>

        {progress.isStarted ? (
          <Reveal delay={0.3} className="lg:col-start-1">
            <Card className="flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-ink">{progress.isComplete ? "Plano concluído" : "Seu progresso"}</span>
                <span className="tabular font-semibold text-muted">
                  {progress.completedDays} de {progress.totalDays} dias
                </span>
              </div>
              <ProgressBar percent={progress.percent} label={`Progresso em ${plan.title}`} delay={0.5} />
            </Card>
          </Reveal>
        ) : null}

        <Stagger delay={0.35} className="flex flex-col gap-2.5 lg:col-start-2 lg:row-start-2">
          <StaggerItem>
            <h2 className="text-[17px] font-bold text-ink">Dias do plano</h2>
          </StaggerItem>
          {plan.plan_days.map((day) => {
            const status = progress.statusByDay.get(day.day_number) ?? "locked";
            const highlight = justCompleted === day.day_number;
            const content = (
              <>
                <span
                  className={cn(
                    "relative tabular grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold",
                    status === "done" && "bg-success-bg text-success",
                    status === "available" && "bg-navy text-white",
                    status === "locked" && "bg-sunken text-muted",
                  )}
                >
                  {status === "done" ? <Check className="size-4" strokeWidth={3} aria-hidden /> : null}
                  {status === "available" ? day.day_number : null}
                  {status === "locked" ? <Lock className="size-4" aria-hidden /> : null}
                  {highlight ? (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-success-bg motion-safe:animate-[cv-halo_1.1s_var(--ease-out-soft)_0.6s_both]"
                    />
                  ) : null}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-bold text-ink">
                    Dia {day.day_number} · {day.title}
                  </span>
                  <span className="text-[13px] text-text-soft">
                    {status === "done" ? "Concluído" : status === "locked" ? `Liberado após o dia ${day.day_number - 1}` : day.subtitle}
                  </span>
                </span>
              </>
            );

            return (
              <StaggerItem key={day.id}>
                {status === "locked" ? (
                  <div
                    aria-disabled="true"
                    className="flex items-center gap-3.5 rounded-2xl border border-dashed border-line bg-surface/50 p-3.5"
                  >
                    {content}
                  </div>
                ) : (
                  <Link
                    href={`/planos/${plan.slug}/dia/${day.day_number}`}
                    transitionTypes={["nav-forward"]}
                    className={cn(
                      "group flex items-center gap-3.5 rounded-2xl border border-white/70 bg-surface/80 p-3.5 shadow-soft hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.985]",
                      highlight && "ring-2 ring-sage-500/40",
                    )}
                  >
                    {content}
                    <ChevronRight className="size-5 shrink-0 text-muted group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
                  </Link>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal delay={0.55} className="lg:col-start-2 lg:row-start-3 lg:self-start">
          {!progress.isStarted ? (
            <StartPlanForm planSlug={plan.slug} />
          ) : progress.nextDayNumber ? (
            <ButtonLink
              href={`/planos/${plan.slug}/dia/${progress.nextDayNumber}`}
              transitionTypes={["nav-forward"]}
              size="lg"
              className="shadow-float"
            >
              {progress.completedDays === 0 ? "Ir para o Dia 1" : `Continuar: Dia ${progress.nextDayNumber}`}
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          ) : (
            <ButtonLink href="/jornada" transitionTypes={["nav-tab"]} size="lg" variant="soft">
              Ver na minha jornada
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          )}
        </Reveal>
      </section>
      <FlashToast key={flash ?? "none"} message={flash} />
    </PageTransition>
  );
}
