import { test, expect } from "@playwright/test";

const BASE_URL = "https://traineeautomation.azurewebsites.net";
const ADD_USER_URL = `${BASE_URL}/Forms/User/AddUser`;

test.beforeEach(async ({ page }) => {
  await page.goto(ADD_USER_URL);
  await page.getByTestId("username-field").getByTestId("input").fill("user");
  await page.getByTestId("password-field").getByTestId("input").fill("123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Add User" })).toBeVisible();
});

test("Add User form is displayed with all fields", async ({ page }) => {
  await expect(page).toHaveURL(ADD_USER_URL);
  await expect(page.getByTestId("select-Gender")).toBeVisible();
  await expect(page.getByTestId("input-UserName")).toBeVisible();
  await expect(page.getByTestId("input-YearOfBirth")).toBeVisible();
  await expect(page.getByTestId("button-Create")).toBeVisible();
  await expect(page.getByTestId("button-Cancel")).toBeVisible();
});

test("Input fields accept entered values", async ({ page }) => {
  await page.getByTestId("select-Gender").selectOption("2");
  await page.getByTestId("input-UserName").fill("Test User");
  await page.getByTestId("input-YearOfBirth").fill("1990");

  await expect(page.getByTestId("select-Gender")).toHaveValue("2");
  await expect(page.getByTestId("input-UserName")).toHaveValue("Test User");
  await expect(page.getByTestId("input-YearOfBirth")).toHaveValue("1990");
});

test("User is created with valid data", async ({ page }) => {
  const userName = `User${Date.now().toString().slice(-6)}`;

  await page.getByTestId("select-Gender").selectOption("2");
  await page.getByTestId("input-UserName").fill(userName);
  await page.getByTestId("input-YearOfBirth").fill("1990");
  await page.getByTestId("button-Create").click();

  await expect(page.getByRole("heading", { name: "Users and Addresses" })).toBeVisible();
  await expect(page.getByRole("cell", { name: userName })).toBeVisible();
});

test("User is not created without a name", async ({ page }) => {
  await page.getByTestId("select-Gender").selectOption("2");
  await page.getByTestId("input-YearOfBirth").fill("1990");
  await page.getByTestId("button-Create").click();

  await expect(page.getByText("Name is requried")).toBeVisible();
  await expect(page).toHaveURL(ADD_USER_URL);
});

test("User under 18 is not created", async ({ page }) => {
  await page.getByTestId("select-Gender").selectOption("2");
  await page.getByTestId("input-UserName").fill(`User${Date.now().toString().slice(-6)}`);
  await page.getByTestId("input-YearOfBirth").fill("2009");
  await page.getByTestId("button-Create").click();

  await expect(page.getByText("Not valid Year of Birth is set")).toBeVisible();
  await expect(page).toHaveURL(ADD_USER_URL);
});
