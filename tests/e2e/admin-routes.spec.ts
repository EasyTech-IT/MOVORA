import { expect, test } from "@playwright/test";

// Ohne Anmeldung darf kein Admin-Bereich sichtbar sein, auch nicht für
// unbekannte Bereiche. Die Rollenprüfung mit angemeldeten Nutzern läuft über
// E2E_USER_* und die Session-Tests.
test.describe("Admin-Bereich ohne Anmeldung", () => {
  test("/admin leitet auf den Login um", async ({ page }) => {
    await page.goto("/admin");

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByLabel("Email")).toBeVisible();
  });

  test("/admin/audit zeigt keinen Protokollinhalt", async ({ page }) => {
    await page.goto("/admin/audit");

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByRole("heading", { name: "Audit Log" })).toHaveCount(0);
  });

  test("unbekannter Bereich leitet ebenfalls auf den Login um", async ({ page }) => {
    await page.goto("/admin/gibt-es-nicht");

    await expect(page).toHaveURL(/\/auth\/login$/);
  });
});
