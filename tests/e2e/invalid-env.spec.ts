import { expect, test } from "@playwright/test";

// Läuft auf dem dritten Server mit ungültiger NEXT_PUBLIC_SUPABASE_URL
// (Projekt "invalid-env"). Die Konfiguration darf nicht als gültig gelten und
// geschützte Inhalte dürfen nicht ausgeliefert werden.
test.describe("Ungültige Supabase-Konfiguration", () => {
  test("geschützte Seite leitet ohne Absturz zum Login um", async ({ page }) => {
    const response = await page.goto("/protected");

    expect(response?.status()).toBeLessThan(500);
    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByText("Your user details")).toHaveCount(0);
  });

  test("Startseite zeigt die Konfigurationshinweise statt eines Fehlers", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
    await expect(page.getByText("Supabase environment variables required")).toBeVisible();
  });

  test("Login-Seite bleibt erreichbar", async ({ page }) => {
    const response = await page.goto("/auth/login");

    expect(response?.status()).toBe(200);
    await expect(page.getByLabel("Email")).toBeVisible();
  });
});
