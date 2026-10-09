import { type Page, type Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Users and Addresses" });
  }

  userRow(userName: string): Locator {
    return this.page.locator(`//td[normalize-space(text())="${userName}"]/ancestor::tr`);
  }

  userNameCell(userName: string): Locator {
    return this.page.getByRole("cell", { name: userName });
  }
}
