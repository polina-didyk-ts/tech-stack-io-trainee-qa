import { type Page, type Locator } from "@playwright/test";
import { UserDTO } from "../dto/user.dto";

export class AddUserPage {
  static readonly url = "https://traineeautomation.azurewebsites.net/Forms/User/AddUser";

  readonly page: Page;
  readonly heading: Locator;
  readonly genderSelect: Locator;
  readonly userNameInput: Locator;
  readonly yearOfBirthInput: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;
  readonly userNameError: Locator;
  readonly yearOfBirthError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Add User" });
    this.genderSelect = page.getByTestId("select-Gender");
    this.userNameInput = page.getByTestId("input-UserName");
    this.yearOfBirthInput = page.getByTestId("input-YearOfBirth");
    this.createButton = page.getByTestId("button-Create");
    this.cancelButton = page.getByTestId("button-Cancel");
    this.userNameError = page.getByTestId("inputError-UserName");
    this.yearOfBirthError = page.getByTestId("inputError-YearOfBirth");
  }

  async goto() {
    await this.page.goto(AddUserPage.url);
  }

  async fillForm(user: UserDTO) {
    await this.genderSelect.selectOption(user.gender);
    await this.userNameInput.fill(user.userName);
    await this.yearOfBirthInput.fill(user.yearOfBirth);
  }

  async submit() {
    await this.createButton.click();
  }
}
