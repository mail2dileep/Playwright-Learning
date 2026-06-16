import { Page, Locator, Download } from '@playwright/test';

export type LinkOpenResult =
  | { type: 'popup'; page: Page }
  | { type: 'download'; download: Download };

export class BillingHelpPage {
  private readonly page: Page;
  private readonly howToReadBillLink: Locator;
  private readonly howToFindUsageLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.howToReadBillLink = this.page.getByRole('link', { name: /how to read your bill/i });
    this.howToFindUsageLink = this.page.getByRole('link', { name: /how to find usage/i });
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async openHowToReadYourBillPdf(options?: { timeout?: number }): Promise<LinkOpenResult> {
    return this.openLinkExpectingPdf(this.howToReadBillLink, options);
  }

  async openHowToFindUsagePdf(options?: { timeout?: number }): Promise<LinkOpenResult> {
    return this.openLinkExpectingPdf(this.howToFindUsageLink, options);
  }

  private async openLinkExpectingPdf(link: Locator, options?: { timeout?: number }): Promise<LinkOpenResult> {
    const timeout = options?.timeout ?? 15000;
    await link.waitFor({ state: 'visible', timeout });

    const popupPromise = this.page.waitForEvent('popup', { timeout });
    const downloadPromise = this.page.waitForEvent('download', { timeout });

    await link.click();

    const winner = await Promise.race<
      { type: 'popup'; page: Page } | { type: 'download'; download: Download }
    >([
      popupPromise.then((p) => ({ type: 'popup' as const, page: p })),
      downloadPromise.then((d) => ({ type: 'download' as const, download: d })),
    ]);

    return winner;
  }
}
