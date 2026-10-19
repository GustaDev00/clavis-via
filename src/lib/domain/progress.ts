export type PlanDayLike = { id: string; day_number: number };
export type DayCompletionLike = { plan_day_id: string; completed_at: string };

export type DayStatus = "done" | "available" | "locked";

export type PlanProgress = {
  totalDays: number;
  completedDays: number;
  /** 0–100 */
  percent: number;
  isStarted: boolean;
  isComplete: boolean;
  /** Próximo dia a fazer (null quando o plano foi concluído) */
  nextDayNumber: number | null;
  statusByDay: ReadonlyMap<number, DayStatus>;
};

/**
 * Calcula o progresso de um plano a partir dos dias e das conclusões do usuário.
 * Os dias são sequenciais: só o primeiro dia ainda não concluído fica disponível.
 * (O banco reforça a mesma regra com um trigger.)
 */
export function computePlanProgress(
  days: readonly PlanDayLike[],
  completions: readonly DayCompletionLike[],
  isEnrolled: boolean,
): PlanProgress {
  const ordered = [...days].sort((a, b) => a.day_number - b.day_number);
  const doneIds = new Set(completions.map((completion) => completion.plan_day_id));

  const statusByDay = new Map<number, DayStatus>();
  let nextDayNumber: number | null = null;

  for (const day of ordered) {
    if (doneIds.has(day.id)) {
      statusByDay.set(day.day_number, "done");
    } else if (nextDayNumber === null) {
      nextDayNumber = day.day_number;
      statusByDay.set(day.day_number, "available");
    } else {
      statusByDay.set(day.day_number, "locked");
    }
  }

  const totalDays = ordered.length;
  const completedDays = ordered.filter((day) => doneIds.has(day.id)).length;

  return {
    totalDays,
    completedDays,
    percent: totalDays === 0 ? 0 : Math.round((completedDays / totalDays) * 100),
    isStarted: isEnrolled || completedDays > 0,
    isComplete: totalDays > 0 && completedDays === totalDays,
    nextDayNumber,
    statusByDay,
  };
}
