"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/dal/viewer";
import { errorState, GENERIC_ERROR, logActionError, SESSION_ERROR, type FormState } from "@/lib/actions/state";

/**
 * Apaga os registros do visitante (check-ins, práticas, planos) mantendo a sessão.
 * `reset_my_demo()` é uma função SQL SECURITY INVOKER: roda numa única transação
 * (sem estado parcial se algo falhar) e com o RLS do próprio usuário.
 */
export async function resetDemo(previous: FormState): Promise<FormState> {
  const viewer = await getViewer();
  if (!viewer) return errorState(previous, { message: SESSION_ERROR });

  const supabase = await createClient();
  const { error } = await supabase.rpc("reset_my_demo");
  if (error) {
    logActionError("[resetDemo]", error);
    return errorState(previous, { message: GENERIC_ERROR });
  }

  redirect("/check-in?reiniciado=1");
}
