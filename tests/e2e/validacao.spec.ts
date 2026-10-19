import { expect, test } from "@playwright/test";
import { checkIn, enterAsDemo, openNote, visitorName } from "./helpers";

const long = (length: number, word = "texto ") => word.repeat(Math.ceil(length / word.length)).slice(0, length);

test.describe("Entrada: nome do visitante", () => {
  test("sem nome, entra como 'Visitante'", async ({ page }) => {
    await enterAsDemo(page);
    await page.goto("/hoje");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Visitante");
  });

  test("espaços extras são normalizados", async ({ page }) => {
    await enterAsDemo(page, "   Ana     Clara   ");
    await page.goto("/hoje");
    // Nome completo normalizado no avatar; a saudação usa o primeiro nome
    await expect(page.getByRole("link", { name: "Minha jornada de Ana Clara" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ana");
  });

  test("nome longo demais mostra erro e não entra; corrigindo, entra", async ({ page }) => {
    await page.goto("/");
    const field = page.getByLabel("Como podemos te chamar?");
    await field.fill(long(55, "Maria "));
    await page.getByRole("button", { name: "Entrar como visitante demo" }).click();

    await expect(page.getByText("Use até 40 caracteres.")).toBeVisible();
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(page).toHaveURL(/\/$/);

    // Ao digitar, o erro sai
    await field.fill("Maria");
    await expect(page.getByText("Use até 40 caracteres.")).toBeHidden();
    await page.getByRole("button", { name: "Entrar como visitante demo" }).click();
    await expect(page).toHaveURL(/\/check-in$/);
  });

  for (const invalid of ["<script>alert(1)</script>", "Ana 🌸", "ana@email.com"]) {
    test(`recusa nome com caracteres inválidos: ${invalid}`, async ({ page }) => {
      await page.goto("/");
      await page.getByLabel("Como podemos te chamar?").fill(invalid);
      await page.getByRole("button", { name: "Entrar como visitante demo" }).click();
      await expect(page.getByText(/Use apenas letras, números/)).toBeVisible();
      await expect(page).toHaveURL(/\/$/);
    });
  }
});

test.describe("Check-in", () => {
  test.beforeEach(async ({ page }) => {
    await enterAsDemo(page, visitorName());
  });

  test("salvar sem escolher emoção mostra erro e não sai da tela", async ({ page }) => {
    const save = page.getByRole("button", { name: "Salvar check-in" });
    await save.click();
    await expect(page.getByText("Escolha o que está mais presente em você agora.")).toBeVisible();
    await expect(page.getByRole("radiogroup")).toHaveAttribute("aria-invalid", "true");
    await expect(page).toHaveURL(/\/check-in$/);

    // Clicar de novo mantém a mensagem (sem duplicar)
    await save.click();
    await expect(page.getByText("Escolha o que está mais presente em você agora.")).toHaveCount(1);

    // Escolher uma emoção limpa o erro
    await page.getByRole("radio", { name: "Paz" }).click();
    await expect(page.getByText("Escolha o que está mais presente em você agora.")).toBeHidden();
  });

  test("'Outro' exige descrição; com descrição, salva", async ({ page }) => {
    await page.getByRole("radio", { name: "Outro" }).click();
    await expect(page.getByText("Conte em poucas palavras o que você está sentindo")).toBeVisible();
    await page.getByRole("button", { name: "Salvar check-in" }).click();
    await expect(page.getByText("Conte em poucas palavras o que você está sentindo.")).toBeVisible();
    await expect(page).toHaveURL(/\/check-in$/);

    // Só espaços também não vale
    await page.getByRole("textbox").fill("     ");
    await page.getByRole("button", { name: "Salvar check-in" }).click();
    // A mensagem anterior sai em crossfade enquanto a nova entra
    await expect(page.getByText("Conte em poucas palavras o que você está sentindo.").last()).toBeVisible();
    await expect(page.getByText("Conte em poucas palavras o que você está sentindo.")).toHaveCount(1);

    await page.getByRole("textbox").fill("Saudade de casa");
    await page.getByRole("button", { name: "Salvar check-in" }).click();
    await expect(page).toHaveURL(/\/hoje/);
    await expect(page.getByText("Outro", { exact: true })).toBeVisible();
    await expect(page.getByText("Saudade de casa")).toBeVisible();
  });

  test("nota fica recolhida até ser pedida e recebe o foco ao abrir", async ({ page }) => {
    await expect(page.getByRole("textbox")).toHaveCount(0);
    await page.getByRole("button", { name: /Adicionar uma nota/ }).click();
    await expect(page.getByRole("textbox")).toBeFocused();
  });

  test("nota é limitada a 280 caracteres e o contador acompanha", async ({ page }) => {
    await openNote(page);
    const note = page.getByRole("textbox");
    await note.fill("Oi");
    await expect(page.getByText("2/280")).toBeVisible();

    await note.fill(long(400));
    await expect(note).toHaveValue(long(280));
    await expect(page.getByText("280/280")).toBeVisible();

    await page.getByRole("radio", { name: "Cansaço" }).click();
    await page.getByRole("button", { name: "Salvar check-in" }).click();
    await expect(page).toHaveURL(/\/hoje/);
  });

  test("texto com emojis, acentos e quebras de linha é salvo como foi escrito", async ({ page }) => {
    const note = "Dia intenso 😮‍💨\nMas consegui respirar. Ação, coração, pão.";
    await checkIn(page, "Esperança", note);
    await page.goto("/jornada");
    const item = page.getByTestId("journey-check-in").first();
    await expect(item).toContainText("Esperança");
    await expect(item).toContainText("Dia intenso 😮‍💨");
    await expect(item).toContainText("Ação, coração, pão.");
  });

  test("HTML digitado é exibido como texto, nunca interpretado", async ({ page }) => {
    await checkIn(page, "Irritação", '<img src=x onerror="alert(1)"> <b>negrito</b>');
    await page.goto("/jornada");
    await expect(page.getByTestId("journey-check-in").first()).toContainText("<b>negrito</b>");
    await expect(page.locator("img[src='x']")).toHaveCount(0);
  });

  test("clique duplo em salvar cria um único check-in", async ({ page }) => {
    await page.getByRole("radio", { name: "Paz" }).click();
    await page.getByRole("button", { name: "Salvar check-in" }).dblclick();
    await expect(page).toHaveURL(/\/hoje/);
    await page.goto("/jornada");
    await expect(page.getByTestId("journey-check-in")).toHaveCount(1);
  });

  test("teclado: setas navegam entre as emoções", async ({ page }) => {
    await page.getByRole("radio", { name: "Ansiedade" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("radio", { name: "Cansaço" })).toHaveAttribute("aria-checked", "true");
    await expect(page.getByRole("radio", { name: "Cansaço" })).toBeFocused();
    await page.keyboard.press("End");
    await expect(page.getByRole("radio", { name: "Outro" })).toHaveAttribute("aria-checked", "true");
  });
});

test.describe("Reflexão do dia do plano", () => {
  test("reflexão opcional: concluir sem escrever funciona", async ({ page }) => {
    await enterAsDemo(page, visitorName());
    await page.goto("/planos/recomecar-com-leveza");
    await page.getByRole("button", { name: "Começar plano" }).click();
    await page.getByRole("button", { name: "Concluir dia 1" }).click();
    await expect(page.getByRole("status")).toContainText("Dia 1 concluído");
    await page.goto("/planos/recomecar-com-leveza/dia/1");
    await expect(page.getByText("Você concluiu este dia sem escrever uma reflexão.")).toBeVisible();
  });

  test("reflexão longa é limitada a 1000 caracteres e salva inteira", async ({ page }) => {
    await enterAsDemo(page, visitorName());
    await page.goto("/planos/fe-em-dias-cansados");
    await page.getByRole("button", { name: "Começar plano" }).click();

    const reflection = page.getByRole("textbox");
    await reflection.fill(long(1500, "Hoje percebi que preciso de pausas. "));
    await expect(reflection).toHaveValue(long(1000, "Hoje percebi que preciso de pausas. "));
    await expect(page.getByText("1000/1000")).toBeVisible();

    await page.getByRole("button", { name: "Concluir dia 1" }).click();
    await expect(page.getByRole("status")).toContainText("Dia 1 concluído");
    await page.goto("/planos/fe-em-dias-cansados/dia/1");
    await expect(page.getByText("Dia concluído")).toBeVisible();
    await expect(page.getByText(/Hoje percebi que preciso de pausas/)).toBeVisible();
  });
});
