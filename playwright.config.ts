import { defineConfig, devices } from "@playwright/test";

// Ein externer Server (PLAYWRIGHT_BASE_URL) wird nicht gestartet. In diesem
// Fall laufen nur die Tests mit Supabase-Konfiguration.
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;
const baseURL = externalBaseURL ?? "http://localhost:3000";
const noEnvBaseURL = "http://localhost:3001";

// Zweiter Dev-Server ohne Supabase-Variablen. Leere Werte überschreiben die
// Einträge aus .env.local, damit der Fail-Closed-Pfad geprüft wird. Eigenes
// distDir, damit er nicht um das Dev-Lock des ersten Servers konkurriert.
const noEnvServer = {
  command: "npm run dev -- --port 3001",
  url: noEnvBaseURL,
  reuseExistingServer: false,
  timeout: 120_000,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
    NEXT_DIST_DIR: ".next-noenv",
  },
};

// Dritter Server mit ungültiger Supabase-URL. Der Fail-Closed-Pfad muss auch
// dann greifen und darf nicht mit einem Serverfehler abstürzen.
const invalidEnvBaseURL = "http://localhost:3002";
const invalidEnvServer = {
  command: "npm run dev -- --port 3002",
  url: invalidEnvBaseURL,
  reuseExistingServer: false,
  timeout: 120_000,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "not-a-valid-url",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-invalid-key",
    NEXT_DIST_DIR: ".next-invalid",
  },
};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], baseURL },
      testIgnore: /(missing-env|invalid-env)\.spec\.ts/,
    },
    ...(externalBaseURL
      ? []
      : [
          {
            name: "missing-env",
            testMatch: /missing-env\.spec\.ts/,
            use: { ...devices["Desktop Chrome"], baseURL: noEnvBaseURL },
          },
          {
            name: "invalid-env",
            testMatch: /invalid-env\.spec\.ts/,
            use: { ...devices["Desktop Chrome"], baseURL: invalidEnvBaseURL },
          },
        ]),
  ],
  webServer: externalBaseURL
    ? undefined
    : [
        {
          command: "npm run dev",
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
        noEnvServer,
        invalidEnvServer,
      ],
});
