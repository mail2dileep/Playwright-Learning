import { Page, Locator } from '@playwright/test';

export class RateEstimatorResidentialPage {
  readonly page: Page;
  readonly url: string;

  // Locators
  private readonly rateCalculatorHeading: Locator;
  private readonly rateEstimatorHeading: Locator;
  private readonly rateCalculatorContainer: Locator;
  private readonly cookieAcceptButton: Locator;
  private readonly cookieAgreeButton: Locator;
  private readonly cookieCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.url = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/rate_estimator_residential.html';

    this.rateCalculatorHeading = page.getByRole('heading', { name: /rate calculator/i });
    this.rateEstimatorHeading = page.getByRole('heading', { name: /rate estimator/i });

    this.rateCalculatorContainer = page.locator([
      '[id*="rate"][id*="calc"]',
      '[class*="rate"][class*="calc"]',
      '[id*="rate"][id*="estimat"]',
      '[class*="rate"][class*="estimat"]',
      'section:has(:is(h1,h2,h3,h4):has-text("Rate Calculator"))',
      'div:has(:is(h1,h2,h3,h4):has-text("Rate Calculator"))',
      'section:has(:is(h1,h2,h3,h4):has-text("Rate Estimator"))',
      'div:has(:is(h1,h2,h3,h4):has-text("Rate Estimator"))'
    ].join(', '));

    // Cookie/consent variations
    this.cookieAcceptButton = page.locator('button:has-text("Accept")');
    this.cookieAgreeButton = page.locator('button:has-text("I Agree"), button:has-text("Agree")');
    this.cookieCloseButton = page.locator('button[aria-label="Close"], .cookie-banner button:has-text("Close")');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  async waitForReady(): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch {
      // Non-blocking: proceed even if network doesn't go idle within timeout
    }
  }

  async acceptCookiesIfPresent(): Promise<void> {
    const candidates = [this.cookieAcceptButton, this.cookieAgreeButton, this.cookieCloseButton];
    for (const btn of candidates) {
      const candidate = btn.first();
      if (await candidate.isVisible()) {
        try {
          await candidate.click({ timeout: 2000 });
        } catch {
          // Safely ignore click issues on transient banners
        }
        break;
      }
    }
  }

  async waitForRateCalculatorVisible(options?: { timeout?: number }): Promise<void> {
    const timeout = options?.timeout ?? 15000;
    const start = Date.now();

    try {
      await this.rateCalculatorHeading.first().waitFor({ state: 'visible', timeout });
      return;
    } catch {
      // Fallback to alternate heading
    }

    const elapsed = Date.now() - start;
    const remaining = Math.max(500, timeout - elapsed);

    try {
      await this.rateEstimatorHeading.first().waitFor({ state: 'visible', timeout: remaining });
      return;
    } catch {
      // Fallback to container region
    }

    const elapsed2 = Date.now() - start;
    const remaining2 = Math.max(500, timeout - elapsed2);
    await this.rateCalculatorContainer.first().waitFor({ state: 'visible', timeout: remaining2 });
  }

  async isRateCalculatorSectionVisible(): Promise<boolean> {
    if (await this.rateCalculatorHeading.first().isVisible()) return true;
    if (await this.rateEstimatorHeading.first().isVisible()) return true;
    if (await this.rateCalculatorContainer.first().isVisible()) return true;
    return false;
  }
}
