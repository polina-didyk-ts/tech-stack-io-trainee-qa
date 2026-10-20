import { type Page } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { AddUserPage } from "../pages/add-user.page";
import { type UserDTO } from "../dto/user.dto";

export class AddUserSteps {
  private readonly loginPage: LoginPage;
  private readonly addUserPage: AddUserPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.addUserPage = new AddUserPage(page);
  }

  async openAddUserForm() {
    await this.addUserPage.goto();
  }

  async loginAsUser() {
    await this.loginPage.login("user", "123");
  }

  async fillUserForm(user: UserDTO) {
    await this.addUserPage.fillForm(user);
  }

  async createUser(user: UserDTO) {
    await this.fillUserForm(user);
    await this.addUserPage.submit();
  }
}
