// Gera o .env.local a partir do Supabase local em execução (pnpm db:start).
// Uso: pnpm db:env
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const output = execFileSync("supabase", ["status", "-o", "env"], { encoding: "utf8" });
const env = Object.fromEntries(
  output
    .split("\n")
    .filter((line) => line.includes("="))
    .map((line) => {
      const [key, ...rest] = line.split("=");
      return [key.trim(), rest.join("=").trim().replace(/^"|"$/g, "")];
    }),
);

if (!env.API_URL || !env.PUBLISHABLE_KEY) {
  console.error("Supabase local não encontrado. Rode `pnpm db:start` primeiro.");
  process.exit(1);
}

writeFileSync(
  ".env.local",
  [
    "# Gerado por `pnpm db:env` a partir do Supabase local. Valores públicos de desenvolvimento.",
    `NEXT_PUBLIC_SUPABASE_URL=${env.API_URL}`,
    `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${env.PUBLISHABLE_KEY}`,
    "",
  ].join("\n"),
);
console.log(".env.local escrito apontando para", env.API_URL);
