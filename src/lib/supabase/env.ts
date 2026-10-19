/**
 * Variáveis públicas do Supabase. A chave "publishable" é feita para ir ao navegador:
 * quem protege os dados é o RLS no banco, não o segredo da chave.
 * Chaves secretas (service role / secret) nunca são usadas por este app.
 */
export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (veja .env.example).",
    );
  }

  return { url, publishableKey };
}
