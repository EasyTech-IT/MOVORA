import { expect, test } from "@playwright/test";

// Nur mit einem dedizierten Supabase-Testprojekt. Zugangsdaten kommen aus
// Umgebungsvariablen und werden nie im Code gespeichert. Ohne Variablen wird
// der Test übersprungen.
const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

test.describe("Gültige Session", () => {
  test.skip(!email || !password, "E2E_USER_EMAIL / E2E_USER_PASSWORD nicht gesetzt");

  test("angemeldeter Benutzer erreicht /protected", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Login" }).click();

    await page.waitForURL((url) => !url.pathname.startsWith("/auth/login"));
    await page.goto("/protected");

    await expect(page).toHaveURL(/\/protected$/);
    await expect(page.getByText("Your user details")).toBeVisible();
  });
});
