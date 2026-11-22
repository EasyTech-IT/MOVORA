import { expect, test } from "@playwright/test";

test.describe("Öffentliche Seiten", () => {
  test("Startseite lädt und zeigt Login und Registrierung", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/MOVORA/);
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Registrierung" })).toBeVisible();
  });

  test("Startseite zeigt alle Abschnitte mit funktionierenden Ankern", async ({ page }) => {
    await page.goto("/");

    for (const id of ["suche", "anbieter", "score", "bewertungen", "betrieb", "karte", "unternehmen"]) {
      await expect(page.locator(`section#${id}`)).toBeVisible();
    }
    await expect(page.getByRole("link", { name: "Für Unternehmen" }).first()).toHaveAttribute("href", "#unternehmen");
  });

  test("Suche filtert nur Demo-Anbieter", async ({ page }) => {
    await page.goto("/");
    const search = page.getByLabel("Anbieter, Linien oder Regionen suchen");

    await search.fill("Regionalbahn");
    await expect(page.getByText("Beispiel Regionalbahn Süd")).toBeVisible();
    await expect(page.getByText("Beispiel Stadtwerke Mitte")).toHaveCount(0);

    await search.fill("xyz-nicht-vorhanden");
    await expect(page.getByText("Keine Demo-Ergebnisse gefunden.")).toBeVisible();
  });

  test("Navigation von der Startseite zur Login-Seite", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Login" }).click();

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
