"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/dal/viewer";
import { completePlanDaySchema, toFieldErrors } from "@/lib/domain/validation";
import { errorState, GENERIC_ERROR, logActionError, SESSION_ERROR, type FormState } from "@/lib/actions/state";

const slugSchema = z.string().min(1).max(80);

/** Inscreve no plano (idempotente) e leva ao primeiro dia disponível. */
export async function startPlan(previous: FormState, formData: FormData): Promise<FormState> {
  const viewer = await getViewer();
  if (!viewer) return errorState(previous, { message: SESSION_ERROR });

  const slug = slugSchema.safeParse(formData.get("planSlug"));
  if (!slug.success) return errorState(previous, { message: GENERIC_ERROR });

  const supabase = await createClient();
  const { data: plan } = await supabase.from("plans").select("id").eq("slug", slug.data).maybeSingle();
  if (!plan) return errorState(previous, { message: "Esse plano não está mais disponível." });

  const { error } = await supabase.from("plan_enrollments").insert({ plan_id: plan.id });
  // 23505 = já inscrito: segue normalmente
  if (error && error.code !== "23505") {
    logActionError("[startPlan]", error);
    return errorState(previous, { message: GENERIC_ERROR });
  }

  redirect(`/planos/${slug.data}/dia/1`);
}

export type PlanDayField = "reflection";

export async function completePlanDay(
  previous: FormState<PlanDayField>,
  formData: FormData,
): Promise<FormState<PlanDayField>> {
  const viewer = await getViewer();
  if (!viewer) return errorState(previous, { message: SESSION_ERROR });

  const parsed = completePlanDaySchema.safeParse({
    planSlug: formData.get("planSlug"),
    dayNumber: formData.get("dayNumber"),
    reflection: formData.get("reflection"),
  });
  if (!parsed.success) {
    return errorState(previous, { fieldErrors: toFieldErrors<PlanDayField>(parsed.error) });
  }

  const { planSlug, dayNumber, reflection } = parsed.data;
  const supabase = await createClient();

  const { data: plan } = await supabase
    .from("plans")
    .select("id, plan_days(id, day_number)")
    .eq("slug", planSlug)
    .eq("plan_days.day_number", dayNumber)
    .maybeSingle();
  const day = plan?.plan_days[0];
  if (!plan || !day) return errorState(previous, { message: "Não encontramos esse dia do plano." });

  // Garante a inscrição (quem abre o dia por link direto também pode concluir)
  const enrollment = await supabase.from("plan_enrollments").insert({ plan_id: plan.id });
  if (enrollment.error && enrollment.error.code !== "23505") {
    logActionError("[completePlanDay] enrollment", enrollment.error);
    return errorState(previous, { message: GENERIC_ERROR });
  }

  const { error } = await supabase
    .from("plan_day_completions")
    .insert({ plan_id: plan.id, plan_day_id: day.id, reflection });

  if (error) {
    // 23505 = dia já concluído (ex.: duplo clique): tratamos como sucesso
    if (error.code !== "23505") {
      if (error.code === "P0001" && error.hint === "previous_day_required") {
        return errorState(previous, { message: `Conclua o dia ${dayNumber - 1} antes de seguir para este.` });
      }
      logActionError("[completePlanDay]", error);
      return errorState(previous, { message: GENERIC_ERROR });
    }
  }

  redirect(`/planos/${planSlug}?concluido=${dayNumber}`);
}
