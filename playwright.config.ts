import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end checks run against the production build on :3000.
 * Locally they use the installed Google Chrome (no browser download);
 * CI falls back to Playwright's bundled Chromium.
 */
export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  timeout: 30_000,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"], channel: process.env.CI ? undefined : "chrome" },
    },
  ],
});
