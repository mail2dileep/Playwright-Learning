import { Page, Locator } from '@playwright/test';

export class PdfResourcesPage {
  private readonly page: Page;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Encapsulate locators using recommendedLocator from the catalog
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Clicks the 'How to Read Your Bill' link/button.
   */
  async clickHowToReadYourBillLink(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' link/button.
   */
  async clickHowToFindUsageLink(): Promise<void> {
    await this.howToFindUsageButton.click();
  }
}
