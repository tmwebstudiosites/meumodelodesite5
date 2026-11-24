import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Navegação e catálogo", () => {
  test("home carrega com hero e CTA de agendamento", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Vestidos de noiva e festa",
    );
    await expect(page.getByRole("link", { name: "Agendar minha prova" })).toBeVisible();
  });

  test("catálogo mostra skeleton, depois os vestidos, e filtra", async ({ page }) => {
    await page.goto("/vestidos");
    await expect(page.getByTestId("dress-skeleton").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Aurora" })).toBeVisible();
    await expect(page.getByTestId("dress-skeleton")).toHaveCount(0);
    await page.getByRole("button", { name: "Festa", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Aurora" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Noir" })).toBeVisible();
  });

  test("abre o detalhe de um vestido e segue para o agendamento", async ({ page }) => {
    await page.goto("/vestidos");
    await page.getByRole("link", { name: "Ver Helena" }).click();
    await expect(page).toHaveURL(/\/vestidos\/helena$/);
    await expect(page.getByRole("heading", { level: 1, name: "Helena" })).toBeVisible();
    await page.getByRole("link", { name: /Quero provar o Helena/ }).click();
    await expect(page.getByLabel(/Vestido de interesse|Nome completo/).first()).toBeVisible();
  });

  test("rota inexistente mostra 404", async ({ page }) => {
    await page.goto("/nada-aqui");
    await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();
  });
});

test.describe("Agendamento", () => {
  test("fluxo de 3 etapas com validação e progresso", async ({ page, context }) => {
    await page.goto("/agendar");
    const bar = page.getByRole("progressbar", { name: "Progresso do agendamento" });
    await expect(bar).toHaveAttribute("aria-valuenow", "33");
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByText("Informe seu nome completo.")).toBeVisible();
    await page.getByLabel("Nome completo").fill("Maria Silva");
    await page.getByLabel(/WhatsApp/).fill("21999998888");
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByLabel("Data do evento").fill("2099-01-10");
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(bar).toHaveAttribute("aria-valuenow", "100");
    await expect(page.getByText("Maria Silva")).toBeVisible();
    const popup = context.waitForEvent("page");
    await page.getByRole("button", { name: "Enviar pelo WhatsApp" }).click();
    await popup;
    await expect(page.getByText("Tudo pronto!")).toBeVisible();
  });
});

test.describe("Acessibilidade e performance", () => {
  for (const path of ["/", "/vestidos", "/agendar"]) {
    test(`sem violações graves de acessibilidade em ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.getByRole("heading", { level: 1 }).waitFor();
      await page.waitForTimeout(1200);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      expect(
        results.violations.filter((v) => v.impact === "critical" || v.impact === "serious"),
      ).toEqual([]);
    });
  }

  test("imagens abaixo da dobra usam lazy loading", async ({ page }) => {
    await page.goto("/vestidos");
    await expect(page.getByRole("heading", { name: "Aurora" })).toBeVisible();
    const lazy = await page.locator('img[loading="lazy"]').count();
    expect(lazy).toBeGreaterThan(0);
  });

  test("respeita prefers-reduced-motion (conteúdo visível sem animação)", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await ctx.close();
  });
});
