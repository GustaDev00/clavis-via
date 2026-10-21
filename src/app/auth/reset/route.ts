import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Encerra uma sessão "órfã": o cookie ainda é válido, mas o usuário não tem mais perfil
 * (banco reiniciado, conta apagada). Server Components não podem limpar cookies,
 * então a DAL redireciona para cá; esta rota sai e volta para a Entrada.
 */
export async function GET() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
