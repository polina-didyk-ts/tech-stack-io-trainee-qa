import { type Page, type Locator } from "@playwright/test";

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

  async fillForm({
    gender,
    userName,
    yearOfBirth,
  }: {
    gender?: string;
    userName?: string;
    yearOfBirth?: string;
  }) {
    if (gender !== undefined) await this.genderSelect.selectOption(gender);
    if (userName !== undefined) await this.userNameInput.fill(userName);
    if (yearOfBirth !== undefined) await this.yearOfBirthInput.fill(yearOfBirth);
  }

  async submit() {
    await this.createButton.click();
  }
}
