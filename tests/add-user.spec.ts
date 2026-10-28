import { test, expect } from "@playwright/test";
import { AddUserPage } from "../pages/add-user.page";
import { HomePage } from "../pages/home.page";
import { AddUserSteps } from "../steps/add-user.steps";
import { type UserDTO } from "../dto/user.dto";
import { deleteUsersByName, getAuthHeaders } from "../api/user.api";

let addUserSteps: AddUserSteps;
let addUserPage: AddUserPage;
let homePage: HomePage;
let createdUserNames: string[];

test.beforeEach(async ({ page }) => {
  addUserSteps = new AddUserSteps(page);
  addUserPage = new AddUserPage(page);
  homePage = new HomePage(page);
  createdUserNames = [];

  await addUserSteps.openAddUserForm();
  await addUserSteps.loginAsUser();

  await expect(addUserPage.heading).toBeVisible();
});

test.afterEach(async ({ request }) => {
  for (const name of createdUserNames) {
    const headers = await getAuthHeaders(request);
    await deleteUsersByName(request, headers, name);
  }
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
  const user: UserDTO = { gender: "2", userName: "Test User", yearOfBirth: "1990" };

  await addUserSteps.fillUserForm(user);

  await expect(addUserPage.genderSelect).toHaveValue(user.gender);
  await expect(addUserPage.userNameInput).toHaveValue(user.userName);
  await expect(addUserPage.yearOfBirthInput).toHaveValue(user.yearOfBirth);
});

test("User is created with valid data", async () => {
  const user: UserDTO = {
    gender: "2",
    userName: `User${Date.now().toString().slice(-6)}`,
    yearOfBirth: "1990",
  };
  createdUserNames.push(user.userName);

  await addUserSteps.createUser(user);

  await expect(homePage.heading).toBeVisible();
  await expect(homePage.userNameCell(user.userName)).toBeVisible();
});

test("User is not created without a name", async ({ page }) => {
  const user: UserDTO = { gender: "2", userName: "", yearOfBirth: "1990" };

  await addUserSteps.createUser(user);

  await expect(addUserPage.userNameError).toBeVisible();
  await expect(page).toHaveURL(AddUserPage.url);
});

test("User under 18 is not created", async ({ page }) => {
  const user: UserDTO = {
    gender: "2",
    userName: `User${Date.now().toString().slice(-6)}`,
    yearOfBirth: "2009",
  };
  createdUserNames.push(user.userName);

  await addUserSteps.createUser(user);

  await expect(addUserPage.yearOfBirthError).toBeVisible();
  await expect(page).toHaveURL(AddUserPage.url);
});
