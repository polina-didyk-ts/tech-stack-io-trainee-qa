import { test, type Page } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { AddUserPage, type UserFormData } from "../pages/add-user.page";

export class AddUserSteps {
  private readonly loginPage: LoginPage;
  private readonly addUserPage: AddUserPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.addUserPage = new AddUserPage(page);
  }

  async openAddUserForm() {
    await test.step("Log in and open the Add User form", async () => {
      await this.addUserPage.goto();
      await this.loginPage.login("user", "123");
    });
  }

  async fillForm(data: UserFormData) {
    await test.step("Fill the Add User form", async () => {
      await this.addUserPage.fillForm(data);
    });
  }

  async submitForm(data: UserFormData) {
    await test.step("Submit the Add User form", async () => {
      await this.fillForm(data);
      await this.addUserPage.submit();
    });
  }
}
