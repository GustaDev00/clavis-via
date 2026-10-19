import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";
import { requireViewer } from "./viewer";

export type Practice = Tables<"practices">;
export type Plan = Tables<"plans">;
export type PlanDay = Tables<"plan_days">;
export type PlanWithDays = Plan & { plan_days: PlanDay[] };

/** Conteúdo editorial. RLS exige sessão, então a DAL também exige. */
export const getPractices = cache(async (): Promise<Practice[]> => {
  await requireViewer();
  const supabase = await createClient();
  const { data, error } = await supabase.from("practices").select("*").order("sort_order");
  if (error) throw new Error("Não foi possível carregar as práticas.", { cause: error });
  return data;
});

export const getPracticeBySlug = cache(async (slug: string): Promise<Practice | null> => {
  await requireViewer();
  const supabase = await createClient();
  const { data, error } = await supabase.from("practices").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error("Não foi possível carregar a prática.", { cause: error });
  return data;
});

export const getPlansWithDays = cache(async (): Promise<PlanWithDays[]> => {
  await requireViewer();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plans")
    .select("*, plan_days(*)")
    .order("sort_order")
    .order("day_number", { referencedTable: "plan_days" });
  if (error) throw new Error("Não foi possível carregar os planos.", { cause: error });
  return data;
});

export async function getPlanWithDays(slug: string): Promise<PlanWithDays | null> {
  const plans = await getPlansWithDays();
  return plans.find((plan) => plan.slug === slug) ?? null;
}
