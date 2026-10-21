"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/dal/viewer";
import { enterDemoSchema, toFieldErrors } from "@/lib/domain/validation";
import { errorState, GENERIC_ERROR, logActionError, type FormState } from "@/lib/actions/state";

export type EnterDemoField = "displayName";

/**
 * "Entrar como demo": cria um usuário anônimo no Supabase Auth (um por navegador)
 * e o perfil com o nome escolhido. Cada visitante tem seus próprios dados, isolados por RLS.
 */
export async function enterDemo(
  previous: FormState<EnterDemoField>,
  formData: FormData,
): Promise<FormState<EnterDemoField>> {
  const parsed = enterDemoSchema.safeParse({ displayName: formData.get("displayName") });
  if (!parsed.success) {
    return errorState(previous, { fieldErrors: toFieldErrors<EnterDemoField>(parsed.error) });
  }

  const supabase = await createClient();

  // Já existe sessão (ex.: dois cliques): só segue para o app.
  const existing = await getViewer();
  if (existing?.hasProfile) redirect("/check-in");
  if (existing) {
    // Cookie válido sem perfil (banco reiniciado, conta apagada): recria o perfil com o nome
    // informado; se o usuário não existir mais na Auth, encerra a sessão e começa do zero.
    const { error } = await supabase.from("profiles").insert({ id: existing.id, display_name: parsed.data.displayName });
    if (!error) redirect("/check-in");
    await supabase.auth.signOut();
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) {
    logActionError("[enterDemo] signInAnonymously", error);
    const message =
      error?.status === 429
        ? "Muitas entradas de demonstração em sequência. Aguarde alguns minutos e tente de novo."
        : "Não conseguimos abrir sua sessão de demonstração agora. Tente novamente.";
    return errorState(previous, { message });
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: data.user.id, display_name: parsed.data.displayName });

  if (profileError) {
    logActionError("[enterDemo] profile insert", profileError);
    await supabase.auth.signOut();
    return errorState(previous, { message: GENERIC_ERROR });
  }

  redirect("/check-in");
}

/**
 * "Sair": para um visitante anônimo não existe "voltar depois", então sair é apagar.
 * A função `delete_my_account()` remove o usuário da Auth e, em cascata, perfil, check-ins,
 * práticas e progresso (direito de eliminação). Depois encerra a sessão.
 */
export async function signOut(previous: FormState): Promise<FormState> {
  const supabase = await createClient();
  const viewer = await getViewer();

  if (viewer?.isAnonymous) {
    const { error } = await supabase.rpc("delete_my_account");
    if (error) {
      logActionError("[signOut] delete_my_account", error);
      return errorState(previous, { message: GENERIC_ERROR });
    }
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    logActionError("[signOut]", error);
    return errorState(previous, { message: GENERIC_ERROR });
  }
  redirect("/");
}
