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

/**
 * Flags dos cookies de sessão. A biblioteca @supabase/ssr usa httpOnly: false por padrão
 * (para o cliente do navegador ler a sessão), mas este app só acessa a sessão no servidor:
 * - httpOnly: um XSS não consegue ler o token;
 * - secure em produção (localmente o dev roda em http);
 * - sameSite=lax: o cookie não acompanha requisições iniciadas por outros sites.
 */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
} as const;

/**
 * Validade do cookie: 30 dias desde o último uso (a biblioteca impõe 400 dias e ignora
 * um maxAge customizado, então o limite é aplicado na hora de gravar).
 * O token em si continua sendo renovado e validado pela Supabase Auth.
 */
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export function capSessionCookie<T extends { maxAge?: number }>(options: T): T {
  // maxAge 0 é remoção: não mexer
  if (!options.maxAge || options.maxAge <= SESSION_MAX_AGE_SECONDS) return options;
  return { ...options, maxAge: SESSION_MAX_AGE_SECONDS };
}
