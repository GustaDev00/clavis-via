import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, RefreshCcw, Sparkles } from "lucide-react";
import { KeyMark } from "@/components/brand/key-mark";
import { EmotionFace } from "@/components/emotions/emotion-face";
import { AmbientTone } from "@/components/ambient/ambient-provider";
import { TONES, planPalette } from "@/components/emotions/tones";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FlashToast } from "@/components/ui/flash-toast";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getTodayCheckIn } from "@/lib/dal/check-ins";
import { getPractices } from "@/lib/dal/content";
import { getRecentPracticeCompletions } from "@/lib/dal/practice-completions";
import { getPlansWithProgress, progressBySlug } from "@/lib/dal/progress";
import { requireViewer } from "@/lib/dal/viewer";
import { APP_TIME_ZONE, formatMoment, greetingFor, toDayKey } from "@/lib/domain/dates";
import { getEmotion } from "@/lib/domain/emotions";
import { PRACTICE_KIND_LABEL } from "@/lib/domain/practices";
import { pickPlan, pickPractice } from "@/lib/domain/recommendation";

export const metadata: Metadata = { title: "Hoje" };

const FLASH: Record<string, string> = {
  "check-in": "Check-in salvo. Obrigado por se ouvir hoje.",
  pratica: "Prática registrada na sua jornada.",
};

/**
 * Painel do dia: cabe em uma tela no celular (screen-fit).
 * Check-in → "Sua chave de hoje" (estica para ocupar o espaço livre) → um único próximo passo de plano.
 */
export default async function TodayPage({ searchParams }: PageProps<"/hoje">) {
  const now = new Date();
  const todayKey = toDayKey(now);
  const [viewer, checkIn, practices, plans, completions, { salvo }] = await Promise.all([
    requireViewer(),
    getTodayCheckIn(now),
    getPractices(),
    getPlansWithProgress(),
    getRecentPracticeCompletions(20),
    searchParams,
  ]);

  const emotion = checkIn?.emotion ?? null;
  const practice = pickPractice(practices, emotion, todayKey);
  const practiceDoneToday = completions.some(
    (completion) => completion.practice?.slug === practice?.slug && toDayKey(new Date(completion.completed_at)) === todayKey,
  );

  // Um único próximo passo: o plano em andamento mais recente; sem nenhum, a sugestão para a emoção
  const inProgress = plans
    .filter((plan) => plan.progress.isStarted && !plan.progress.isComplete)
    .sort((a, b) => (b.startedAt ?? "").localeCompare(a.startedAt ?? ""));
  const nextPlan = inProgress[0] ?? pickPlan(plans, emotion, progressBySlug(plans));
  const isContinuing = Boolean(nextPlan && inProgress[0]?.slug === nextPlan.slug);

  const toneKey = emotion ? getEmotion(emotion).tone : "aurora";
  const tone = TONES[toneKey];
  const dateLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: APP_TIME_ZONE,
  }).format(now);
  const flash = typeof salvo === "string" ? (FLASH[salvo] ?? null) : null;
  // Cumprimenta pelo primeiro nome: mais próximo e cabe em uma linha mesmo com nomes longos
  const firstName = viewer.displayName.split(" ")[0];

  return (
    <PageTransition>
      <AmbientTone tone={toneKey} />
      {/* Faixa de luz no horizonte, na cor da emoção do dia (entre a aurora e o grão).
          Gradiente já suave: sem filter: blur, que custaria caro numa área desse tamanho. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-[6] h-[42dvh] opacity-80"
        style={{
          background: `radial-gradient(70% 60% at 20% 0%, ${tone.to} 0%, transparent 70%), radial-gradient(60% 55% at 80% 10%, #cfe0f5 0%, transparent 70%)`,
        }}
      />
      <section className="screen-fit gap-[clamp(10px,2dvh,20px)] pt-[clamp(2px,1dvh,10px)] lg:min-h-0">
        <header className="flex flex-col gap-[clamp(2px,0.8dvh,8px)]">
          <Reveal className="short:hidden">
            <p className="eyebrow text-lav-700">{dateLabel}</p>
          </Reveal>
          <RevealHeading className="type-display text-[clamp(26px,5.2dvh,40px)] text-ink [overflow-wrap:anywhere] lg:text-[52px]">
            {greetingFor(now)}, {firstName}
          </RevealHeading>
        </header>

        <Stagger delay={0.3} className="flex flex-1 flex-col gap-[clamp(8px,1.6dvh,16px)] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:grid-rows-[auto_1fr] lg:gap-6">
          <StaggerItem>
            {checkIn ? (
              <Card className="flex items-center gap-3.5 p-[clamp(10px,1.8dvh,16px)]">
                <EmotionFace emotion={checkIn.emotion} className="size-[clamp(40px,6.4dvh,56px)] shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-xs font-semibold text-muted">Você chegou com · {formatMoment(checkIn.created_at, now)}</p>
                  <p className="type-display text-[clamp(20px,3dvh,24px)] text-ink">{getEmotion(checkIn.emotion).label}</p>
                  {checkIn.note ? (
                    <p className="line-clamp-1 text-sm leading-5 text-text-soft [overflow-wrap:anywhere] xshort:hidden tall:line-clamp-2">
                      “{checkIn.note}”
                    </p>
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
              <Card className="flex items-center gap-3 p-[clamp(10px,1.8dvh,16px)]">
                <div className="flex shrink-0 -space-x-3">
                  {(["paz", "ansiedade", "cansaco"] as const).map((item) => (
                    <EmotionFace key={item} emotion={item} className="size-9 rounded-full ring-2 ring-white" />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-5 font-semibold text-ink">Você ainda não fez o check-in de hoje.</p>
                <ButtonLink href="/check-in" transitionTypes={["nav-tab"]} size="sm" className="shrink-0">
                  Fazer check-in
                </ButtonLink>
              </Card>
            )}
          </StaggerItem>

          {practice ? (
            <StaggerItem className="flex flex-1 flex-col lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <article
                className="relative flex flex-1 flex-col justify-between gap-[clamp(8px,2dvh,20px)] overflow-hidden rounded-card border border-white/70 p-[clamp(14px,2.8dvh,24px)] shadow-lift lg:min-h-[440px] lg:p-8"
                style={{ background: tone.surface }}
              >
                <KeyMark aria-hidden className="pointer-events-none absolute -top-4 -right-6 h-[clamp(120px,24dvh,200px)] w-auto opacity-25" />
                <div className="relative flex flex-col gap-[clamp(6px,1.2dvh,12px)]">
                  <p className="eyebrow flex items-center gap-2" style={{ color: tone.ink }}>
                    Sua chave de hoje
                    <span className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] tracking-wide text-lav-700 normal-case">
                      demonstração
                    </span>
                  </p>
                  <h2 className="type-display text-[clamp(26px,4.4dvh,34px)] text-ink lg:text-[44px]">{practice.key_title}</h2>
                  <p className="text-[15px] leading-6 text-text-soft short:line-clamp-3 xshort:line-clamp-2 xshort:text-[14px] xshort:leading-5 lg:text-[17px] lg:leading-7">{practice.key_message}</p>
                  <p className="flex items-center gap-2 text-xs font-semibold text-text-soft xshort:hidden">
                    <Sparkles className="size-3.5 shrink-0" aria-hidden />
                    {PRACTICE_KIND_LABEL[practice.kind]} · {practice.duration_minutes} min · {practice.title}
                  </p>
                </div>
                <div className="relative flex flex-wrap items-center gap-3">
                  <ButtonLink
                    href={`/hoje/pratica/${practice.slug}`}
                    transitionTypes={["nav-forward"]}
                    className="h-[clamp(44px,6.4dvh,52px)] shadow-lift"
                  >
                    {practiceDoneToday ? "Rever prática" : "Ver prática de hoje"}
                    <ArrowRight className="size-4" aria-hidden />
                  </ButtonLink>
                  {practiceDoneToday ? (
                    <span className="rounded-full bg-success-bg px-3 py-1.5 text-xs font-bold text-success">Feita hoje</span>
                  ) : null}
                </div>
              </article>
            </StaggerItem>
          ) : null}

          {nextPlan ? (
            <StaggerItem className="lg:col-start-1 lg:row-start-2 lg:self-start">
              <Link href={`/planos/${nextPlan.slug}`} transitionTypes={["nav-forward"]} className="group block rounded-card">
                <Card className="flex items-center gap-3.5 p-[clamp(8px,1.8dvh,16px)] group-hover:-translate-y-0.5 group-hover:shadow-lift">
                  <span
                    aria-hidden
                    className="size-[clamp(44px,7dvh,64px)] shrink-0 rounded-2xl transition-transform duration-[600ms] ease-out-expo group-hover:scale-105"
                    style={{ background: planPalette(nextPlan.palette) }}
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-[clamp(1px,0.5dvh,4px)]">
                    <span className="eyebrow text-lav-700">
                      {isContinuing ? "Continue sua jornada" : "Um plano para este momento"}
                    </span>
                    <span className="truncate text-[16px] font-bold text-ink">{nextPlan.title}</span>
                    {isContinuing ? (
                      <span className="flex items-center gap-2">
                        <ProgressBar percent={nextPlan.progress.percent} label={`Progresso em ${nextPlan.title}`} className="flex-1" />
                        <span className="tabular shrink-0 text-[11px] font-bold text-muted">
                          {nextPlan.progress.completedDays}/{nextPlan.progress.totalDays} dias
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-3 text-xs text-muted">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="size-3.5" aria-hidden /> {nextPlan.progress.totalDays} dias
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3.5" aria-hidden /> {nextPlan.minutes_per_day}
                        </span>
                      </span>
                    )}
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-muted group-hover:translate-x-1 group-hover:text-ink" aria-hidden />
                </Card>
              </Link>
            </StaggerItem>
          ) : null}
        </Stagger>
      </section>
      <FlashToast key={flash ?? "none"} message={flash} />
    </PageTransition>
  );
}
