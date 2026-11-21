import { expect, test } from "@playwright/test";

// Ohne Anmeldung darf keine geschützte Seite sichtbar sein.
// Es werden keine Zugangsdaten verwendet und keine Daten geschrieben.
test.describe("Geschützte Bereiche", () => {
  test("/protected leitet ohne Anmeldung auf den Login um", async ({ page }) => {
    await page.goto("/protected");

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByLabel("Email")).toBeVisible();
  });
});
