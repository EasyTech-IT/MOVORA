import { expect, test } from "@playwright/test";

test.describe("Öffentliche Seiten", () => {
  test("Startseite lädt und zeigt Anmelde-Links", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Next.js and Supabase Starter Kit");
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "Sign up" }),
    ).toBeVisible();
  });

  test("Navigation von der Startseite zur Login-Seite", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  test("Login-Seite ist erreichbar und enthält das Formular", async ({ page }) => {
    const response = await page.goto("/auth/login");

    expect(response?.status()).toBe(200);
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("Registrierungsseite ist erreichbar und verlinkt zurück zum Login", async ({ page }) => {
    const response = await page.goto("/auth/sign-up");

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible();
    await page.getByRole("link", { name: "Login" }).click();

    await expect(page).toHaveURL(/\/auth\/login$/);
  });
});
