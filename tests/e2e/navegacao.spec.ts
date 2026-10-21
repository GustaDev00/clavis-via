import { expect, test } from "@playwright/test";
import { checkIn, enterAsDemo, visitorName } from "./helpers";

test.describe("sem sessão", () => {
  for (const path of ["/hoje", "/check-in", "/planos", "/planos/voz-e-limites", "/jornada"]) {
    test(`${path} volta para a Entrada`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByRole("button", { name: "Entrar como visitante demo" })).toBeVisible();
    });
  }
});

test.describe("com sessão", () => {
  test.beforeEach(async ({ page }) => {
    await enterAsDemo(page, visitorName());
  });

  test("a Entrada leva direto para Hoje", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/hoje$/);
  });

  test("todas as abas da navegação inferior funcionam", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Navegação principal" });
    for (const [label, path] of [
      ["Hoje", /\/hoje$/],
      ["Planos", /\/planos$/],
      ["Jornada", /\/jornada$/],
      ["Check-in", /\/check-in$/],
    ] as const) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(path);
      await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
    }
  });

  test("logo leva para Hoje e avatar leva para a Jornada", async ({ page }) => {
    await page.getByRole("link", { name: /ir para Hoje/ }).click();
    await expect(page).toHaveURL(/\/hoje$/);
    await page.getByRole("link", { name: /Minha jornada de/ }).click();
    await expect(page).toHaveURL(/\/jornada$/);
  });

  test("Hoje sem check-in convida a fazer o check-in", async ({ page }) => {
    await page.goto("/hoje");
    await expect(page.getByText("Você ainda não fez o check-in de hoje.")).toBeVisible();
    await page.getByRole("link", { name: "Fazer check-in" }).click();
    await expect(page).toHaveURL(/\/check-in$/);
  });

  test("prática do dia: concluir e ver na jornada", async ({ page }) => {
    await checkIn(page, "Ansiedade");
    await page.getByRole("link", { name: /Ver prática de hoje/ }).click();
    await expect(page).toHaveURL(/\/hoje\/pratica\//);

    await page.getByRole("button", { name: "Concluí esta prática" }).click();
    await expect(page).toHaveURL(/\/hoje/);
    await expect(page.getByRole("status")).toContainText("Prática registrada");
    await expect(page.getByText("Feita hoje")).toBeVisible();

    await page.goto("/jornada");
    await expect(page.getByText("Últimas práticas")).toBeVisible();
  });

  test("respiração guiada: o círculo cresce ao inspirar e a fase é anunciada", async ({ page }) => {
    await page.goto("/hoje/pratica/respiracao-quadrada");
    const orb = page.locator("[data-orb]");
    const scale = () => orb.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).a);

    await expect.poll(scale).toBeCloseTo(0.62, 1);
    await page.getByRole("button", { name: "Começar a respirar" }).click();
    await expect(page.getByText("Inspire", { exact: true })).toBeVisible();
    await expect.poll(scale, { timeout: 5000 }).toBeGreaterThan(0.9);

    await page.getByRole("button", { name: "Pausar" }).click();
    await expect(page.getByRole("button", { name: "Continuar" })).toBeVisible();
  });

  test("prática sem respiração guiada não mostra o círculo", async ({ page }) => {
    await page.goto("/hoje/pratica/um-pequeno-passo");
    await expect(page.getByRole("heading", { name: "Um pequeno passo" })).toBeVisible();
    await expect(page.locator("[data-orb]")).toHaveCount(0);
    await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(4);
  });

  test("links de voltar levam ao nível anterior", async ({ page }) => {
    await page.goto("/planos/voz-e-limites/dia/1");
    await page.getByRole("link", { name: "Voz e limites" }).click();
    await expect(page).toHaveURL(/\/planos\/voz-e-limites$/);
    await page.getByRole("link", { name: "Planos", exact: true }).first().click();
    await expect(page).toHaveURL(/\/planos$/);
  });

  test("filtros de tema nos planos", async ({ page }) => {
    await page.goto("/planos");
    const cards = page.getByRole("main").getByRole("listitem");
    await expect(cards).toHaveCount(4);
    await page.getByRole("button", { name: "Fé", exact: true }).click();
    await expect(page.getByRole("button", { name: "Fé", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("Fé em dias cansados");
    await page.getByRole("button", { name: "Todos" }).click();
    await expect(cards).toHaveCount(4);
  });

  test("dias abrem em sequência: o dia 2 fica fechado antes do dia 1", async ({ page }) => {
    await page.goto("/planos/quando-a-ansiedade-aperta/dia/2");
    await expect(page.getByText("Este dia ainda está fechado")).toBeVisible();
    await expect(page.getByRole("button", { name: /Concluir dia/ })).toHaveCount(0);

    await page.getByRole("link", { name: "Ir para o dia 1" }).click();
    await expect(page).toHaveURL(/\/dia\/1$/);
    await page.getByRole("button", { name: "Concluir dia 1" }).click();
    await expect(page.getByRole("status")).toContainText("Dia 1 concluído");

    await page.getByRole("link", { name: /Continuar: Dia 2/ }).click();
    await expect(page).toHaveURL(/\/dia\/2$/);
    await expect(page.getByRole("button", { name: "Concluir dia 2" })).toBeVisible();
  });

  test("concluir todos os dias completa o plano", async ({ page }) => {
    await page.goto("/planos/voz-e-limites");
    await page.getByRole("button", { name: "Começar plano" }).click();
    for (const day of [1, 2, 3]) {
      await page.goto(`/planos/voz-e-limites/dia/${day}`);
      await page.getByRole("button", { name: `Concluir dia ${day}` }).click();
      await expect(page.getByRole("status")).toContainText(day === 3 ? "Plano concluído" : `Dia ${day} concluído`);
    }
    await expect(page.getByRole("status")).toContainText("Plano concluído");
    await page.goto("/jornada");
    await expect(page.getByTestId("journey-plan")).toContainText("Concluído");
  });

  test("endereços inexistentes mostram a página de não encontrado", async ({ page }) => {
    for (const path of ["/planos/nao-existe", "/planos/voz-e-limites/dia/99", "/hoje/pratica/nao-existe", "/qualquer-coisa"]) {
      await page.goto(path);
      await expect(page.getByText("Este caminho não existe por aqui.")).toBeVisible();
    }
  });

  test("reiniciar demo: cancelar não apaga; confirmar apaga tudo", async ({ page }) => {
    await checkIn(page, "Paz", "registro para apagar");
    await page.goto("/jornada");
    await expect(page.getByTestId("journey-check-in")).toHaveCount(1);

    await page.getByRole("button", { name: "Reiniciar demo" }).click();
    const dialog = page.getByRole("dialog", { name: "Reiniciar a demonstração?" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Cancelar" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByTestId("journey-check-in")).toHaveCount(1);

    await page.getByRole("button", { name: "Reiniciar demo" }).click();
    await dialog.getByRole("button", { name: "Apagar meus registros" }).click();
    await expect(page).toHaveURL(/\/check-in/);
    await expect(page.getByRole("status")).toContainText("Demonstração reiniciada");

    await page.goto("/jornada");
    await expect(page.getByTestId("journey-check-in")).toHaveCount(0);
    await expect(page.getByText("Seus check-ins aparecem aqui.")).toBeVisible();
  });

  test("Esc fecha o diálogo de confirmação", async ({ page }) => {
    await page.goto("/jornada");
    await page.getByRole("button", { name: "Sair" }).click();
    const dialog = page.getByRole("dialog", { name: "Sair da demonstração?" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("sair encerra a sessão", async ({ page }) => {
    await page.goto("/jornada");
    await page.getByRole("button", { name: "Sair" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Apagar e sair" }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto("/hoje");
    await expect(page).toHaveURL(/\/$/);
  });
});
