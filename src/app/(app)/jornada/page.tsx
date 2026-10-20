import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Flame } from "lucide-react";
import { EmotionFace } from "@/components/emotions/emotion-face";
import { CountUp } from "@/components/motion/count-up";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getCheckInsSince } from "@/lib/dal/check-ins";
import { getRecentPracticeCompletions } from "@/lib/dal/practice-completions";
import { getPlansWithProgress } from "@/lib/dal/progress";
import { cn } from "@/lib/cn";
import { formatMoment, toDayKey } from "@/lib/domain/dates";
import { getEmotion } from "@/lib/domain/emotions";
import { buildWeek, computeStreak } from "@/lib/domain/journey";
import { DemoDataCard } from "./demo-data-card";

export const metadata: Metadata = { title: "Minha jornada" };

export default async function JourneyPage() {
  const now = new Date();
  const todayKey = toDayKey(now);
  const [checkIns, plans, practices] = await Promise.all([
    getCheckInsSince(30),
    getPlansWithProgress(),
    getRecentPracticeCompletions(6),
  ]);

  const streak = computeStreak(checkIns, todayKey);
  const week = buildWeek(checkIns, todayKey);
  const startedPlans = plans.filter((plan) => plan.progress.isStarted);
  const completedDays = plans.reduce((total, plan) => total + plan.progress.completedDays, 0);
  const recentCheckIns = checkIns.slice(0, 8);

  return (
    <PageTransition>
      <section className="flex flex-col gap-6 pt-2">
        <header className="flex flex-col gap-3">
          <Reveal>
            <p className="eyebrow text-lav-700">Minha jornada</p>
          </Reveal>
          <RevealHeading className="type-display text-[clamp(30px,5.4dvh,40px)] text-ink lg:text-[52px]">O caminho que você vem fazendo</RevealHeading>
        </header>

        <Stagger delay={0.25} className="flex flex-col gap-4 md:grid md:grid-cols-2 md:items-start md:gap-5 lg:grid-cols-3">
          {/* Sequência + semana */}
          <StaggerItem className="md:col-span-2">
            <Card className="flex flex-col gap-5 p-5">
              <div className="flex items-end justify-between gap-3">
                <div className="flex items-end gap-2.5">
                  <CountUp value={streak} className="tabular text-[52px] leading-[0.9] font-bold tracking-tight text-ink" />
                  <span className="pb-1 text-sm font-semibold text-text-soft">
                    {streak === 1 ? "dia seguido" : "dias seguidos"}
                    <br />
                    com check-in
                  </span>
                </div>
                <span className="grid size-11 place-items-center rounded-2xl bg-peach-100 text-peach-700">
                  <Flame className="size-5" aria-hidden />
                </span>
              </div>
              <ol className="grid grid-cols-7 gap-1" aria-label="Check-ins dos últimos 7 dias">
                {week.map((day) => (
                  <li key={day.dayKey} className="flex flex-col items-center gap-1.5">
                    {day.emotion ? (
                      <EmotionFace emotion={day.emotion} className="size-9" />
                    ) : (
                      <span
                        className={cn(
                          "size-9 rounded-full border-2 border-dashed border-line",
                          day.isToday && "border-lav-300",
                        )}
                      />
                    )}
                    <span className={cn("text-[11px] font-semibold text-muted", day.isToday && "text-ink")}>
                      {day.isToday ? "hoje" : day.label}
                    </span>
                    <span className="sr-only">{day.emotion ? getEmotion(day.emotion).label : "sem check-in"}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </StaggerItem>

          {/* Números */}
          <StaggerItem className="grid grid-cols-3 gap-2.5 md:col-span-2 lg:col-span-1 lg:grid-cols-1 lg:gap-3">
            {[
              { value: checkIns.length, label: "check-ins em 30 dias" },
              { value: completedDays, label: "dias de plano" },
              { value: practices.length, label: "práticas recentes" },
            ].map((stat) => (
              <Card key={stat.label} className="flex flex-col gap-1 p-3.5">
                <CountUp value={stat.value} className="tabular text-[28px] leading-none font-bold tracking-tight text-ink" />
                <span className="text-[11px] leading-4 font-semibold text-muted">{stat.label}</span>
              </Card>
            ))}
          </StaggerItem>

          {/* Check-ins recentes */}
          <StaggerItem className="flex flex-col gap-3">
            <div className="flex items-center justify-between pt-2">
              <h2 className="text-[17px] font-bold text-ink">Check-ins recentes</h2>
              <Link href="/check-in" transitionTypes={["nav-tab"]} className="rounded-full text-sm font-semibold text-lav-700 hover:text-ink">
                Novo check-in
              </Link>
            </div>
            {recentCheckIns.length > 0 ? (
              <Card className="divide-y divide-line/70 px-4">
                {recentCheckIns.map((checkIn) => (
                  <div key={checkIn.id} data-testid="journey-check-in" className="flex items-start gap-3 py-3.5">
                    <EmotionFace emotion={checkIn.emotion} className="size-10 shrink-0" />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-bold text-ink">{getEmotion(checkIn.emotion).label}</span>
                        <span className="shrink-0 text-xs text-muted">{formatMoment(checkIn.created_at, now)}</span>
                      </div>
                      {checkIn.note ? (
                        <p className="line-clamp-3 text-sm leading-5 text-text-soft [overflow-wrap:anywhere]">{checkIn.note}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </Card>
            ) : (
              <EmptyState text="Seus check-ins aparecem aqui. Que tal começar pelo de hoje?" href="/check-in" cta="Fazer check-in" />
            )}
          </StaggerItem>

          {/* Planos */}
          <StaggerItem className="flex flex-col gap-3">
            <h2 className="pt-2 text-[17px] font-bold text-ink">Seus planos</h2>
            {startedPlans.length > 0 ? (
              startedPlans.map((plan) => (
                <Link
                  key={plan.slug}
                  href={`/planos/${plan.slug}`}
                  transitionTypes={["nav-forward"]}
                  data-testid="journey-plan"
                  className="group block rounded-card"
                >
                  <Card className="flex flex-col gap-3 p-4 group-hover:-translate-y-0.5 group-hover:shadow-lift">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold text-ink">{plan.title}</span>
                      {plan.progress.isComplete ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-2 py-0.5 text-[11px] font-bold text-success">
                          <Check className="size-3" strokeWidth={3} aria-hidden /> Concluído
                        </span>
                      ) : (
                        <span className="tabular shrink-0 text-xs font-semibold text-muted">
                          {plan.progress.completedDays} de {plan.progress.totalDays} dias
                        </span>
                      )}
                    </div>
                    <ProgressBar percent={plan.progress.percent} label={`Progresso em ${plan.title}`} />
                  </Card>
                </Link>
              ))
            ) : (
              <EmptyState text="Quando você começar um plano, o progresso aparece aqui." href="/planos" cta="Ver planos" />
            )}
          </StaggerItem>

          {/* Práticas */}
          {practices.length > 0 ? (
            <StaggerItem className="flex flex-col gap-3">
              <h2 className="pt-2 text-[17px] font-bold text-ink">Práticas feitas</h2>
              <Card className="divide-y divide-line/70 px-4">
                {practices.map((completion) => (
                  <div key={completion.id} className="flex items-center justify-between gap-3 py-3">
                    <span className="flex items-center gap-2.5 font-semibold text-ink">
                      <span className="grid size-7 place-items-center rounded-full bg-success-bg text-success">
                        <Check className="size-3.5" strokeWidth={3} aria-hidden />
                      </span>
                      {completion.practice?.title ?? "Prática"}
                    </span>
                    <span className="shrink-0 text-xs text-muted">{formatMoment(completion.completed_at, now)}</span>
                  </div>
                ))}
              </Card>
            </StaggerItem>
          ) : null}

          <StaggerItem className="pt-2 md:col-span-2 lg:col-span-3">
            <DemoDataCard />
          </StaggerItem>
        </Stagger>
      </section>
    </PageTransition>
  );
}

function EmptyState({ text, href, cta }: { text: string; href: "/check-in" | "/planos"; cta: string }) {
  return (
    <Card className="flex flex-col items-start gap-3 border-dashed p-5">
      <p className="text-sm leading-5 text-text-soft">{text}</p>
      <ButtonLink href={href} transitionTypes={["nav-tab"]} variant="soft" size="sm">
        {cta}
        <ArrowRight className="size-4" aria-hidden />
      </ButtonLink>
    </Card>
  );
}
