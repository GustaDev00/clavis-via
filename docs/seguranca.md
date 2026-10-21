# Segurança e privacidade

Resumo do que protege os dados neste protótipo, o que foi verificado e o que faltaria para um produto real. Complementa a pergunta 3 do [DECISOES.md](../DECISOES.md). Os registros de check-in são, em produção, **dado pessoal sensível de saúde** (LGPD, art. 5º, II), então o desenho parte do princípio de que cada pessoa só enxerga o que é dela.

## Modelo de ameaças considerado

| Ameaça | Como o protótipo responde |
|---|---|
| Um visitante ler ou alterar dados de outro | RLS em todas as tabelas com `auth.uid()`; GRANTs mínimos por coluna; testado com visitantes reais (`tests/integration/isolamento-rls.test.ts`) e em dois navegadores (`tests/e2e/isolamento-layout-a11y.spec.ts`) |
| Acesso sem sessão à Data API | O papel `anon` não tem nenhum GRANT: sem login, nem o conteúdo editorial é lido |
| Roubo do token de sessão por XSS | Cookie `httpOnly` (o JavaScript da página não o enxerga), `secure` em produção, `sameSite=lax`, validade de 30 dias; React escapa todo texto (testado com HTML digitado nos campos) |
| Requisições forjadas de outros sites (CSRF) | Server Actions do Next.js aceitam só a própria origem; cookie `sameSite=lax` |
| Entrada maliciosa ou fora do limite | Validação em três camadas: Zod no formulário, Zod na Server Action e `CHECK`/trigger/FK no Postgres |
| Gravar em nome de outra pessoa | `user_id` vem do default `auth.uid()` e não é gravável pelo cliente (sem GRANT de INSERT nessa coluna); testado |
| Chaves vazadas no repositório | O app só usa a chave *publishable* (pública por design); nenhuma chave secreta no código, `.env*` ignorado, `.env.example` sem valores reais |
| Clickjacking, sniffing de tipo, vazamento de referrer | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`; HSTS adicionado pela Vercel |
| Abuso da criação de visitantes anônimos | Limite da Supabase de 30 logins anônimos por hora por IP (padrão na nuvem); visitantes inativos há 30 dias são apagados por um job diário |
| Dados que ficam para sempre (LGPD, direito de eliminação) | "Sair" apaga a conta do visitante com tudo em cascata (`delete_my_account()`); "Reiniciar demo" apaga os registros numa transação (`reset_my_demo()`); sessão cujo usuário foi apagado é encerrada pela DAL (`/auth/reset`) |
| Funções do banco chamáveis pela API | `EXECUTE` revogado de `public`/`anon` em todas as funções (inclusive futuras); as existentes só rodam como `authenticated` e só alcançam o próprio `auth.uid()` |
| Informação sensível em logs e URLs | Mensagens de erro na tela são genéricas; o log do servidor registra o erro técnico sem dados do usuário; nenhuma emoção ou nota vai para a URL |
| Monitoramento sem expor dados | `GET /api/health` responde só `status` e latência |

## O que foi verificado, e como

- **RLS e GRANTs** (`tests/integration/isolamento-rls.test.ts`, 18 testes): leitura, criação, edição e exclusão entre dois visitantes em todas as tabelas pessoais; perfil forjado com id alheio; ausência de GRANT de UPDATE nas tabelas de registro; `CHECK`s de tamanho e de "outro exige descrição"; trigger de dias sequenciais; FK composta plano/dia; papel sem sessão bloqueado em todas as tabelas e nas funções.
- **Privilégios na nuvem**: `supabase db advisors` sem apontamentos; os GRANTs de produção foram conferidos por consulta direta depois da migration `harden_grants` (o projeto na nuvem concedia `ALL` a `anon` por padrão em tabelas novas, e isso foi revogado).
- **Cookies**: `tests/e2e/sessao.spec.ts` confere a cada execução que o cookie é `httpOnly`, `sameSite=Lax`, dura no máximo 30 dias e não aparece em `document.cookie`; também que, depois de "Sair", o cookie antigo não reabre a sessão.
- **Validação do JWT**: `getClaims()` verifica a assinatura localmente (o projeto usa chaves assimétricas ES256 publicadas em JWKS), sem confiar em `getSession()`.
- **Exclusão e reset**: testados contra o Supabase local (`isolamento-rls.test.ts`) e, uma vez, contra a produção após a migration (papel anônimo bloqueado, conta apagada some da Auth).
- **Bundle do navegador**: o JavaScript servido em produção foi varrido por padrões de chave; não contém nem a chave publicável nem a URL do Supabase, porque o navegador nunca fala com o banco.
- **Cabeçalhos em produção**: conferidos com `curl -I https://clavis-via.vercel.app`.
- **XSS**: teste E2E digita `<img onerror>` e `<b>` na nota e confere que aparecem como texto.
- **Duplo clique**: teste E2E confirma que dois envios criam um único check-in; concluir um dia duas vezes é idempotente (`unique` + tratamento do erro 23505).

## Para endurecer ainda mais (não feito, e por quê)

Itens conscientemente deixados para uma versão de produto, com o caminho já pensado:

1. **Content-Security-Policy com nonce.** O Next.js injeta scripts inline, então uma CSP útil exige gerar um nonce por requisição no `proxy.ts` e propagá-lo. Vale fazer antes de abrir para o público; não entrou no protótipo porque o ganho frente ao `X-Frame-Options` + `httpOnly` é marginal para uma demo e o custo de configurar é alto.
2. **Rate limiting nas Server Actions** (por sessão/IP) para check-ins e conclusões, além do limite de login da Supabase. Num produto, Upstash Ratelimit ou o firewall da Vercel.
3. **CAPTCHA (Turnstile) no login anônimo**, recomendado pela própria Supabase, porque visitantes anônimos ocupam espaço no banco.
4. **Desligar o provedor e-mail/senha no projeto de produção** (o app só usa login anônimo; a integração da Vercel cria o projeto com e-mail ligado) e revisar os limites de criação de conta no painel.
5. **Contas reais e consentimento LGPD**: login por e-mail/OTP, conversão do visitante em conta sem perder dados, aceite específico para dados de saúde, exportar e excluir meus dados. Detalhado no DECISOES.md.
6. **Criptografia das notas em nível de aplicação** (envelope encryption com chave em KMS), para que nem um operador do banco leia o texto livre.
7. **Observabilidade com scrubbing**: Sentry com remoção de dados pessoais dos eventos e auditoria de acessos administrativos.
8. **Supabase Pro**: PITR (recuperação a um ponto no tempo), sem pausa por inatividade, e MFA obrigatório no painel.

## Decisão sobre os logs

As Server Actions registram só `code` e `message` do erro (`logActionError`), nunca `details`/`hint`, que em alguns erros do Postgres trazem a linha inteira. Mensagens na tela são genéricas; o que é dado pessoal nunca vai para log, URL ou analytics (não há analytics).

## Como conferir você mesmo

```bash
pnpm db:start && pnpm test:integration     # RLS, exclusão e reset com visitantes reais no Supabase local
```

```bash
pnpm test:e2e -- sessao                     # flags do cookie e sessão apagada
```

```bash
curl -I https://clavis-via.vercel.app        # cabeçalhos de segurança
```

```bash
curl -s https://clavis-via.vercel.app/api/health   # health check sem dados
```
