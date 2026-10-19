import { expect, test } from "@playwright/test";
import { enterAsDemo, visitorName } from "./helpers";

/**
 * O fluxo obrigatório do desafio, passo a passo:
 * 1. entrar como demo → 2. check-in "ansiedade" → 3. Hoje coerente → 4. concluir Dia 1
 * → 5. Jornada mostra tudo → 6. recarregar e os dados continuam lá.
 */
test("fluxo de ponta a ponta com persistência após recarregar", async ({ page }) => {
  const name = visitorName("Ana");
  const note = "Muita coisa ao mesmo tempo no trabalho.";
  const reflection = "Respirar antes de responder ajudou.";

  await test.step("1. entrar como visitante demo", async () => {
    await enterAsDemo(page, name);
  });

  await test.step("2. check-in com ansiedade", async () => {
    await page.getByRole("radio", { name: "Ansiedade" }).click();
    await expect(page.getByRole("radio", { name: "Ansiedade" })).toHaveAttribute("aria-checked", "true");
    await page.getByRole("textbox").fill(note);
    await page.getByRole("button", { name: "Salvar check-in" }).click();
    await expect(page).toHaveURL(/\/hoje/);
    await expect(page.getByRole("status")).toContainText("Check-in salvo");
  });

  await test.step("3. Hoje traz reflexão e prática coerentes com a ansiedade", async () => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText(name);
    await expect(page.getByText("Você chegou com")).toBeVisible();
    await expect(page.getByText("Ansiedade", { exact: true })).toBeVisible();
    await expect(page.getByText("Sua chave de hoje")).toBeVisible();
    // Práticas para ansiedade no seed: respiração quadrada ou cinco sentidos
    await expect(page.getByText(/Respiração quadrada|Voltar pelos cinco sentidos/).first()).toBeVisible();
    await expect(page.getByText("Quando a ansiedade aperta")).toBeVisible();
  });

  await test.step("4. abrir um plano e concluir o Dia 1", async () => {
    await page.getByRole("link", { name: "Planos", exact: true }).click();
    await expect(page).toHaveURL(/\/planos$/);
    await page.getByRole("link", { name: /Voz e limites/ }).click();
    await expect(page.getByRole("heading", { name: "Voz e limites" })).toBeVisible();
    await page.getByRole("button", { name: "Começar plano" }).click();

    await expect(page).toHaveURL(/\/planos\/voz-e-limites\/dia\/1$/);
    await expect(page.getByText("Dia 1 de 3")).toBeVisible();
    await page.getByRole("textbox").fill(reflection);
    await page.getByRole("button", { name: "Concluir dia 1" }).click();

    await expect(page).toHaveURL(/\/planos\/voz-e-limites/);
    await expect(page.getByRole("status")).toContainText("Dia 1 concluído");
    await expect(page.getByText("1 de 3 dias")).toBeVisible();
  });

  const assertJourney = async () => {
    await expect(page.getByRole("heading", { name: "O caminho que você vem fazendo" })).toBeVisible();
    const checkIns = page.getByTestId("journey-check-in");
    await expect(checkIns).toHaveCount(1);
    await expect(checkIns.first()).toContainText("Ansiedade");
    await expect(checkIns.first()).toContainText(note);
    const plan = page.getByTestId("journey-plan");
    await expect(plan).toHaveCount(1);
    await expect(plan).toContainText("Voz e limites");
    await expect(plan).toContainText("1 de 3 dias");
  };

  await test.step("5. Minha Jornada mostra o check-in e a conclusão", async () => {
    await page.getByRole("link", { name: "Jornada", exact: true }).click();
    await expect(page).toHaveURL(/\/jornada$/);
    await assertJourney();
  });

  await test.step("6. recarregar a página: nada desaparece", async () => {
    await page.reload();
    await assertJourney();

    // E o dia concluído guarda a reflexão escrita
    await page.goto("/planos/voz-e-limites/dia/1");
    await expect(page.getByText("Dia concluído")).toBeVisible();
    await expect(page.getByText(reflection)).toBeVisible();
  });
});
