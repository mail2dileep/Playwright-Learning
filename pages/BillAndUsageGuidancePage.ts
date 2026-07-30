import { Page, Locator } from '@playwright/test';

export class BillAndUsageGuidancePage {
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(private page: Page) {
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Clicks the 'How to Read Your Bill' link.
   * This action is expected to open a PDF in a new tab or trigger a download.
   */
  async clickHowToReadYourBillLink(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' link.
   * This action is expected to open a PDF in a new tab or trigger a download.
   */
  async clickHowToFindUsageLink(): Promise<void> {
    await this.howToFindUsageButton.click();
  }
}