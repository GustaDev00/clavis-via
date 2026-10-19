"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/dal/viewer";
import { errorState, GENERIC_ERROR, SESSION_ERROR, type FormState } from "@/lib/actions/state";

/**
 * Apaga os registros do visitante (check-ins, práticas, planos) mantendo a sessão.
 * O RLS garante que cada DELETE só alcança linhas do próprio usuário;
 * o filtro por user_id é explícito para deixar a intenção clara.
 */
export async function resetDemo(previous: FormState): Promise<FormState> {
  const viewer = await getViewer();
  if (!viewer) return errorState(previous, { message: SESSION_ERROR });

  const supabase = await createClient();
  const results = await Promise.all([
    supabase.from("practice_completions").delete().eq("user_id", viewer.id),
    // Apagar inscrições remove os dias concluídos em cascata
    supabase.from("plan_enrollments").delete().eq("user_id", viewer.id),
  ]);
  const checkIns = await supabase.from("check_ins").delete().eq("user_id", viewer.id);

  const failed = [...results, checkIns].find((result) => result.error);
  if (failed?.error) {
    console.error("[resetDemo]", failed.error);
    return errorState(previous, { message: GENERIC_ERROR });
  }

  redirect("/check-in?reiniciado=1");
}
