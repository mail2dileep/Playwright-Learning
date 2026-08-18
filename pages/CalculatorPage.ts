import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(private page: Page) {
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Clicks the 'How to Read Your Bill' link and waits for a new page (popup/new tab) to open.
   * @returns A Promise that resolves to the new Page object that opened.
   */
  async clickHowToReadYourBillLink(): Promise<Page> {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.howToReadYourBillButton.click()
    ]);
    return popup;
  }

  /**
   * Clicks the 'How to Find Usage' link and waits for a new page (popup/new tab) to open.
   * @returns A Promise that resolves to the new Page object that opened.
   */
  async clickHowToFindUsageLink(): Promise<Page> {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.howToFindUsageButton.click()
    ]);
    return popup;
  }
}