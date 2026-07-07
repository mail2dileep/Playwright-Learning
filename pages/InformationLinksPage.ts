import { Page, Locator } from "@playwright/test";

export class InformationLinksPage {
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(private page: Page) {
    this.howToReadYourBillButton = page.locator("#howToReadYourBillBtn");
    this.howToFindUsageButton = page.locator("#howToFindUsageBtn");
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   * @returns A promise that resolves when the click action is complete.
   */
  async clickHowToReadYourBillButton(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   * @returns A promise that resolves when the click action is complete.
   */
  async clickHowToFindUsageButton(): Promise<void> {
    await this.howToFindUsageButton.click();
  }
}
