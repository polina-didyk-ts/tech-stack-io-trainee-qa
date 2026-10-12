import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Max time for one test including beforeEach/fixtures (Playwright default: 30s). */
  timeout: 30_000,
  expect: {
    /* Max time a web-first assertion keeps retrying (Playwright default: 5s). */
    timeout: 5_000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only: locally a failure should show up immediately. */
  retries: process.env.CI ? 2 : 0,
  /* Parallel workers: fewer on CI to keep load on the shared test app low. */
  workers: process.env.CI ? 2 : 4,
  /* Console output + HTML report (open manually: npx playwright show-report). */
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    /* Max time for a single action like click/fill (default: no limit, bounded only by test timeout). */
    actionTimeout: 10_000,
    /* Max time for page.goto and other navigations. */
    navigationTimeout: 15_000,
    /* Attach a screenshot to the report when a test fails. */
    screenshot: "only-on-failure",
    /* Keep trace (steps, DOM snapshots, network, stack) for failed tests only. */
    trace: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
