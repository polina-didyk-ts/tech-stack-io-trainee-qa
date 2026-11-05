import { test, expect } from "@playwright/test";

// TEMPORARY: fails on purpose to check the Slack notification in CI. Remove after the check.
test("Slack notification check fails on purpose", async () => {
  expect(true, "Intentional failure to trigger the Slack notification").toBe(false);
});
