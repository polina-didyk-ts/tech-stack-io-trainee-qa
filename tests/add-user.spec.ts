import { test, expect } from "@playwright/test";
import { AddUserPage } from "../pages/add-user.page";
import { HomePage } from "../pages/home.page";
import { AddUserSteps } from "../steps/add-user.steps";

let addUserSteps: AddUserSteps;
let addUserPage: AddUserPage;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  addUserSteps = new AddUserSteps(page);
  addUserPage = new AddUserPage(page);
  homePage = new HomePage(page);

  await addUserSteps.openAddUserForm();
  await addUserSteps.loginAsUser();

  await expect(addUserPage.heading).toBeVisible();
});

test("Add User form is displayed with all fields", async ({ page }) => {
  await expect(page).toHaveURL(AddUserPage.url);
  await expect(addUserPage.genderSelect).toBeVisible();
  await expect(addUserPage.userNameInput).toBeVisible();
  await expect(addUserPage.yearOfBirthInput).toBeVisible();
  await expect(addUserPage.createButton).toBeVisible();
  await expect(addUserPage.cancelButton).toBeVisible();
});

test("Input fields accept entered values", async () => {
  await addUserSteps.fillUserForm({ gender: "2", userName: "Test User", yearOfBirth: "1990" });

  await expect(addUserPage.genderSelect).toHaveValue("2");
  await expect(addUserPage.userNameInput).toHaveValue("Test User");
  await expect(addUserPage.yearOfBirthInput).toHaveValue("1990");
});

test("User is created with valid data", async () => {
  const userName = `User${Date.now().toString().slice(-6)}`;

  await addUserSteps.createUser({ gender: "2", userName, yearOfBirth: "1990" });

  await expect(homePage.heading).toBeVisible();
  await expect(homePage.userNameCell(userName)).toBeVisible();
});

test("User is not created without a name", async ({ page }) => {
  await addUserSteps.createUser({ gender: "2", userName: "", yearOfBirth: "1990" });

  await expect(addUserPage.userNameError).toBeVisible();
  await expect(page).toHaveURL(AddUserPage.url);
});

test("User under 18 is not created", async ({ page }) => {
  await addUserSteps.createUser({
    gender: "2",
    userName: `User${Date.now().toString().slice(-6)}`,
    yearOfBirth: "2009",
  });

  await expect(addUserPage.yearOfBirthError).toBeVisible();
  await expect(page).toHaveURL(AddUserPage.url);
});
