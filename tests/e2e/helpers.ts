import { expect, type Page } from "@playwright/test";

/** Nome único por teste para identificar os dados de cada visitante. */
export function visitorName(prefix = "Teste") {
  return `${prefix} ${Math.random().toString(36).slice(2, 7)}`;
}

/** Abre a Entrada e entra como visitante demo; termina na tela de check-in. */
export async function enterAsDemo(page: Page, name?: string) {
  await page.goto("/");
  const field = page.getByLabel("Como podemos te chamar?");
  await expect(field).toBeVisible();
  if (name !== undefined) await field.fill(name);
  await page.getByRole("button", { name: "Entrar como visitante demo" }).click();
  await expect(page).toHaveURL(/\/check-in$/);
  await expect(page.getByRole("heading", { name: "Como você está chegando hoje?" })).toBeVisible();
}

/** Faz um check-in escolhendo a emoção pelo rótulo. */
export async function checkIn(page: Page, emotion: string, note?: string) {
  if (!page.url().endsWith("/check-in")) await page.goto("/check-in");
  await page.getByRole("radio", { name: emotion }).click();
  if (note !== undefined) await page.getByRole("textbox").fill(note);
  await page.getByRole("button", { name: "Salvar check-in" }).click();
  await expect(page).toHaveURL(/\/hoje/);
}

/** Garante que não há rolagem horizontal (nada estourou a largura da tela). */
export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, "a página não deve ter rolagem horizontal").toBeLessThanOrEqual(1);
}

/** Espera as animações de entrada assentarem antes de uma captura de tela. */
export async function settle(page: Page, ms = 1600) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(ms);
}
