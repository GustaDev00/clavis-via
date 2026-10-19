/**
 * Linguagem de movimento compartilhada por CSS, Motion e GSAP.
 * Mesmos valores das variáveis --ease-* em globals.css.
 */

type Bezier = [number, number, number, number];

export const EASE = {
  /** Padrão: entradas de componentes, toasts, erros */
  outSoft: [0.22, 1, 0.36, 1],
  /** Títulos, progresso */
  outExpo: [0.19, 1, 0.22, 1],
  /** Mudanças de estado */
  inOutSoft: [0.4, 0, 0.1, 1],
  /** Saídas curtas */
  exit: [0.32, 0, 0.67, 0],
  /** Loops de respiração */
  sine: [0.37, 0, 0.63, 1],
} as const satisfies Record<string, Bezier>;

/** Durações em segundos */
export const DUR = {
  press: 0.11,
  micro: 0.18,
  meso: 0.32,
  exit: 0.2,
  macro: 0.56,
  reveal: 0.9,
} as const;

export const SPRING = {
  press: { type: "spring", visualDuration: 0.2, bounce: 0.25 },
  select: { type: "spring", visualDuration: 0.38, bounce: 0.18 },
  pop: { type: "spring", visualDuration: 0.45, bounce: 0.35 },
  sheet: { type: "spring", visualDuration: 0.45, bounce: 0.08 },
} as const;

export const STAGGER = {
  chars: 0.015,
  words: 0.04,
  lines: 0.08,
  items: 0.06,
  tiles: 0.04,
} as const;

/** Entrada padrão: opacidade + subida curta. Nunca aparece do zero. */
export const riseIn = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: DUR.macro, ease: EASE.outSoft } },
} as const;

export function toCssBezier([a, b, c, d]: readonly number[]) {
  return `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
}
