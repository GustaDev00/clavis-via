"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Pause, Play } from "lucide-react";
import { useAmbient } from "@/components/ambient/ambient-provider";
import { Button } from "@/components/ui/button";
import type { BreathPhase } from "@/lib/domain/practices";
import { EASE } from "@/lib/motion";

/**
 * Respiração guiada: o círculo cresce ao inspirar, pausa ao segurar e encolhe ao soltar,
 * no ritmo da prática (ex.: 4-4-4-4). Uma timeline do GSAP em loop controla o tempo
 * e informa a fase atual para o rótulo.
 * Movimento reduzido: sem mudança de escala, só o brilho e o rótulo.
 */
export function BreathingGuide({ phases }: { phases: BreathPhase[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<BreathPhase | null>(null);
  const [cycles, setCycles] = useState(0);
  const { setBreath } = useAmbient();
  // Valor 0–1 animado pelo GSAP; a cada quadro alimenta a "respiração" do fundo
  const breath = useRef({ value: 0 });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // As duas condições são necessárias: o matchMedia só chama o callback quando alguma é verdadeira
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
        const reduce = Boolean(context.conditions?.reduce);
        const orb = "[data-orb]";
        const glow = "[data-glow]";
        const tl = gsap.timeline({
          paused: true,
          repeat: -1,
          onRepeat: () => setCycles((value) => value + 1),
        });

        for (const item of phases) {
          tl.call(() => setPhase(item));
          if (item.key === "inspire") {
            tl.to(orb, { scale: 1, duration: item.seconds, ease: "sine.inOut" }, "<");
            tl.to(glow, { opacity: 0.9, scale: reduce ? 1 : 1.15, duration: item.seconds, ease: "sine.inOut" }, "<");
            tl.to(breath.current, { value: 1, duration: item.seconds, ease: "sine.inOut", onUpdate: () => setBreath(breath.current.value) }, "<");
          } else if (item.key === "solte") {
            tl.to(orb, { scale: reduce ? 1 : 0.62, duration: item.seconds, ease: "sine.inOut" }, "<");
            tl.to(glow, { opacity: 0.35, scale: 1, duration: item.seconds, ease: "sine.inOut" }, "<");
            tl.to(breath.current, { value: 0, duration: item.seconds, ease: "sine.inOut", onUpdate: () => setBreath(breath.current.value) }, "<");
          } else {
            tl.to({}, { duration: item.seconds });
          }
        }

        gsap.set(orb, { scale: reduce ? 1 : 0.62 });
        timeline.current = tl;
        return () => {
          tl.kill();
          setBreath(0);
        };
      });
      return () => mm.revert();
    },
    { scope, dependencies: [phases, setBreath] },
  );

  // Só controla a timeline já criada no useGSAP (nenhuma animação nova nasce aqui)
  function toggle() {
    const tl = timeline.current;
    if (!tl) return;
    if (running) {
      tl.pause();
      setRunning(false);
    } else {
      tl.play();
      setRunning(true);
    }
  }

  return (
    <div ref={scope} className="flex flex-col items-center gap-6 py-4">
      <div className="relative grid size-64 place-items-center">
        <span
          data-glow
          aria-hidden
          className="absolute inset-0 rounded-full bg-[image:var(--grad-aurora)] opacity-35 blur-2xl"
        />
        <span
          data-orb
          aria-hidden
          className="absolute inset-4 rounded-full border border-white/80 bg-[radial-gradient(circle_at_35%_30%,#ffffff_0%,#e3ecf8_35%,#c6b9ec_100%)] shadow-float"
        />
        <div className="relative flex flex-col items-center gap-1 text-center" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={phase?.key ?? "pronto"}
              initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.36, ease: EASE.outSoft }}
              className="type-display text-[34px] text-ink"
            >
              {phase && running ? phase.label : running ? "…" : "Pronto?"}
            </motion.span>
          </AnimatePresence>
          <span className="tabular text-xs font-semibold text-text-soft">
            {phase && running ? `${phase.seconds} segundos` : phases.map((item) => item.seconds).join(" · ")}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button variant={running ? "outline" : "soft"} onClick={toggle} aria-pressed={running}>
          {running ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
          {running ? "Pausar" : cycles > 0 || phase ? "Continuar" : "Começar a respirar"}
        </Button>
        <p className="tabular h-4 text-xs text-muted">
          {cycles > 0 ? `${cycles} ${cycles === 1 ? "ciclo completo" : "ciclos completos"}` : ""}
        </p>
      </div>
    </div>
  );
}
