// Localmente, lê o .env.local (Supabase local). No CI as variáveis já vêm do ambiente.
try {
  process.loadEnvFile(".env.local");
} catch {
  // arquivo ausente: segue com o ambiente atual
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("127.0.0.1")) {
  throw new Error("Os testes de integração rodam apenas contra o Supabase local (pnpm db:start).");
}
