import { motion } from "motion/react";
import { useRef, type KeyboardEvent } from "react";
import { Check } from "lucide-react";
import { EMOTIONS, type Emotion } from "@/lib/domain/emotions";
import { cn } from "@/lib/cn";
import { EASE, SPRING, STAGGER } from "@/lib/motion";
import { EmotionFace } from "./emotion-face";
import { TONES } from "./tones";

type Props = {
  value: Emotion | null;
  onChange: (emotion: Emotion) => void;
  invalid?: boolean;
  describedBy?: string;
  labelledBy: string;
};

/**
 * Grupo de rádio acessível (setas, Home/End) com o visual de tiles.
 * Seleção: o fundo da emoção entra por opacidade e um anel navy "viaja" até o tile escolhido.
 */
export function EmotionPicker({ value, onChange, invalid, describedBy, labelledBy }: Props) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = EMOTIONS.findIndex((emotion) => emotion.id === value);
  const focusableIndex = selectedIndex === -1 ? 0 : selectedIndex;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (event.key in keys) next = (focusableIndex + keys[event.key] + EMOTIONS.length) % EMOTIONS.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = EMOTIONS.length - 1;
    if (next === null) return;

    event.preventDefault();
    onChange(EMOTIONS[next].id);
    refs.current[next]?.focus();
  }

  return (
    <motion.div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      aria-required
      onKeyDown={handleKeyDown}
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: STAGGER.tiles, delayChildren: 0.25 } } }}
      className={cn(
        // Altura das linhas acompanha a altura da tela, com mínimo confortável para o toque
        "grid gap-[clamp(6px,1.2dvh,10px)] rounded-[30px] p-1",
        "grid-cols-2 grid-rows-[repeat(4,clamp(52px,8.4dvh,104px))]",
        "min-[360px]:grid-cols-6 min-[360px]:grid-rows-[repeat(3,clamp(56px,10.6dvh,124px))]",
        "transition-shadow duration-[var(--dur-meso)]",
        invalid && "shadow-[0_0_0_2px_rgb(201_80_108/0.45)]",
      )}
    >
      {EMOTIONS.map((emotion, index) => {
        const selected = emotion.id === value;
        const tone = TONES[emotion.tone];

        return (
          <motion.button
            key={emotion.id}
            ref={(element) => {
              refs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={index === focusableIndex ? 0 : -1}
            onClick={() => onChange(emotion.id)}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE.outSoft } },
            }}
            whileTap={{ scale: 0.96 }}
            className={cn(
              "group relative flex h-full flex-col items-center justify-center gap-[clamp(4px,0.9dvh,8px)] rounded-tile",
              "border border-white/80 bg-surface/75 px-1.5 text-center shadow-soft backdrop-blur",
              "hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-offset-2",
              // 3 por linha; a última linha (2 itens) fica centralizada
              "min-[360px]:col-span-2",
              index === 6 && "min-[360px]:col-start-2",
            )}
          >
            {/* Fundo da emoção: anima a opacidade da camada, nunca o gradiente */}
            <span
              aria-hidden
              className={cn(
                "absolute inset-0 rounded-tile opacity-0 transition-opacity duration-[var(--dur-meso)] ease-out-soft",
                selected ? "opacity-100" : "group-hover:opacity-40",
              )}
              style={{ background: tone.surface }}
            />

            {selected ? (
              <motion.span
                layoutId="emotion-ring"
                transition={SPRING.select}
                aria-hidden
                className="absolute -inset-px rounded-tile border-[1.5px] border-navy"
              />
            ) : null}

            <motion.span
              className="relative"
              animate={{ scale: selected ? 1.08 : 1, y: selected ? -2 : 0 }}
              transition={SPRING.select}
            >
              <EmotionFace emotion={emotion.id} className="size-[clamp(30px,5.6dvh,48px)]" />
              {selected ? (
                <motion.span
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={SPRING.pop}
                  className="absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full bg-navy text-white ring-2 ring-white"
                >
                  <Check className="size-3" strokeWidth={3.5} aria-hidden />
                </motion.span>
              ) : null}
            </motion.span>

            <span
              className={cn(
                "relative text-[13px] leading-4 font-semibold text-text-soft transition-colors duration-[var(--dur-meso)]",
                selected && "text-ink",
              )}
              style={selected ? { color: tone.ink } : undefined}
            >
              {emotion.label}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
