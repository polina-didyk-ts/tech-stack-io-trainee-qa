import { test, expect, type Page } from "@playwright/test";
import { createUser, deleteUser, getAuthHeaders, type AuthHeaders } from "../api/user.api";

const HOME_URL = "/";
const ADD_ADDRESS_URL = "/Forms/Address/AddAddress";

async function login(page: Page) {
  await page.getByTestId("username-field").getByTestId("input").fill("user");
  await page.getByTestId("password-field").getByTestId("input").fill("123");
  await page.getByRole("button", { name: "Sign in" }).click();
}

test.describe("User table — XPath axes", () => {
  let headers: AuthHeaders;
  let userName: string;
  let userId: string;

  test.beforeEach(async ({ page, request }) => {
    headers = await getAuthHeaders(request);
    userName = `U${Date.now().toString().slice(-5)}${Math.floor(Math.random() * 100)}`;
    userId = await createUser(request, headers, { name: userName, yearOfBirth: 1990, gender: 2 });

    await page.goto(HOME_URL);
    await login(page);

    await expect(page.getByRole("heading", { name: "Users and Addresses" })).toBeVisible();
  });

  test.afterEach(async ({ request }) => {
    await deleteUser(request, headers, userId);
  });

  test("Year of birth is shown in the row of the created user", async ({ page }) => {
    const yearCell = page.locator(
      `//td[@data-testid="td-UserName"][normalize-space(text())="${userName}"]` +
        `/following-sibling::td[@data-testid="td-YearOfBirth"]`,
    );

    await expect(yearCell).toHaveText("1990");
  });

  test("Gender is shown in the row of the created user", async ({ page }) => {
    const genderCell = page.locator(
      `//td[@data-testid="td-UserName"][normalize-space(text())="${userName}"]` +
        `/parent::tr/td[@data-testid="td-Gender"]`,
    );

    await expect(genderCell).toContainText("Female");
  });

  test("Created user row has Edit and Delete actions", async ({ page }) => {
    const row = page.locator(`//td[normalize-space(text())="${userName}"]/ancestor::tr`);

    await expect(row.locator('//a[@data-testid="button-Edit"]')).toBeVisible();
    await expect(row.locator('//a[@data-testid="button-Delete"]')).toBeVisible();
  });
});

test.describe("Add Address form — XPath functions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ADD_ADDRESS_URL);
    await login(page);
    await expect(page.getByRole("heading", { name: "Add Address" })).toBeVisible();
  });

  test("All address fields are rendered", async ({ page }) => {
    const addressInputs = page.locator('//input[starts-with(@id, "Address_")]');

    await expect(addressInputs).toHaveCount(4);
  });

  test("Create button is found by its text", async ({ page }) => {
    const createButton = page.locator('//button[contains(normalize-space(text()), "Create")]');

    await expect(createButton).toBeVisible();
  });
});
