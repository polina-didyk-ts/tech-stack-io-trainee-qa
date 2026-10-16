import { test, expect } from "@playwright/test";
import { AddUserPage } from "../pages/add-user.page";
import { HomePage } from "../pages/home.page";
import { AddUserSteps } from "../steps/add-user.steps";
import { UserDTO } from "../dto/user.dto";

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
  const user = new UserDTO("2", "Test User", "1990");

  await addUserSteps.fillUserForm(user);

  await expect(addUserPage.genderSelect).toHaveValue(user.gender);
  await expect(addUserPage.userNameInput).toHaveValue(user.userName);
  await expect(addUserPage.yearOfBirthInput).toHaveValue(user.yearOfBirth);
});

test("User is created with valid data", async () => {
  const user = new UserDTO("2", `User${Date.now().toString().slice(-6)}`, "1990");

  await addUserSteps.createUser(user);

  await expect(homePage.heading).toBeVisible();
  await expect(homePage.userNameCell(user.userName)).toBeVisible();
});

test("User is not created without a name", async ({ page }) => {
  const user = new UserDTO("2", "", "1990");

  await addUserSteps.createUser(user);

  await expect(addUserPage.userNameError).toBeVisible();
  await expect(page).toHaveURL(AddUserPage.url);
});

test("User under 18 is not created", async ({ page }) => {
  const user = new UserDTO("2", `User${Date.now().toString().slice(-6)}`, "2009");

  await addUserSteps.createUser(user);

  await expect(addUserPage.yearOfBirthError).toBeVisible();
  await expect(page).toHaveURL(AddUserPage.url);
});
