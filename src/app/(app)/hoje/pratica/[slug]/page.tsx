import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { RevealHeading } from "@/components/motion/reveal-heading";
import { BackLink } from "@/components/nav/back-link";
import { Card, DemoBadge } from "@/components/ui/card";
import { getTodayCheckIn } from "@/lib/dal/check-ins";
import { getPracticeBySlug } from "@/lib/dal/content";
import { getRecentPracticeCompletions } from "@/lib/dal/practice-completions";
import { toDayKey } from "@/lib/domain/dates";
import { breathPhases, PRACTICE_KIND_LABEL } from "@/lib/domain/practices";
import { BreathingGuide } from "./breathing-guide";
import { CompletePracticeForm } from "./complete-practice-form";

export async function generateMetadata({ params }: PageProps<"/hoje/pratica/[slug]">): Promise<Metadata> {
  const practice = await getPracticeBySlug((await params).slug);
  return { title: practice?.title ?? "Prática" };
}

export default async function PracticePage({ params }: PageProps<"/hoje/pratica/[slug]">) {
  const { slug } = await params;
  const [practice, checkIn, completions] = await Promise.all([
    getPracticeBySlug(slug),
    getTodayCheckIn(),
    getRecentPracticeCompletions(20),
  ]);
  if (!practice) notFound();

  const todayKey = toDayKey(new Date());
  const doneToday = completions.some(
    (completion) => completion.practice?.slug === slug && toDayKey(new Date(completion.completed_at)) === todayKey,
  );
  const phases = breathPhases(practice.breath_pattern);

  return (
    <PageTransition>
      <section className="flex flex-col gap-6 pt-2">
        <BackLink href="/hoje" label="Hoje" />

        <header className="flex flex-col gap-3">
          <Reveal>
            <p className="eyebrow flex items-center gap-2 text-lav-700">
              Prática de hoje · {PRACTICE_KIND_LABEL[practice.kind]}
            </p>
          </Reveal>
          <RevealHeading className="type-display text-[40px] text-ink">{practice.title}</RevealHeading>
          <Reveal delay={0.2} className="flex flex-col gap-3">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-text-soft">
              <Clock className="size-4" aria-hidden /> {practice.duration_minutes} minutos
            </p>
            <p className="text-[15px] leading-6 text-text-soft">{practice.summary}</p>
          </Reveal>
        </header>

        {phases.length > 0 ? (
          <Reveal delay={0.35}>
            <Card className="px-4">
              <BreathingGuide phases={phases} />
            </Card>
          </Reveal>
        ) : null}

        <Stagger delay={0.45} className="flex flex-col gap-3">
          <StaggerItem>
            <h2 className="text-[17px] font-bold text-ink">Passo a passo</h2>
          </StaggerItem>
          <ol className="flex flex-col gap-3">
            {practice.steps.map((step, index) => (
              <StaggerItem key={step}>
                <li className="flex gap-3.5 rounded-2xl bg-surface/70 p-4 shadow-soft">
                  <span className="tabular grid size-8 shrink-0 place-items-center rounded-full bg-[image:var(--grad-aurora)] text-sm font-bold text-ink">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-[15px] leading-6 text-text">{step}</p>
                </li>
              </StaggerItem>
            ))}
          </ol>
          <StaggerItem className="flex justify-center pt-1">
            <DemoBadge />
          </StaggerItem>
        </Stagger>

        <Reveal delay={0.6}>
          <CompletePracticeForm practiceSlug={practice.slug} checkInId={checkIn?.id ?? null} doneToday={doneToday} />
        </Reveal>
      </section>
    </PageTransition>
  );
}
