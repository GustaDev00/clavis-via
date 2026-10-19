import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Footprints, Lock, MessageCircleHeart } from "lucide-react";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { BackLink } from "@/components/nav/back-link";
import { ButtonLink } from "@/components/ui/button";
import { Card, DemoBadge } from "@/components/ui/card";
import { getPlanWithProgress } from "@/lib/dal/progress";
import { formatMoment } from "@/lib/domain/dates";
import { CompleteDayForm } from "./complete-day-form";

type Props = PageProps<"/planos/[slug]/dia/[day]">;

async function load(params: Props["params"]) {
  const { slug, day } = await params;
  const dayNumber = Number(day);
  if (!Number.isInteger(dayNumber) || dayNumber < 1) notFound();

  const plan = await getPlanWithProgress(slug);
  const planDay = plan?.plan_days.find((item) => item.day_number === dayNumber);
  if (!plan || !planDay) notFound();
  return { plan, planDay, dayNumber };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { plan, dayNumber } = await load(params);
  return { title: `Dia ${dayNumber} · ${plan.title}` };
}

export default async function PlanDayPage({ params }: Props) {
  const { plan, planDay, dayNumber } = await load(params);
  const status = plan.progress.statusByDay.get(dayNumber) ?? "locked";
  const completion = plan.completions.find((item) => item.plan_day_id === planDay.id);
  const nextDay = plan.plan_days.find((item) => item.day_number === dayNumber + 1);

  return (
    <PageTransition>
      <section className="flex flex-col gap-6 pt-2">
        <BackLink href={`/planos/${plan.slug}`} label={plan.title} />

        <header className="flex flex-col gap-3">
          <Reveal>
            <p className="eyebrow tabular text-lav-700">
              Dia {dayNumber} de {plan.progress.totalDays}
            </p>
          </Reveal>
          <RevealHeading className="type-display text-[40px] text-ink">{planDay.title}</RevealHeading>
          <Reveal delay={0.2}>
            <p className="text-[15px] text-text-soft">{planDay.subtitle}</p>
          </Reveal>
        </header>

        {status === "locked" ? (
          <Reveal delay={0.3}>
            <Card className="flex flex-col items-start gap-4 p-6">
              <span className="grid size-12 place-items-center rounded-full bg-sunken text-muted">
                <Lock className="size-5" aria-hidden />
              </span>
              <div className="flex flex-col gap-1.5">
                <h2 className="type-display text-[26px] text-ink">Este dia ainda está fechado</h2>
                <p className="text-[15px] leading-6 text-text-soft">
                  Os dias abrem em sequência. Conclua o dia {dayNumber - 1} para liberar este.
                </p>
              </div>
              {plan.progress.nextDayNumber ? (
                <ButtonLink
                  href={`/planos/${plan.slug}/dia/${plan.progress.nextDayNumber}`}
                  transitionTypes={["nav-back"]}
                  variant="soft"
                >
                  Ir para o dia {plan.progress.nextDayNumber}
                  <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              ) : null}
            </Card>
          </Reveal>
        ) : (
          <>
            <Stagger delay={0.3} className="flex flex-col gap-4">
              <StaggerItem>
                <Card className="flex flex-col gap-3 p-5">
                  <p className="eyebrow flex items-center gap-2 text-sky-700">
                    <MessageCircleHeart className="size-4" aria-hidden /> Mensagem do dia
                  </p>
                  <p className="type-display text-[22px] leading-[1.35] text-text italic">{planDay.message}</p>
                </Card>
              </StaggerItem>
              <StaggerItem>
                <div className="flex flex-col gap-3 rounded-card border border-white/70 bg-[image:var(--grad-aurora)] p-5 shadow-soft">
                  <p className="eyebrow flex items-center gap-2 text-lav-700">
                    <Footprints className="size-4" aria-hidden /> Ação do dia
                  </p>
                  <p className="text-[15px] leading-6 font-medium text-text">{planDay.action}</p>
                </div>
              </StaggerItem>
              <StaggerItem className="flex justify-center">
                <DemoBadge />
              </StaggerItem>
            </Stagger>

            <Reveal delay={0.5}>
              {status === "done" && completion ? (
                <Card className="flex flex-col gap-4 p-5">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-success">Dia concluído · {formatMoment(completion.completed_at)}</p>
                    <p className="text-[13px] text-muted">{planDay.reflection_prompt}</p>
                  </div>
                  <p className="text-[15px] leading-6 whitespace-pre-line text-text [overflow-wrap:anywhere]">
                    {completion.reflection ?? "Você concluiu este dia sem escrever uma reflexão."}
                  </p>
                  {nextDay ? (
                    <ButtonLink
                      href={`/planos/${plan.slug}/dia/${nextDay.day_number}`}
                      transitionTypes={["nav-forward"]}
                      size="lg"
                    >
                      Seguir para o dia {nextDay.day_number}
                      <ArrowRight className="size-4" aria-hidden />
                    </ButtonLink>
                  ) : (
                    <ButtonLink href="/jornada" transitionTypes={["nav-tab"]} size="lg" variant="soft">
                      Ver na minha jornada
                    </ButtonLink>
                  )}
                </Card>
              ) : (
                <CompleteDayForm planSlug={plan.slug} dayNumber={dayNumber} prompt={planDay.reflection_prompt} />
              )}
            </Reveal>
          </>
        )}
      </section>
    </PageTransition>
  );
}
