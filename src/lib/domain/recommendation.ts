import type { Emotion } from "./emotions";
import type { PlanProgress } from "./progress";

export type RecommendablePractice = {
  slug: string;
  emotions: readonly Emotion[];
  sort_order: number;
};

export type RecommendablePlan = {
  slug: string;
  emotions: readonly Emotion[];
  sort_order: number;
};

/** Prática exibida quando nenhuma outra combina com a emoção (ou não há check-in). */
export const FALLBACK_PRACTICE_SLUG = "minuto-de-presenca";

/**
 * Escolhe a prática do dia para uma emoção.
 *
 * - Só considera práticas marcadas para aquela emoção.
 * - Quando há mais de uma, alterna entre elas a cada dia, de forma determinística:
 *   o mesmo dia + emoção sempre resulta na mesma prática (recarregar a página não "sorteia" outra).
 */
export function pickPractice<T extends RecommendablePractice>(
  practices: readonly T[],
  emotion: Emotion | null,
  dayKey: string,
): T | null {
  if (practices.length === 0) return null;

  const fallback =
    practices.find((practice) => practice.slug === FALLBACK_PRACTICE_SLUG) ?? sortByOrder(practices)[0];

  if (!emotion) return fallback;

  const candidates = sortByOrder(practices.filter((practice) => practice.emotions.includes(emotion)));
  if (candidates.length === 0) return fallback;

  return candidates[stableHash(`${dayKey}:${emotion}`) % candidates.length];
}

/**
 * Sugere um plano coerente com a emoção, priorizando o que a pessoa já começou e não terminou.
 * Planos concluídos não são sugeridos.
 */
export function pickPlan<T extends RecommendablePlan>(
  plans: readonly T[],
  emotion: Emotion | null,
  progressBySlug: ReadonlyMap<string, PlanProgress>,
): T | null {
  if (!emotion) return null;

  const candidates = sortByOrder(plans.filter((plan) => plan.emotions.includes(emotion))).filter(
    (plan) => !progressBySlug.get(plan.slug)?.isComplete,
  );

  const inProgress = candidates.find((plan) => progressBySlug.get(plan.slug)?.isStarted);
  return inProgress ?? candidates[0] ?? null;
}

function sortByOrder<T extends { sort_order: number }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => a.sort_order - b.sort_order);
}

/** Hash FNV-1a de 32 bits: rápido, estável e suficiente para distribuir escolhas. */
export function stableHash(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index++) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
