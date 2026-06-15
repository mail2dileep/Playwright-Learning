import { test, expect } from '@playwright/test';

class RateEstimatorResidentialPage {
  constructor(page) {
    this.page = page;
  }

  async findVisibleLocator(factory, timeout = 5000) {
    const scopes = [this.page, ...this.page.frames()];
    for (const scope of scopes) {
      const locator = factory(scope).first();
      try {
        await locator.waitFor({ state: 'visible', timeout });
        return locator;
      } catch {
        // try next scope
      }
    }
    return null;
  }

  async getCalculateButton() {
    const loc = await this.findVisibleLocator((s) => s.getByRole('button', { name: /calculate/i }), 7000);
    if (loc) return loc;
    throw new Error('Calculate button was not found or not visible.');
  }

  async getResetButton() {
    const loc = await this.findVisibleLocator((s) => s.getByRole('button', { name: /reset/i }), 7000);
    if (loc) return loc;
    throw new Error('Reset button was not found or not visible.');
  }

  async hasServiceType() {
    // Prefer a combobox (dropdown)
    const combo = await this.findVisibleLocator((s) => s.getByRole('combobox', { name: /service\s*type/i }), 2000);
    if (combo) return true;

    // Fieldset/group containing radios
    const group = await this.findVisibleLocator((s) => s.getByRole('group', { name: /service\s*type/i }), 2000);
    if (group) {
      const radios = group.getByRole('radio');
      if ((await radios.count()) > 0) return true;
    }

    // Fallback: any radio that itself is labeled Service Type
    const radioLabeled = await this.findVisibleLocator((s) => s.getByRole('radio', { name: /service\s*type/i }), 2000);
    if (radioLabeled) return true;

    return false;
  }

  async getElectricMeterReadInput() {
    const candidates = [
      (s) => s.getByLabel(/electric(ity)?\s*meter\s*read/i),
      (s) => s.getByPlaceholder(/electric(ity)?\s*meter/i),
      (s) => s.locator('input[aria-label*="Electric"][aria-label*="Meter"]'),
    ];
    for (const c of candidates) {
      const loc = await this.findVisibleLocator(c, 4000);
      if (loc) return loc;
    }
    throw new Error('Electric Meter Read field was not found or not visible.');
  }

  async getGasMeterReadInput() {
    const candidates = [
      (s) => s.getByLabel(/gas\s*meter\s*read/i),
      (s) => s.getByPlaceholder(/gas\s*meter/i),
      (s) => s.locator('input[aria-label*="Gas"][aria-label*="Meter"]'),
    ];
    for (const c of candidates) {
      const loc = await this.findVisibleLocator(c, 4000);
      if (loc) return loc;
    }
    throw new Error('Gas Meter Read field was not found or not visible.');
  }
}

async function dismissBanners(page) {
  // Common cookie/consent banners
  const candidates = [
    page.locator('#onetrust-accept-btn-handler'),
    page.getByRole('button', { name: /accept all|accept|agree|i agree|got it|okay|ok/i }),
    page.getByRole('button', { name: /close/i }),
    page.getByText(/accept all cookies/i),
  ];
  for (const c of candidates) {
    try {
      await c.first().click({ timeout: 2000 });
      // Slight delay to allow UI to reflow after closing
      await page.waitForTimeout(300);
    } catch {
      // ignore if not present
    }
  }
}

test.describe('MTX-4506 - Verify Rate Calculator Visibility and Initial State', () => {
  test('Verify Rate Calculator Visibility and Initial State', async ({ page }) => {
    // Step 1: Navigate to the Rate Estimator Residential page
    await test.step('Navigate to the Rate Estimator Residential page', async () => {
      await page.goto('https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/rate_estimator_residential.html', { waitUntil: 'domcontentloaded' });
      await dismissBanners(page);
      await page.waitForLoadState('networkidle').catch(() => {});
      // Page header present
      const header = page.getByRole('heading', { name: /rate estimator residential|rate estimator/i }).first();
      await expect(header, 'Rate Estimator page heading should be visible').toBeVisible();
    });

    const ratePage = new RateEstimatorResidentialPage(page);

    // Expected Result: The rate calculator section is visible and correctly rendered.
    await test.step('Verify calculator section is visible and correctly rendered', async () => {
      const calcBtn = await ratePage.getCalculateButton();
      const resetBtn = await ratePage.getResetButton();
      await expect(calcBtn, 'Calculate button should be visible').toBeVisible();
      await expect(resetBtn, 'Reset button should be visible').toBeVisible();
    });

    // Step 2: Check for presence of Service Type selection, Meter Read fields, and buttons
    await test.step('Verify presence of Service Type selection, Meter Read fields, and action buttons', async () => {
      const serviceTypePresent = await ratePage.hasServiceType();
      expect(serviceTypePresent, 'Service Type selection (dropdown or radio) should be present').toBeTruthy();

      const electricInput = await ratePage.getElectricMeterReadInput();
      await expect(electricInput, 'Electric Meter Read field should be visible').toBeVisible();

      const gasInput = await ratePage.getGasMeterReadInput();
      await expect(gasInput, 'Gas Meter Read field should be visible').toBeVisible();

      const calcBtn = await ratePage.getCalculateButton();
      const resetBtn = await ratePage.getResetButton();
      await expect(calcBtn, 'Calculate button should be enabled').toBeEnabled();
      await expect(resetBtn, 'Reset button should be enabled').toBeEnabled();
    });
  });
});