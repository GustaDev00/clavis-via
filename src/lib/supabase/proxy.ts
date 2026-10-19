import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";
import { supabaseEnv } from "./env";

/** Rotas acessíveis sem sessão. */
const PUBLIC_PATHS = new Set(["/"]);

/**
 * Renova o token da sessão a cada requisição e faz o redirecionamento otimista:
 * sem sessão → volta para a Entrada. A checagem definitiva acontece na DAL (lib/dal),
 * perto dos dados — o proxy é só a primeira camada.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = supabaseEnv();

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Não colocar código entre createServerClient e getClaims (recomendação da Supabase).
  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims?.sub);
  const { pathname } = request.nextUrl;

  // Server Actions são POST: deixamos passar e a própria action responde (sem redirecionar o POST).
  if (request.method !== "GET" && request.method !== "HEAD") {
    return response;
  }

  if (!isSignedIn && !PUBLIC_PATHS.has(pathname)) {
    return redirectPreservingCookies(request, response, "/");
  }

  if (isSignedIn && pathname === "/") {
    return redirectPreservingCookies(request, response, "/hoje");
  }

  return response;
}

function redirectPreservingCookies(request: NextRequest, response: NextResponse, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const redirect = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
