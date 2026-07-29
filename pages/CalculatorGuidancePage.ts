import { Page, Locator } from "@playwright/test";

export class CalculatorGuidancePage {
  private readonly page: Page;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locator for 'How to Read Your Bill' button, using recommendedLocator '#howToReadYourBillBtn'
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    // Locator for 'How to Find Usage' button, using recommendedLocator '#howToFindUsageBtn'
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   * This action is typically expected to open a new tab/popup or trigger a download for a PDF document.
   */
  async clickHowToReadYourBillButton(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   * This action is typically expected to open a new tab/popup or trigger a download for a PDF document.
   */
  async clickHowToFindUsageButton(): Promise<void> {
    await this.howToFindUsageButton.click();
  }
}