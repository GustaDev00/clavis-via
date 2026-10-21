import { expect, test } from "@playwright/test";
import { enterAsDemo, visitorName } from "./helpers";

/**
 * Garantias da sessão que a documentação afirma (docs/seguranca.md).
 * Se uma atualização da @supabase/ssr mudar os padrões de cookie, este teste avisa.
 */
test("cookie de sessão é httpOnly, sameSite=lax e dura no máximo 30 dias", async ({ page, context }) => {
  await enterAsDemo(page, visitorName());

  const session = (await context.cookies()).filter((cookie) => /auth-token/.test(cookie.name));
  expect(session.length).toBeGreaterThan(0);
  for (const cookie of session) {
    expect(cookie.httpOnly, "httpOnly").toBe(true);
    expect(cookie.sameSite, "sameSite").toBe("Lax");
    expect(cookie.expires - Date.now() / 1000, "validade").toBeLessThanOrEqual(30 * 24 * 3600 + 60);
  }

  // O JavaScript da página não enxerga a sessão
  expect(await page.evaluate(() => document.cookie)).not.toMatch(/auth-token/);
});

test("sair apaga a conta do visitante: a sessão antiga não volta a funcionar", async ({ page, context }) => {
  await enterAsDemo(page, visitorName());
  const before = (await context.cookies()).filter((cookie) => /auth-token/.test(cookie.name));
  expect(before.length).toBeGreaterThan(0);

  await page.goto("/jornada");
  await page.getByRole("button", { name: "Sair" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Apagar e sair" }).click();
  await expect(page).toHaveURL(/\/$/);

  // Mesmo recolocando o cookie antigo, o usuário não existe mais: o app volta à Entrada
  await context.addCookies(before.map((cookie) => ({ ...cookie, expires: Math.floor(Date.now() / 1000) + 3600 })));
  await page.goto("/hoje");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("button", { name: "Entrar como visitante demo" })).toBeVisible();
});
