import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Viewer = {
  id: string;
  displayName: string;
  isAnonymous: boolean;
  /** false = cookie válido, mas o perfil não existe mais (banco reiniciado ou conta apagada) */
  hasProfile: boolean;
};

/**
 * Data Access Layer: único ponto que transforma o cookie de sessão em um usuário.
 * `getClaims` valida a assinatura do JWT (nunca confiar em getSession no servidor).
 * Memoizado por requisição com `cache`.
 */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();

  return {
    id: userId,
    displayName: profile?.display_name ?? "Visitante",
    isAnonymous: data.claims.is_anonymous === true,
    hasProfile: Boolean(profile),
  };
});

/**
 * Para páginas que exigem sessão: sem usuário, volta para a Entrada.
 * Sessão órfã (cookie válido sem perfil): sai pela rota /auth/reset, que limpa o cookie —
 * um Server Component não pode fazer isso sozinho, e devolver null aqui criaria um
 * loop com o proxy (que só olha o JWT).
 */
export async function requireViewer(): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer) redirect("/");
  if (!viewer.hasProfile) redirect("/auth/reset");
  return viewer;
}
