"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/dal/viewer";
import { enterDemoSchema, toFieldErrors } from "@/lib/domain/validation";
import { errorState, GENERIC_ERROR, type FormState } from "@/lib/actions/state";

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
  if (await getViewer()) redirect("/check-in");

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) {
    console.error("[enterDemo] signInAnonymously", error);
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
    console.error("[enterDemo] profile insert", profileError);
    await supabase.auth.signOut();
    return errorState(previous, { message: GENERIC_ERROR });
  }

  redirect("/check-in");
}

/** Encerra a sessão. Para visitantes anônimos, os dados ficam inacessíveis depois disso. */
export async function signOut(previous: FormState): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("[signOut]", error);
    return errorState(previous, { message: GENERIC_ERROR });
  }
  redirect("/");
}
