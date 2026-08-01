import { Page, Locator } from '@playwright/test';

export class ResourceLinksPage {
  private readonly howToReadYourBillBtn: Locator;
  private readonly howToFindUsageBtn: Locator;

  constructor(private readonly page: Page) {
    this.howToReadYourBillBtn = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageBtn = page.locator('#howToFindUsageBtn');
  }

  /**
   * Clicks on the 'How to Read Your Bill' link/button.
   */
  async clickHowToReadYourBillLink(): Promise<void> {
    await this.howToReadYourBillBtn.click();
  }

  /**
   * Clicks on the 'How to Find Usage' link/button.
   */
  async clickHowToFindUsageLink(): Promise<void> {
    await this.howToFindUsageBtn.click();
  }

  /**
   * Retrieves the URL of the 'How to Read Your Bill' link.
   * This method would typically be used to get the href attribute if it were a direct <a> tag.
   * For buttons, this simulates navigation and captures the new page if it's a popup.
   * @returns A promise that resolves to the URL of the opened PDF or null if not found.
   */
  async getHowToReadYourBillPdfUrl(): Promise<string | null> {
    const [newPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.clickHowToReadYourBillLink(),
    ]);
    const url = newPage.url();
    await newPage.close();
    return url;
  }

  /**
   * Retrieves the URL of the 'How to Find Usage' link.
   * Similar to the above, this captures the new page if it's a popup.
   * @returns A promise that resolves to the URL of the opened PDF or null if not found.
   */
  async getHowToFindUsagePdfUrl(): Promise<string | null> {
    const [newPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.clickHowToFindUsageLink(),
    ]);
    const url = newPage.url();
    await newPage.close();
    return url;
  }
}
