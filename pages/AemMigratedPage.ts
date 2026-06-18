import { Page, Locator, APIResponse } from '@playwright/test';

export class AemMigratedPage {
  private readonly page: Page;
  private readonly head: Locator;

  constructor(page: Page) {
    this.page = page;
    this.head = page.locator('head');
  }

  async openMigratedPage(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'load' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.head.waitFor({ state: 'attached' });
  }

  async isPageLoaded(): Promise<boolean> {
    const state = await this.page.evaluate(() => document.readyState);
    return state === 'complete' || state === 'interactive';
  }

  async isHeadPresent(): Promise<boolean> {
    const count = await this.head.count();
    return count > 0;
  }

  async getDomPageSource(): Promise<string> {
    return await this.page.content();
  }

  async getOriginalPageSource(): Promise<string> {
    const url = this.page.url();
    const response: APIResponse = await this.page.request.get(url, { failOnStatusCode: false });
    if (!response.ok()) {
      const status = response.status();
      const statusText = response.statusText();
      throw new Error(`Failed to retrieve original page source. HTTP ${status} ${statusText} for ${url}`);
    }
    return await response.text();
  }

  async getHeadMarkupFromOriginalSource(): Promise<string> {
    const html = await this.getOriginalPageSource();
    const head = this.extractHeadMarkup(html);
    return head ?? '';
  }

  async headContainsTermInOriginalSource(term: string): Promise<boolean> {
    const head = await this.getHeadMarkupFromOriginalSource();
    return head.toLowerCase().includes((term || '').toLowerCase());
  }

  private extractHeadMarkup(html: string): string | null {
    if (!html) return null;
    const match = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    return match ? match[1] : null;
  }
}
