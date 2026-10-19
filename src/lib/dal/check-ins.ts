import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import { addDays, dayRange, toDayKey } from "@/lib/domain/dates";
import { requireViewer } from "./viewer";

export type CheckIn = Pick<Tables<"check_ins">, "id" | "emotion" | "note" | "created_at">;

const CHECK_IN_COLUMNS = "id, emotion, note, created_at";

/** Último check-in do dia civil atual (fuso de São Paulo), se houver. */
export const getTodayCheckIn = cache(async (now: Date = new Date()): Promise<CheckIn | null> => {
  const viewer = await requireViewer();
  const supabase = await createClient();
  const { start, end } = dayRange(now);

  const { data, error } = await supabase
    .from("check_ins")
    .select(CHECK_IN_COLUMNS)
    .eq("user_id", viewer.id)
    .gte("created_at", start.toISOString())
    .lt("created_at", end.toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error("Não foi possível carregar seu check-in de hoje.", { cause: error });
  return data;
});

/** Check-ins dos últimos `days` dias, do mais recente para o mais antigo. */
export const getCheckInsSince = cache(async (days: number, now: Date = new Date()): Promise<CheckIn[]> => {
  const viewer = await requireViewer();
  const supabase = await createClient();
  const { start } = dayRange(new Date(`${addDays(toDayKey(now), -(days - 1))}T12:00:00Z`));

  const { data, error } = await supabase
    .from("check_ins")
    .select(CHECK_IN_COLUMNS)
    .eq("user_id", viewer.id)
    .gte("created_at", start.toISOString())
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error("Não foi possível carregar seus check-ins.", { cause: error });
  return data;
});
