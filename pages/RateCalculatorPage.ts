import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Clicks on the 'How to Read Your Bill' link.
   * This action is expected to open a new tab or trigger a download.
   */
  async clickHowToReadYourBillLink(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks on the 'How to Find Usage' link.
   * This action is expected to open a new tab or trigger a download.
   */
  async clickHowToFindUsageLink(): Promise<void> {
    await this.howToFindUsageButton.click();
  }
}