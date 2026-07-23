import { Page, Locator } from '@playwright/test';

export class ResourcesPage {
  private readonly page: Page;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Using recommendedLocator: locator('#howToReadYourBillBtn')
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    // Using recommendedLocator: locator('#howToFindUsageBtn')
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Clicks the 'How to read your bill' button and waits for a new page (popup) to open.
   * @returns A Promise that resolves to the new Page object representing the popup.
   */
  async clickHowToReadYourBillLink(): Promise<Page> {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.howToReadYourBillButton.click(),
    ]);
    return popup;
  }

  /**
   * Clicks the 'How to find Usage' button and waits for a new page (popup) to open.
   * @returns A Promise that resolves to the new Page object representing the popup.
   */
  async clickHowToFindUsageLink(): Promise<Page> {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.howToFindUsageButton.click(),
    ]);
    return popup;
  }
}