import { HeartHandshake, Sun, Footprints } from "lucide-react";
import { Intro } from "./intro";
import { EnterDemoForm } from "./enter-demo-form";

const PILLARS = [
  { Icon: HeartHandshake, title: "Check-in", text: "Como você chega hoje" },
  { Icon: Sun, title: "Prática do dia", text: "Pensada para o seu momento" },
  { Icon: Footprints, title: "Sua jornada", text: "Planos e progresso" },
];

/**
 * Entrada: proposta do produto + acesso como visitante de demonstração.
 * Ocupa exatamente a altura visível do aparelho (100dvh), sem scroll; as medidas
 * são fluidas pela altura. Abaixo de 540px (celular deitado) a página rola.
 */
export default function EntryPage() {
  return (
    <main className="mx-auto flex h-dvh min-h-[540px] w-full max-w-[var(--app-max)] flex-col px-6 pt-[max(env(safe-area-inset-top),clamp(12px,3dvh,40px))] pb-[max(env(safe-area-inset-bottom),clamp(12px,2.5dvh,28px))]">
      <Intro
        pillars={PILLARS.map(({ Icon, title, text }) => (
          <li key={title} data-intro-pillar className="flex flex-col items-center gap-1.5 text-center">
            <span className="grid size-[clamp(36px,5.4dvh,46px)] place-items-center rounded-2xl bg-surface/80 text-lav-700 shadow-soft">
              <Icon className="size-[45%]" aria-hidden />
            </span>
            <span className="text-[13px] leading-4 font-bold text-ink">{title}</span>
            <span className="hidden text-xs leading-4 text-text-soft tall:block">{text}</span>
          </li>
        ))}
      >
        <EnterDemoForm />
      </Intro>
    </main>
  );
}
