import { HeartHandshake, Sun, Footprints } from "lucide-react";
import { Intro } from "./intro";
import { EnterDemoForm } from "./enter-demo-form";

const PILLARS = [
  { Icon: HeartHandshake, title: "Check-in", text: "Diga como você está chegando, em um toque." },
  { Icon: Sun, title: "Prática do dia", text: "Uma reflexão e uma prática curta para esse momento." },
  { Icon: Footprints, title: "Sua jornada", text: "Planos temáticos e um olhar gentil sobre o caminho." },
];

/** Entrada: proposta do produto + acesso como visitante de demonstração. */
export default function EntryPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[var(--app-max)] flex-col px-6 pt-[max(env(safe-area-inset-top),40px)] pb-[max(env(safe-area-inset-bottom),28px)]">
      <Intro
        pillars={PILLARS.map(({ Icon, title, text }) => (
          <li key={title} data-intro-pillar className="flex items-start gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-surface/80 text-lav-700 shadow-soft">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[15px] font-bold text-ink">{title}</span>
              <span className="text-sm leading-5 text-text-soft">{text}</span>
            </span>
          </li>
        ))}
      >
        <EnterDemoForm />
      </Intro>
    </main>
  );
}
