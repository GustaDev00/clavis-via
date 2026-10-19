import { useId } from "react";
import { getEmotion, type Emotion } from "@/lib/domain/emotions";
import { cn } from "@/lib/cn";
import { TONES } from "./tones";

/** Expressões desenhadas à mão em um grid de 48×48. */
const FEATURES: Record<Emotion, React.ReactNode> = {
  ansiedade: (
    <>
      <path d="M14 18 L20 15" />
      <path d="M34 18 L28 15" />
      <circle cx="18.5" cy="23" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="29.5" cy="23" r="1.7" fill="currentColor" stroke="none" />
      <path d="M16.5 33 q2.4 -2.2 4.8 0 t4.8 0 t4.8 0" />
    </>
  ),
  cansaco: (
    <>
      <path d="M14.5 23 q3.5 2.6 7 0" />
      <path d="M26.5 23 q3.5 2.6 7 0" />
      <path d="M20 32.5 h8" />
    </>
  ),
  desanimo: (
    <>
      <path d="M14.5 19 L20 17" />
      <path d="M33.5 19 L28 17" />
      <circle cx="18.5" cy="24" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="29.5" cy="24" r="1.7" fill="currentColor" stroke="none" />
      <path d="M18 34 q6 -4.5 12 0" />
    </>
  ),
  irritacao: (
    <>
      <path d="M14 16 L20.5 19" />
      <path d="M34 16 L27.5 19" />
      <circle cx="18.5" cy="23.5" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="29.5" cy="23.5" r="1.7" fill="currentColor" stroke="none" />
      <path d="M18 33.5 q6 -3 12 0" />
    </>
  ),
  sensibilidade: (
    <>
      <circle cx="13.5" cy="28.5" r="3" fill="#f8bbcb" stroke="none" opacity="0.8" />
      <circle cx="34.5" cy="28.5" r="3" fill="#f8bbcb" stroke="none" opacity="0.8" />
      <circle cx="18.5" cy="23" r="1.7" fill="currentColor" stroke="none" />
      <circle cx="29.5" cy="23" r="1.7" fill="currentColor" stroke="none" />
      <path d="M31.6 26.2 q-1.8 2.6 0 3.9 q1.8 -1.3 0 -3.9 z" fill="#7fa3d9" stroke="none" />
      <path d="M19.5 32.5 q4.5 -2.6 9 0" />
    </>
  ),
  paz: (
    <>
      <path d="M15 23.5 q3 -3 6 0" />
      <path d="M27 23.5 q3 -3 6 0" />
      <path d="M17.5 30 q6.5 5.5 13 0" />
    </>
  ),
  esperanca: (
    <>
      <circle cx="18.5" cy="22.5" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="29.5" cy="22.5" r="1.8" fill="currentColor" stroke="none" />
      <path d="M18 30 q6 5 12 0" />
      <path d="M38 8 l0.9 2.6 2.6 0.9 -2.6 0.9 -0.9 2.6 -0.9 -2.6 -2.6 -0.9 2.6 -0.9 z" fill="#8e7fd0" stroke="none" />
    </>
  ),
  outro: (
    <>
      <circle cx="16" cy="24" r="2" fill="currentColor" stroke="none" />
      <circle cx="24" cy="24" r="2" fill="currentColor" stroke="none" />
      <circle cx="32" cy="24" r="2" fill="currentColor" stroke="none" />
    </>
  ),
};

export function EmotionFace({ emotion, className }: { emotion: Emotion; className?: string }) {
  const tone = TONES[getEmotion(emotion).tone];
  const gradientId = `face-${useId()}`;

  return (
    <svg viewBox="0 0 48 48" aria-hidden className={cn("size-12 text-ink", className)}>
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor={tone.from} />
          <stop offset="1" stopColor={tone.to} />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill={`url(#${gradientId})`} />
      <circle cx="24" cy="24" r="21.5" fill="none" stroke="white" strokeOpacity="0.7" />
      <g fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.82}>
        {FEATURES[emotion]}
      </g>
    </svg>
  );
}
