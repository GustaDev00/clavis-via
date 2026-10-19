import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { checkIn, enterAsDemo, expectNoHorizontalOverflow, settle, visitorName } from "./helpers";

test("dois visitantes não enxergam os dados um do outro", async ({ browser }) => {
  const ana = await browser.newContext();
  const bruno = await browser.newContext();
  const anaPage = await ana.newPage();
  const brunoPage = await bruno.newPage();

  await enterAsDemo(anaPage, "Ana");
  await checkIn(anaPage, "Ansiedade", "segredo da Ana");
  await enterAsDemo(brunoPage, "Bruno");

  await brunoPage.goto("/jornada");
  await expect(brunoPage.getByTestId("journey-check-in")).toHaveCount(0);
  await expect(brunoPage.getByText("segredo da Ana")).toHaveCount(0);

  await anaPage.goto("/jornada");
  await expect(anaPage.getByTestId("journey-check-in")).toContainText("segredo da Ana");

  await ana.close();
  await bruno.close();
});

test.describe("layout em tela estreita (320px) com textos longos", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test("nenhuma tela estoura a largura", async ({ page }) => {
    await enterAsDemo(page, "Maria Eduarda Albuquerque dos Santos Lima".slice(0, 40));
    await checkIn(page, "Sensibilidade", "palavralongasemespacos".repeat(12).slice(0, 280));

    for (const path of [
      "/check-in",
      "/hoje",
      "/planos",
      "/planos/quando-a-ansiedade-aperta",
      "/planos/quando-a-ansiedade-aperta/dia/1",
      "/jornada",
    ]) {
      await page.goto(path);
      await settle(page, 900);
      await expectNoHorizontalOverflow(page);
    }
  });
});

test.describe("acessibilidade (axe)", () => {
  test("Entrada sem violações graves", async ({ page }) => {
    await page.goto("/");
    await settle(page, 3000);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""));
    expect(serious.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target).join(", ")}`)).toEqual([]);
  });

  test("telas do app sem violações graves", async ({ page }) => {
    await enterAsDemo(page, visitorName());
    await checkIn(page, "Paz", "dia tranquilo");

    for (const path of ["/check-in", "/hoje", "/planos", "/planos/voz-e-limites", "/planos/voz-e-limites/dia/1", "/jornada"]) {
      await page.goto(path);
      await settle(page, 1800);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""));
      expect(
        serious.map((violation) => `${path} → ${violation.id}: ${violation.nodes.map((node) => node.target).join(", ")}`),
      ).toEqual([]);
    }
  });
});
