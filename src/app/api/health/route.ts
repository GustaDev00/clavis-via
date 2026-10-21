import { supabaseEnv } from "@/lib/supabase/env";

/**
 * Health check para monitoramento de disponibilidade (uptime).
 * Confirma que o app responde e que a Auth do Supabase está acessível.
 * Não expõe dados nem detalhes internos.
 */
const CACHE_MS = 15_000;
let cached: { at: number; body: Record<string, unknown>; status: number } | null = null;

export async function GET() {
  // Resultado memoizado por instância: monitores batendo a cada poucos segundos não viram
  // uma chamada à Auth cada um.
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return Response.json(cached.body, { status: cached.status, headers: { "Cache-Control": "no-store" } });
  }
  const startedAt = Date.now();
  try {
    const { url, publishableKey } = supabaseEnv();
    const response = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: publishableKey },
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    const ok = response.ok;
    cached = {
      at: Date.now(),
      status: ok ? 200 : 503,
      body: { status: ok ? "ok" : "degraded", supabase: ok ? "ok" : "unavailable", latencyMs: Date.now() - startedAt },
    };
  } catch {
    cached = { at: Date.now(), status: 503, body: { status: "degraded", supabase: "unreachable", latencyMs: Date.now() - startedAt } };
  }
  return Response.json(cached.body, { status: cached.status, headers: { "Cache-Control": "no-store" } });
}
