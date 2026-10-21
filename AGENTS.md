<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Guia do repositório (para pessoas e agentes de IA)

> O bloco em inglês acima é gerado e mantido automaticamente pelo `next dev` (Next.js 16); o guia começa aqui.

Este é o protótipo **CLAVIS VIA**, entregue como desafio técnico: check-in emocional, prática do dia, planos temáticos e uma tela de jornada, com persistência real. Demo: https://clavis-via.vercel.app. Se você está **avaliando** o projeto, comece por [README.md](README.md) (como rodar, roteiro da demo, testes), depois [DECISOES.md](DECISOES.md) (arquitetura, modelagem, segurança/LGPD, operação, evolução, integrações, uso de IA) e [docs/seguranca.md](docs/seguranca.md) (o que protege os dados e o que faltaria para produção).

## Mapa do código

| Caminho | O que é |
|---|---|
| `src/proxy.ts` → `src/lib/supabase/proxy.ts` | Renova a sessão a cada requisição e redireciona quem não tem sessão (checagem otimista; a definitiva é na DAL) |
| `src/lib/supabase/` | Cliente Supabase do servidor (`server.ts`), variáveis e flags de cookie (`env.ts`), tipos gerados do banco (`database.types.ts`) |
| `src/lib/dal/` | **Data Access Layer**: único lugar que lê o banco. Toda função valida a sessão (`requireViewer`) antes da consulta |
| `src/lib/domain/` | Regras puras, sem framework: emoções, datas no fuso de São Paulo, recomendação por emoção, progresso dos planos, validação (Zod) |
| `src/app/actions.ts`, `src/app/(app)/**/actions.ts` | Server Actions (escritas). Cada uma revalida a sessão e a entrada; nunca confia no cliente |
| `src/app/(app)/` | Telas autenticadas: `check-in`, `hoje` (+ `pratica/[slug]`), `planos` (+ `[slug]`, `dia/[day]`), `jornada`; `layout.tsx` é a casca (cabeçalho no celular, barra lateral no tablet/desktop) |
| `src/app/page.tsx` + `intro.tsx` + `enter-demo-form.tsx` | Entrada (abertura animada e "Entrar como visitante demo") |
| `src/app/api/health/route.ts` | Health check para monitoramento; não expõe dados |
| `src/app/auth/reset/route.ts` | Encerra uma sessão órfã (cookie válido sem perfil) e volta para a Entrada |
| `scripts/db-env.mjs` | Gera o `.env.local` a partir do Supabase local |
| `src/components/ui/` | Botão, campos com erro animado, toast, diálogo de confirmação, barra de progresso, esqueleto |
| `src/components/emotions/` | Rostos SVG das emoções, seletor acessível (`radiogroup`), tons de cor |
| `src/components/ambient/` | Fundo vivo em WebGL (shader próprio) que muda de cor com a emoção; `palettes.ts` tem as cores |
| `src/components/motion/` | Linguagem de movimento: títulos revelados por linha (GSAP SplitText), entradas suaves (Motion), transições de rota (View Transitions) |
| `src/components/nav/app-nav.tsx` | Navegação única: pílula inferior no celular, barra lateral no tablet/desktop |
| `supabase/migrations/` | Schema + RLS (`*_init_schema.sql`), conteúdo de demonstração (`*_seed_content.sql`), endurecimento dos GRANTs (`*_harden_grants.sql`), exclusão de conta, reset atômico e privilégios de funções (`*_account_deletion_*.sql`) |
| `tests/unit/` | Regras de domínio e validação (Vitest) |
| `tests/integration/isolamento-rls.test.ts` | Visitantes reais no Supabase local tentando ler/alterar dados um do outro; exclusão de conta e reset |
| `tests/e2e/` | Playwright: fluxo do desafio com F5, validações, navegação, sessão e cookies, matriz de aparelhos, tablet/desktop, acessibilidade (axe) |

## Convenções

- Código em inglês; textos de interface, comentários, documentação e **nomes e descrições de testes** em português do Brasil.
- Validação em três camadas: Zod no formulário (feedback imediato), Zod na Server Action (fonte da verdade), `CHECK`/trigger no banco (última linha).
- O navegador **nunca** fala com o banco: só o servidor, com o JWT do próprio usuário, e o Postgres aplica o RLS. O app não usa a chave secreta (service role).
- Colunas como `user_id` e `created_at` vêm de defaults do banco (`auth.uid()`, `now()`) e não são graváveis pelo cliente (GRANT por coluna).
- Nada "pisca": todo estado (erro, salvamento, navegação, carregamento) tem transição; `prefers-reduced-motion` troca deslocamentos por fades.
- Mobile-first: telas de um gesto cabem na altura visível do aparelho (`screen-fit`, medidas em `dvh`); tablet/desktop a partir de `md` (768px).

## Comandos

```bash
pnpm install && pnpm db:start   # Supabase local em Docker (portas 553xx) + migrations
pnpm db:env && pnpm dev          # gera o .env.local a partir do Supabase local
pnpm test            # unitários
pnpm test:integration   # RLS, exclusão e reset contra o Supabase local
pnpm test:e2e        # Playwright (reaproveita o dev server)
pnpm test:all        # typecheck + lint + tudo acima
```

## O que é real e o que é demonstração

Real: sessão por visitante (usuário anônimo do Supabase Auth), check-ins, práticas concluídas, inscrições e dias concluídos no Postgres, isolamento por RLS testado. Demonstração: os textos das práticas e dos planos (fictícios e marcados na interface), o visitante anônimo no lugar de uma conta com e-mail. Não há IA no produto: a recomendação é uma regra determinística em `src/lib/domain/recommendation.ts`.

## Uso de IA no desenvolvimento

O desafio pede transparência e ela está no README ("Uso de IA e recursos externos") e no DECISOES.md (pergunta 7): o código foi escrito em par com o Claude Code; as decisões de produto, stack, design e escopo, e a validação nas telas, foram do autor. Os commits trazem o trailer `Co-Authored-By` correspondente.
