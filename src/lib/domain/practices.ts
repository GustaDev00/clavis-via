import type { Database } from "@/lib/supabase/database.types";

export type PracticeKind = Database["public"]["Enums"]["practice_kind"];

export const PRACTICE_KIND_LABEL: Record<PracticeKind, string> = {
  respiracao: "Respiração",
  corpo: "Corpo",
  escrita: "Escrita",
  pausa: "Pausa",
  gratidao: "Gratidão",
  contemplacao: "Contemplação",
};

export type BreathPhase = { key: "inspire" | "segure" | "solte" | "descanse"; label: string; seconds: number };

const PHASES: Omit<BreathPhase, "seconds">[] = [
  { key: "inspire", label: "Inspire" },
  { key: "segure", label: "Segure" },
  { key: "solte", label: "Solte" },
  { key: "descanse", label: "Descanse" },
];

/** Converte o ritmo [inspira, segura, solta, descansa] em fases, ignorando tempos zerados. */
export function breathPhases(pattern: readonly number[] | null): BreathPhase[] {
  if (!pattern || pattern.length !== 4) return [];
  return PHASES.map((phase, index) => ({ ...phase, seconds: pattern[index] })).filter((phase) => phase.seconds > 0);
}

export const THEME_LABEL: Record<string, string> = {
  emocoes: "Emoções",
  limites: "Limites",
  recomeco: "Recomeço",
  fe: "Fé",
};
