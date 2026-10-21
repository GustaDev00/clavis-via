import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Database } from "./database.types";
import { capSessionCookie, SESSION_COOKIE_OPTIONS, supabaseEnv } from "./env";

/**
 * Cliente Supabase do lado do servidor, autenticado com a sessão do cookie.
 * Todas as consultas passam pelo RLS do Postgres com o JWT do próprio usuário.
 *
 * `cache` reaproveita o cliente dentro da MESMA requisição (nunca entre requisições).
 */
export const createClient = cache(async () => {
  const cookieStore = await cookies();
  const { url, publishableKey } = supabaseEnv();

  return createServerClient<Database>(url, publishableKey, {
    cookieOptions: SESSION_COOKIE_OPTIONS,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, capSessionCookie(options)));
        } catch {
          // Chamado a partir de um Server Component: o proxy.ts já renova a sessão.
        }
      },
    },
  });
});
