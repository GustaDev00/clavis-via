import { addDays, lastDays, toDayKey, weekdayLabel, APP_TIME_ZONE } from "./dates";
import type { Emotion } from "./emotions";

export type CheckInLike = { emotion: Emotion; created_at: string };

export type WeekDay = {
  dayKey: string;
  label: string;
  isToday: boolean;
  /** Emoção do último check-in do dia, se houver */
  emotion: Emotion | null;
};

/**
 * Dias consecutivos com pelo menos um check-in.
 * A sequência continua viva se o último check-in foi hoje ou ontem
 * (ninguém perde a sequência só porque ainda não fez o check-in de hoje).
 */
export function computeStreak(
  checkIns: readonly CheckInLike[],
  todayKey: string,
  timeZone: string = APP_TIME_ZONE,
): number {
  const days = new Set(checkIns.map((checkIn) => toDayKey(new Date(checkIn.created_at), timeZone)));

  let cursor = days.has(todayKey) ? todayKey : addDays(todayKey, -1);
  let streak = 0;
  while (days.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Faixa dos últimos 7 dias com a emoção mais recente de cada dia. */
export function buildWeek(
  checkIns: readonly CheckInLike[],
  todayKey: string,
  timeZone: string = APP_TIME_ZONE,
): WeekDay[] {
  const latestByDay = new Map<string, CheckInLike>();
  for (const checkIn of checkIns) {
    const dayKey = toDayKey(new Date(checkIn.created_at), timeZone);
    const current = latestByDay.get(dayKey);
    if (!current || current.created_at < checkIn.created_at) latestByDay.set(dayKey, checkIn);
  }

  return lastDays(todayKey, 7).map((dayKey) => ({
    dayKey,
    label: weekdayLabel(dayKey),
    isToday: dayKey === todayKey,
    emotion: latestByDay.get(dayKey)?.emotion ?? null,
  }));
}
