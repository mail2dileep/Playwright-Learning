import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  private readonly page: Page;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Navigates to the calculator page.
   * @param url The specific path to the calculator page, defaults to '/'.
   */
  async navigateToCalculatorPage(url: string = '/'): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Clicks the 'How to read your bill' button and waits for a new page (PDF) to open.
   * @returns A promise that resolves to the new Playwright Page object representing the PDF document.
   */
  async clickHowToReadYourBill(): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.howToReadYourBillButton.click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }

  /**
   * Clicks the 'How to find Usage' button and waits for a new page (PDF) to open.
   * @returns A promise that resolves to the new Playwright Page object representing the PDF document.
   */
  async clickHowToFindUsage(): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.howToFindUsageButton.click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }
}