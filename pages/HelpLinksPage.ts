import { Page, Locator } from '@playwright/test';

export class HelpLinksPage {
  private readonly page: Page;
  private readonly _howToReadYourBillBtn: Locator;
  private readonly _howToFindUsageBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators for 'How to Read Your Bill' link
    this._howToReadYourBillBtn = page.locator('#howToReadYourBillBtn');
    // Locators for 'How to Find Usage' link
    this._howToFindUsageBtn = page.locator('#howToFindUsageBtn');
  }

  /**
   * Clicks on the 'How to Read Your Bill' link and waits for a new popup page to appear.
   * @returns A promise that resolves to the new Page object of the opened PDF document.
   */
  async clickHowToReadYourBillLink(): Promise<Page> {
    // Waits for the popup event to occur after clicking the button.
    // The popup event signifies a new window or tab opening.
    const [pdfPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      this._howToReadYourBillBtn.click()
    ]);
    return pdfPage;
  }

  /**
   * Clicks on the 'How to Find Usage' link and waits for a new popup page to appear.
   * @returns A promise that resolves to the new Page object of the opened PDF document.
   */
  async clickHowToFindUsageLink(): Promise<Page> {
    // Waits for the popup event to occur after clicking the button.
    // The popup event signifies a new window or tab opening.
    const [pdfPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      this._howToFindUsageBtn.click()
    ]);
    return pdfPage;
  }
}