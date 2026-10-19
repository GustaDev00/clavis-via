import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import { computePlanProgress, type PlanProgress } from "@/lib/domain/progress";
import { getPlansWithDays, type PlanWithDays } from "./content";
import { requireViewer } from "./viewer";

export type DayCompletion = Pick<
  Tables<"plan_day_completions">,
  "plan_id" | "plan_day_id" | "reflection" | "completed_at"
>;

export type PlanWithProgress = PlanWithDays & {
  progress: PlanProgress;
  startedAt: string | null;
  completions: DayCompletion[];
};

/** Planos + inscrições + dias concluídos do usuário, combinados em memória. */
export const getPlansWithProgress = cache(async (): Promise<PlanWithProgress[]> => {
  const viewer = await requireViewer();
  const supabase = await createClient();

  const [plans, enrollments, completions] = await Promise.all([
    getPlansWithDays(),
    supabase.from("plan_enrollments").select("plan_id, started_at").eq("user_id", viewer.id),
    supabase
      .from("plan_day_completions")
      .select("plan_id, plan_day_id, reflection, completed_at")
      .eq("user_id", viewer.id)
      .order("completed_at"),
  ]);

  if (enrollments.error || completions.error) {
    throw new Error("Não foi possível carregar seu progresso.", {
      cause: enrollments.error ?? completions.error,
    });
  }

  return plans.map((plan) => {
    const enrollment = enrollments.data.find((row) => row.plan_id === plan.id);
    const planCompletions = completions.data.filter((row) => row.plan_id === plan.id);
    return {
      ...plan,
      progress: computePlanProgress(plan.plan_days, planCompletions, Boolean(enrollment)),
      startedAt: enrollment?.started_at ?? null,
      completions: planCompletions,
    };
  });
});

export async function getPlanWithProgress(slug: string): Promise<PlanWithProgress | null> {
  const plans = await getPlansWithProgress();
  return plans.find((plan) => plan.slug === slug) ?? null;
}

export function progressBySlug(plans: readonly PlanWithProgress[]): Map<string, PlanProgress> {
  return new Map(plans.map((plan) => [plan.slug, plan.progress]));
}
