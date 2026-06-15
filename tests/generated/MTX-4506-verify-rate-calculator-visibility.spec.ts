import { test, expect } from '@playwright/test';

class ResidentialRateEstimatorPage {
  constructor(page) {
    this.page = page;
    this.url = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/rate_estimator_residential.html';
  }

  async goto() {
    const response = await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
    // Allow additional async content to settle
    await this.page.waitForLoadState('networkidle').catch(() => {});
    return response;
  }

  calculatorCandidates() {
    const p = this.page;
    return [
      // Accessible regions/headings that likely identify the calculator
      p.getByRole('region', { name: /rate (calculator|estimator)/i }),
      p.getByRole('heading', { name: /rate (calculator|estimator)/i }),
      // Likely IDs and attributes
      p.locator('#rate-calculator, #calculator, [id*="rate"][id*="calc" i], [id*="rate"][id*="estimat" i]'),
      // Iframe that may host the calculator
      p.locator('iframe[title*="Rate" i], iframe[src*="rate" i], iframe[src*="estimat" i], iframe[src*="calc" i]'),
      // Inside any iframe: look for a heading indicating the calculator
      p.frameLocator('iframe').getByRole('heading', { name: /rate (calculator|estimator)/i }),
      // Generic container with matching text
      p.locator('section, article, div').filter({ hasText: /rate (calculator|estimator)/i }).first(),
    ];
  }

  async findVisibleRateCalculator() {
    const candidates = this.calculatorCandidates();
    for (const candidate of candidates) {
      const loc = candidate.first();
      const count = await loc.count().catch(() => 0);
      if (count > 0) {
        const vis = await loc.isVisible().catch(() => false);
        if (vis) return loc;
      }
    }
    return null;
  }
}

test.describe('MTX-4506 - Verify Rate Calculator Visibility', () => {
  test('Verify Rate Calculator Visibility', async ({ page }) => {
    const estimatorPage = new ResidentialRateEstimatorPage(page);

    // Step 1: Navigate to the CPS Energy Rate Estimator URL
    const response = await estimatorPage.goto();

    // Assert page loaded successfully
    expect(response && response.ok()).toBeTruthy();
    await expect(page).toHaveURL(/rate_estimator_residential\.html/i);

    // Assert the Rate Calculator section is visible
    const visibleCalculator = await estimatorPage.findVisibleRateCalculator();
    expect(visibleCalculator, 'Expected the Rate Calculator section to be present and visible on the page').not.toBeNull();
    if (visibleCalculator) {
      await expect(visibleCalculator).toBeVisible();
    }
  });
});