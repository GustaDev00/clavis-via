import { expect, test, type Page } from "@playwright/test";
import { checkIn, enterAsDemo, settle } from "./helpers";

/**
 * Responsividade mobile por ALTURA real visível no navegador (já descontando as barras do Safari/Chrome).
 * - Telas curtas ("de um gesto") precisam caber inteiras, sem scroll.
 * - Telas longas rolam, mas o último elemento nunca pode ficar escondido atrás do menu fixo.
 */
const DEVICES = [
  { name: "iPhone SE (Safari)", width: 375, height: 553 },
  { name: "Android pequeno", width: 360, height: 640 },
  { name: "iPhone 14 (Safari)", width: 390, height: 664 },
  { name: "iPhone Pro Max (Safari)", width: 430, height: 740 },
  { name: "Pixel 7", width: 412, height: 839 },
];

const FIT_PAGES = ["/check-in", "/hoje", "/planos/voz-e-limites/dia/2", "/nao-existe"];
const LONG_PAGES = [
  "/hoje/pratica/respiracao-quadrada",
  "/planos",
  "/planos/voz-e-limites",
  "/planos/recomecar-com-leveza/dia/1",
  "/jornada",
];

async function verticalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
}

test.describe.configure({ mode: "parallel" });
test.skip(({ isMobile }) => !isMobile, "matriz de aparelhos roda só no projeto mobile");

for (const device of DEVICES) {
  test.describe(device.name, () => {
    test.use({ viewport: { width: device.width, height: device.height } });

    test("Entrada cabe inteira na tela", async ({ page }) => {
      await page.goto("/");
      await settle(page, 2500);
      expect(await verticalOverflow(page)).toBeLessThanOrEqual(1);
      await expect(page.getByRole("button", { name: "Entrar como visitante demo" })).toBeInViewport({ ratio: 1 });
    });

    test("telas curtas cabem sem scroll e as longas não escondem nada atrás do menu", async ({ page }) => {
      await enterAsDemo(page, "Maria Eduarda Lima");
      await page.goto("/hoje");
      await settle(page, 900);
      expect(await verticalOverflow(page), "Hoje sem check-in").toBeLessThanOrEqual(1);

      await checkIn(page, "Ansiedade", "Muita coisa ao mesmo tempo no trabalho.");
      await page.goto("/planos/voz-e-limites");
      await page.getByRole("button", { name: "Começar plano" }).click();
      await page.waitForURL(/dia\/1$/);

      for (const path of FIT_PAGES) {
        await page.goto(path);
        await settle(page, 900);
        expect(await verticalOverflow(page), `${path} não deveria ter scroll`).toBeLessThanOrEqual(1);
      }

      // Com a nota aberta, a grade encolhe e o botão Salvar continua visível acima do menu, sem rolar
      await page.goto("/check-in");
      await settle(page, 900);
      await page.getByRole("radio", { name: "Paz" }).click();
      await page.getByRole("button", { name: /Adicionar uma nota/ }).click();
      await page.getByRole("textbox").fill("Um dia tranquilo, com tempo para mim.");
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      const { saveBottom, navTop } = await page.evaluate(() => ({
        saveBottom: [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Salvar check-in"))!.getBoundingClientRect().bottom,
        navTop: document.querySelector("nav[aria-label='Navegação principal']")!.getBoundingClientRect().top,
      }));
      expect(saveBottom, "Salvar check-in deve ficar acima do menu com a nota aberta").toBeLessThanOrEqual(navTop);

      for (const path of LONG_PAGES) {
        await page.goto(path);
        await settle(page, 900);
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.waitForTimeout(300);
        const { lastBottom, navTop } = await page.evaluate(() => {
          const focusables = [...document.querySelectorAll("main a, main button, main textarea, main [role=radio]")];
          const last = focusables.at(-1)!;
          const nav = document.querySelector("nav[aria-label='Navegação principal']")!;
          return { lastBottom: last.getBoundingClientRect().bottom, navTop: nav.getBoundingClientRect().top };
        });
        expect(lastBottom, `${path}: último elemento atrás do menu`).toBeLessThanOrEqual(navTop);
      }
    });
  });
}
