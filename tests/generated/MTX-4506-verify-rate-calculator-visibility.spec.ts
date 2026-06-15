import { test, expect } from '@playwright/test';

class ResidentialRateEstimatorPage {
  constructor(page) {
    this.page = page;
    this.url = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/rate_estimator_residential.html';

    // A robust locator that attempts to find the "Rate Calculator" heading or a section carrying that label.
    this.rateCalculatorLocator = page.locator(
      [
        // Headings that contain "Rate Calculator" (case-insensitive)
        "xpath=//h1[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'rate calculator')]",
        "xpath=//h2[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'rate calculator')]",
        "xpath=//h3[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'rate calculator')]",
        // A region/section with accessible name "Rate Calculator"
        'role=region[name=/rate calculator/i]',
        // Any element with id or class implying a calculator section
        "xpath=//*[@id='rate-calculator' or contains(@class,'rate-calculator') or contains(@class,'calculator')]",
      ].join(', ')
    );
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
    await expect(this.page, 'Expected to land on the residential rate estimator URL').toHaveURL(/rate_estimator_residential\.html/);
  }

  async dismissPotentialOverlays() {
    // Best-effort: handle cookie consent banners or pop-ups that might obscure content visibility
    const candidates = [
      this.page.getByRole('button', { name: /accept all|accept cookies|accept|i accept|agree|got it/i }),
      this.page.getByRole('button', { name: /close|dismiss/i }),
      this.page.locator('button[aria-label*="accept" i], button[aria-label*="close" i]'),
      this.page.getByRole('link', { name: /accept|close|dismiss/i }),
    ];

    for (const locator of candidates) {
      try {
        if (await locator.first().isVisible()) {
          await locator.first().click({ trial: false }).catch(() => {});
          break;
        }
      } catch {
        // Ignore any errors from transient overlays or detached elements
      }
    }
  }

  async assertRateCalculatorVisible() {
    // Ensure at least one matching element is visible.
    await expect(
      this.rateCalculatorLocator.first(),
      'Expected the Rate Calculator section or heading to be visible on the page'
    ).toBeVisible({ timeout: 15000 });
  }
}

test.describe('MTX-4506 - Verify Rate Calculator Visibility', () => {
  test('Verify Rate Calculator Visibility', async ({ page }) => {
    const estimatorPage = new ResidentialRateEstimatorPage(page);

    await test.step('Navigate to the CPS Energy Rate Estimator URL', async () => {
      await estimatorPage.goto();
      await estimatorPage.dismissPotentialOverlays();
    });

    await test.step('Validate that the Rate Calculator section is visible', async () => {
      await estimatorPage.assertRateCalculatorVisible();
    });
  });
});