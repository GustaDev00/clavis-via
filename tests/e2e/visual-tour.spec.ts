import { test } from "@playwright/test";
import { enterAsDemo, settle } from "./helpers";

/**
 * Passeio visual: captura cada tela no celular (viewport, como a pessoa vê) em test-results/tour/*.png.
 * Não faz asserções de pixel — serve para conferir o design a cada mudança.
 */
test("passeio visual pelas telas", async ({ page }) => {
  const shot = (name: string) => page.screenshot({ path: `test-results/tour/${name}.png` });

  await page.goto("/");
  await settle(page, 3200);
  await shot("01-entrada");

  await enterAsDemo(page, "Ana Clara");
  await settle(page);
  await shot("02-check-in");

  await page.getByRole("button", { name: "Salvar check-in" }).click();
  await page.waitForTimeout(700);
  await shot("03-check-in-erro");

  await page.getByRole("radio", { name: "Ansiedade" }).click();
  await page.getByRole("button", { name: /Adicionar uma nota/ }).click();
  await page.getByRole("textbox").fill("Muita coisa ao mesmo tempo no trabalho.");
  await page.waitForTimeout(500);
  await shot("04-check-in-selecionado");

  await page.getByRole("button", { name: "Salvar check-in" }).click();
  await page.waitForURL(/\/hoje/);
  await settle(page);
  await shot("05-hoje");

  await page.getByRole("link", { name: /Ver prática de hoje/ }).click();
  await page.waitForURL(/\/hoje\/pratica\//);
  await settle(page);
  await shot("06-pratica");

  await page.goto("/planos");
  await settle(page);
  await shot("07-planos");

  await page.goto("/planos/quando-a-ansiedade-aperta");
  await settle(page);
  await shot("08-plano");

  await page.getByRole("button", { name: "Começar plano" }).click();
  await page.waitForURL(/\/dia\/1$/);
  await settle(page);
  await shot("09-dia");

  await page.getByRole("textbox").fill("Respirar antes de responder ajudou.");
  await page.getByRole("button", { name: "Concluir dia 1" }).click();
  await page.waitForURL(/concluido|quando-a-ansiedade-aperta$/);
  await settle(page);
  await shot("10-plano-progresso");

  await page.goto("/jornada");
  await settle(page);
  await shot("11-jornada");
});
