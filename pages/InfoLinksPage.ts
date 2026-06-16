import { Page, Locator } from '@playwright/test';

export class InfoLinksPage {
  private readonly page: Page;
  private readonly howToReadYourBillLink: Locator;
  private readonly howToFindUsageLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.howToReadYourBillLink = page.getByRole('link', { name: 'How to read your bill' });
    this.howToFindUsageLink = page.getByRole('link', { name: 'How to find Usage' });
  }

  async open(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async openHowToReadYourBillDocument(): Promise<string> {
    return await this.openPdfFromLink(this.howToReadYourBillLink);
  }

  async openHowToFindUsageDocument(): Promise<string> {
    return await this.openPdfFromLink(this.howToFindUsageLink);
  }

  private async openPdfFromLink(link: Locator): Promise<string> {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup').catch(() => null),
      link.click()
    ]);

    if (popup) {
      try {
        await popup.waitForLoadState('domcontentloaded', { timeout: 10000 });
      } catch {}
      let popupUrl = popup.url();
      if (!popupUrl || popupUrl === 'about:blank') {
        try {
          await popup.waitForURL(/.+/, { timeout: 5000 });
        } catch {}
        popupUrl = popup.url();
      }
      return popupUrl;
    } else {
      try {
        await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      } catch {}
      return this.page.url();
    }
  }
}
