import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Viewer = {
  id: string;
  displayName: string;
  isAnonymous: boolean;
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
  };
});

/** Para páginas e actions que exigem sessão: sem usuário, volta para a Entrada. */
export async function requireViewer(): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer) redirect("/");
  return viewer;
}
