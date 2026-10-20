import { expect, test, type Page } from "@playwright/test";
import { checkIn, enterAsDemo, settle } from "./helpers";

/**
 * Tablet e desktop: a navegação vira barra lateral, o conteúdo ganha grade e nada estoura a largura.
 * (O celular tem a própria matriz em responsivo.spec.ts.)
 */
const SIZES = [
  { name: "tablet retrato", width: 768, height: 1024, nav: "rail" },
  { name: "tablet paisagem", width: 1024, height: 768, nav: "sidebar" },
  { name: "notebook", width: 1280, height: 800, nav: "sidebar" },
  { name: "desktop", width: 1440, height: 900, nav: "sidebar" },
] as const;

const PAGES = [
  "/hoje",
  "/check-in",
  "/hoje/pratica/respiracao-quadrada",
  "/planos",
  "/planos/voz-e-limites",
  "/planos/voz-e-limites/dia/1",
  "/jornada",
];

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

test.skip(({ isMobile }) => isMobile, "tamanhos grandes rodam só no projeto desktop");

for (const size of SIZES) {
  test.describe(size.name, () => {
    test.use({ viewport: { width: size.width, height: size.height } });

    test("Entrada cabe na tela e o formulário está visível", async ({ page }) => {
      await page.goto("/");
      await settle(page, 2500);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
      await expect(page.getByRole("button", { name: "Entrar como visitante demo" })).toBeInViewport({ ratio: 1 });
    });

    test("barra lateral, sem cabeçalho de celular, e todas as telas sem estouro", async ({ page }) => {
      await enterAsDemo(page, "Ana Clara");
      await checkIn(page, "Ansiedade", "Muita coisa ao mesmo tempo no trabalho.");
      await page.goto("/planos/voz-e-limites");
      await page.getByRole("button", { name: "Começar plano" }).click();
      await page.waitForURL(/dia\/1$/);

      const nav = page.getByRole("navigation", { name: "Navegação principal" });
      const navBox = (await nav.boundingBox())!;
      expect(navBox.x, "a navegação fica encostada à esquerda").toBeLessThanOrEqual(1);
      expect(navBox.height, "a navegação ocupa a altura da tela").toBeGreaterThanOrEqual(size.height - 1);
      expect(navBox.width).toBe(size.nav === "rail" ? 96 : 256);
      await expect(nav.getByRole("link", { name: "CLAVIS VIA, ir para Hoje" })).toBeVisible();
      await expect(nav.getByRole("link", { name: /Minha jornada de Ana Clara/ })).toBeVisible();
      // O cabeçalho do celular some; a navegação é a única com esses links
      await expect(page.getByRole("link", { name: "CLAVIS VIA, ir para Hoje" })).toHaveCount(1);

      for (const path of PAGES) {
        await page.goto(path);
        await settle(page, 700);
        expect(await horizontalOverflow(page), `${path} não deveria ter rolagem horizontal`).toBeLessThanOrEqual(1);
        // O conteúdo começa depois da barra lateral
        const main = (await page.locator("main").boundingBox())!;
        expect(main.x, `${path}: conteúdo sobrepõe a navegação`).toBeGreaterThanOrEqual(navBox.width - 1);
      }
    });
  });
}
