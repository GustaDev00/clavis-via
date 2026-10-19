import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, RefreshCcw, Sparkles } from "lucide-react";
import { KeyMark } from "@/components/brand/key-mark";
import { EmotionFace } from "@/components/emotions/emotion-face";
import { TONES, planPalette } from "@/components/emotions/tones";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { ButtonLink } from "@/components/ui/button";
import { Card, DemoBadge } from "@/components/ui/card";
import { FlashToast } from "@/components/ui/flash-toast";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getTodayCheckIn } from "@/lib/dal/check-ins";
import { getPractices } from "@/lib/dal/content";
import { getRecentPracticeCompletions } from "@/lib/dal/practice-completions";
import { getPlansWithProgress, progressBySlug } from "@/lib/dal/progress";
import { requireViewer } from "@/lib/dal/viewer";
import { formatMoment, greetingFor, toDayKey } from "@/lib/domain/dates";
import { getEmotion } from "@/lib/domain/emotions";
import { PRACTICE_KIND_LABEL } from "@/lib/domain/practices";
import { pickPlan, pickPractice } from "@/lib/domain/recommendation";

export const metadata: Metadata = { title: "Hoje" };

const FLASH: Record<string, string> = {
  "check-in": "Check-in salvo. Obrigado por se ouvir hoje.",
  pratica: "Prática registrada na sua jornada.",
};

export default async function TodayPage({ searchParams }: PageProps<"/hoje">) {
  const now = new Date();
  const todayKey = toDayKey(now);
  const [viewer, checkIn, practices, plans, completions, { salvo }] = await Promise.all([
    requireViewer(),
    getTodayCheckIn(),
    getPractices(),
    getPlansWithProgress(),
    getRecentPracticeCompletions(20),
    searchParams,
  ]);

  const emotion = checkIn?.emotion ?? null;
  const practice = pickPractice(practices, emotion, todayKey);
  const suggestedPlan = pickPlan(plans, emotion, progressBySlug(plans));
  const inProgress = plans.filter((plan) => plan.progress.isStarted && !plan.progress.isComplete);
  const practiceDoneToday = completions.some(
    (completion) => completion.practice?.slug === practice?.slug && toDayKey(new Date(completion.completed_at)) === todayKey,
  );

  const tone = TONES[emotion ? getEmotion(emotion).tone : "aurora"];
  const dateLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Sao_Paulo",
  }).format(now);
  const flash = typeof salvo === "string" ? (FLASH[salvo] ?? null) : null;

  return (
    <PageTransition>
      <section className="flex flex-col gap-6 pt-2">
        <header className="flex flex-col gap-2">
          <Reveal>
            <p className="eyebrow text-lav-700">{dateLabel}</p>
          </Reveal>
          <RevealHeading className="type-display text-[40px] text-ink [overflow-wrap:anywhere]">
            {greetingFor(now)}, {viewer.displayName}
          </RevealHeading>
          <Reveal delay={0.25}>
            <p className="text-[15px] text-text-soft">Que bom ter você aqui hoje.</p>
          </Reveal>
        </header>

        <Stagger delay={0.3} className="flex flex-col gap-4">
          <StaggerItem>
            {checkIn ? (
              <Card className="flex items-center gap-4 p-4">
                <EmotionFace emotion={checkIn.emotion} className="size-14 shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-xs font-semibold text-muted">Você chegou com · {formatMoment(checkIn.created_at, now)}</p>
                  <p className="type-display text-[24px] text-ink">{getEmotion(checkIn.emotion).label}</p>
                  {checkIn.note ? (
                    <p className="line-clamp-2 text-sm leading-5 text-text-soft [overflow-wrap:anywhere]">“{checkIn.note}”</p>
                  ) : null}
                </div>
                <Link
                  href="/check-in"
                  transitionTypes={["nav-tab"]}
                  aria-label="Fazer um novo check-in"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-sunken text-ink hover:rotate-[-30deg] hover:bg-sky-100"
                >
                  <RefreshCcw className="size-4" aria-hidden />
                </Link>
              </Card>
            ) : (
              <Card className="flex flex-col gap-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {(["paz", "ansiedade", "cansaco"] as const).map((item) => (
                      <EmotionFace key={item} emotion={item} className="size-10 rounded-full ring-2 ring-white" />
                    ))}
                  </div>
                  <p className="text-[15px] font-semibold text-ink">Você ainda não fez o check-in de hoje.</p>
                </div>
                <ButtonLink href="/check-in" transitionTypes={["nav-tab"]} size="lg">
                  Fazer check-in
                  <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
              </Card>
            )}
          </StaggerItem>

          {practice ? (
            <StaggerItem>
              <article
                className="relative overflow-hidden rounded-card border border-white/70 p-6 shadow-lift"
                style={{ background: tone.surface }}
              >
                <KeyMark aria-hidden className="pointer-events-none absolute -top-4 -right-6 h-48 w-auto opacity-25" />
                <div className="relative flex flex-col gap-3">
                  <p className="eyebrow" style={{ color: tone.ink }}>
                    Sua chave de hoje
                  </p>
                  <h2 className="type-display text-[32px] text-ink">{practice.key_title}</h2>
                  <p className="text-[15px] leading-6 text-text-soft">{practice.key_message}</p>
                  <p className="flex items-center gap-2 pt-1 text-xs font-semibold text-text-soft">
                    <Sparkles className="size-3.5" aria-hidden />
                    {PRACTICE_KIND_LABEL[practice.kind]} · {practice.duration_minutes} min · {practice.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <ButtonLink
                      href={`/hoje/pratica/${practice.slug}`}
                      transitionTypes={["nav-forward"]}
                      className="shadow-lift"
                    >
                      {practiceDoneToday ? "Rever prática" : "Ver prática de hoje"}
                      <ArrowRight className="size-4" aria-hidden />
                    </ButtonLink>
                    {practiceDoneToday ? (
                      <span className="rounded-full bg-success-bg px-3 py-1.5 text-xs font-bold text-success">Feita hoje</span>
                    ) : null}
                  </div>
                  {!emotion ? (
                    <p className="text-xs text-text-soft">Faça o check-in para receber uma prática pensada para o seu momento.</p>
                  ) : null}
                </div>
              </article>
            </StaggerItem>
          ) : null}

          {suggestedPlan ? (
            <StaggerItem>
              <Link
                href={`/planos/${suggestedPlan.slug}`}
                transitionTypes={["nav-forward"]}
                className="group block rounded-card"
              >
                <Card className="flex items-center gap-4 p-4 group-hover:-translate-y-0.5 group-hover:shadow-lift">
                  <span
                    aria-hidden
                    className="size-16 shrink-0 rounded-2xl transition-transform duration-[600ms] ease-out-expo group-hover:scale-105"
                    style={{ background: planPalette(suggestedPlan.palette) }}
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="eyebrow text-lav-700">Um plano para este momento</span>
                    <span className="text-[17px] font-bold text-ink">{suggestedPlan.title}</span>
                    <span className="flex items-center gap-3 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="size-3.5" aria-hidden /> {suggestedPlan.progress.totalDays} dias
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" aria-hidden /> {suggestedPlan.minutes_per_day}
                      </span>
                    </span>
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-muted group-hover:translate-x-1 group-hover:text-ink" aria-hidden />
                </Card>
              </Link>
            </StaggerItem>
          ) : null}

          {inProgress.length > 0 ? (
            <StaggerItem className="flex flex-col gap-3">
              <h2 className="pt-2 text-[17px] font-bold text-ink">Continue sua jornada</h2>
              {inProgress.map((plan) => (
                <Link
                  key={plan.slug}
                  href={`/planos/${plan.slug}`}
                  transitionTypes={["nav-forward"]}
                  className="group block rounded-card"
                >
                  <Card className="flex flex-col gap-3 p-4 group-hover:-translate-y-0.5 group-hover:shadow-lift">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-bold text-ink">{plan.title}</span>
                      <span className="tabular shrink-0 text-xs font-semibold text-muted">
                        Dia {plan.progress.completedDays} de {plan.progress.totalDays}
                      </span>
                    </div>
                    <ProgressBar percent={plan.progress.percent} label={`Progresso em ${plan.title}`} />
                  </Card>
                </Link>
              ))}
            </StaggerItem>
          ) : null}

          <StaggerItem className="flex justify-center pt-2">
            <DemoBadge />
          </StaggerItem>
        </Stagger>
      </section>
      <FlashToast key={flash ?? "none"} message={flash} />
    </PageTransition>
  );
}
