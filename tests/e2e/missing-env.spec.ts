import { expect, test } from "@playwright/test";

// Läuft auf dem zweiten Server ohne NEXT_PUBLIC_SUPABASE_* (Projekt "missing-env").
// Die Konfiguration fehlt, daher muss jede geschützte Seite verweigert werden.
test.describe("Fehlende Supabase-Konfiguration", () => {
  test("geschützte Seite wird ohne Konfiguration verweigert", async ({ page }) => {
    await page.goto("/protected");

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByText("Your user details")).toHaveCount(0);
    await expect(page.getByText("Next steps")).toHaveCount(0);
  });

  test("öffentliche Startseite funktioniert weiterhin", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
    await expect(page.getByText("Supabase environment variables required")).toBeVisible();
  });

  test("Login-Seite bleibt ohne Konfiguration erreichbar", async ({ page }) => {
    const response = await page.goto("/auth/login");

    expect(response?.status()).toBe(200);
    await expect(page.getByLabel("Email")).toBeVisible();
  });
});
