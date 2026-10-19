import { supabaseEnv } from "@/lib/supabase/env";

/**
 * Health check para monitoramento de disponibilidade (uptime).
 * Confirma que o app responde e que a Auth do Supabase está acessível.
 * Não expõe dados nem detalhes internos.
 */
export async function GET() {
  const startedAt = Date.now();
  try {
    const { url, publishableKey } = supabaseEnv();
    const response = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: publishableKey },
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    const ok = response.ok;
    return Response.json(
      { status: ok ? "ok" : "degraded", supabase: ok ? "ok" : "unavailable", latencyMs: Date.now() - startedAt },
      { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "degraded", supabase: "unreachable", latencyMs: Date.now() - startedAt },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
