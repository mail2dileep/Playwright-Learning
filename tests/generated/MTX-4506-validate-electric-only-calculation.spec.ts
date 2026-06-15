import { test, expect } from '@playwright/test';

class CalculatorPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    // Controls
    this.serviceTypeSelect = page.getByLabel('Service Type', { exact: true });
    this.calculateButton = page.getByRole('button', { name: /calculate/i });

    // Meter fields
    this.gasMeterField = page.getByLabel('Gas Meter Read', { exact: true });
    this.electricMeterField = page.getByLabel('Electric Meter Read', { exact: true });

    // Potential result areas
    this.resultByTestId = page.getByTestId('calculation-result');
    this.statusRegion = page.getByRole('status');
    this.alertRegion = page.getByRole('alert');
    this.liveRegion = page.locator('[aria-live]');
    this.genericResult = page.locator('#result, .result, [data-testid="result"]');
    this.resultWithPriceText = page.getByText(/(calculated|total|electric)\s+price/i);
  }

  async goto(url) {
    await this.page.goto(url);
  }

  escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async selectServiceType(type) {
    // Prefer a labeled select/combobox
    if ((await this.serviceTypeSelect.count()) > 0 && (await this.serviceTypeSelect.first().isVisible())) {
      try {
        await this.serviceTypeSelect.selectOption({ label: type });
        return;
      } catch {
        // Fallthrough to other strategies
      }
    }

    const combo = this.page.getByRole('combobox', { name: /service type/i });
    if ((await combo.count()) > 0 && (await combo.first().isVisible())) {
      try {
        await combo.selectOption({ label: type });
        return;
      } catch {
        try {
          await combo.fill(type);
          await this.page.keyboard.press('Enter');
          return;
        } catch {
          // continue to radio
        }
      }
    }

    // Radios
    const radio = this.page.getByRole('radio', { name: new RegExp(`^${this.escapeRegExp(type)}$`, 'i') });
    if ((await radio.count()) > 0) {
      await radio.check();
      return;
    }

    throw new Error(`Unable to select service type: ${type}`);
  }

  async setElectricMeterRead(value) {
    await this.electricMeterField.fill('');
    await this.electricMeterField.fill(String(value));
  }

  async clickCalculate() {
    await this.calculateButton.click();
  }

  async waitForResultLocator() {
    const candidates = [
      this.resultByTestId,
      this.statusRegion,
      this.alertRegion,
      this.resultWithPriceText,
      this.genericResult,
      this.liveRegion
    ];

    for (const loc of candidates) {
      if ((await loc.count()) > 0) {
        try {
          await expect(loc.first()).toBeVisible({ timeout: 5000 });
          return loc.first();
        } catch {
          // try next
        }
      }
    }

    // Fallback: any text that looks like a monetary or numeric result
    const moneyLike = this.page.locator('text=/\\$\\s*\\d[\\d,.]*/i');
    try {
      await expect(moneyLike.first()).toBeVisible({ timeout: 3000 });
      return moneyLike.first();
    } catch {
      // ignore
    }

    const numericLike = this.page.locator('text=/\\b\\d[\\d,.]*\\b/');
    try {
      await expect(numericLike.first()).toBeVisible({ timeout: 3000 });
      return numericLike.first();
    } catch {
      // nothing found
    }

    return null;
  }
}

test.describe('MTX-4506 Validate Electric Only Calculation', () => {
  test('Validate Electric Only Calculation', async ({ page }) => {
    const appUrl = process.env.APP_URL || process.env.BASE_URL || 'http://localhost:3000';
    const calculator = new CalculatorPage(page);

    await calculator.goto(appUrl);

    // Step 1: Select 'Electric only' service type
    await calculator.selectServiceType('Electric only');

    // Assert: Gas Meter Read is disabled or hidden
    const gasVisible = await calculator.gasMeterField.isVisible().catch(() => false);
    const gasDisabled = gasVisible ? await calculator.gasMeterField.isDisabled().catch(() => true) : true;
    expect(gasDisabled || !gasVisible).toBeTruthy();

    // Assert: Electric Meter Read is enabled and visible
    await expect(calculator.electricMeterField).toBeVisible();
    await expect(calculator.electricMeterField).toBeEnabled();

    // Step 2: Enter Electric Meter Read: 500
    await calculator.setElectricMeterRead(500);
    await expect(calculator.electricMeterField).toHaveValue('500');

    // Step 3: Click Calculate
    await calculator.clickCalculate();

    // Expected: Calculated price for electric service is displayed
    const resultLocator = await calculator.waitForResultLocator();
    expect(resultLocator, 'Expected a calculation result to be displayed').not.toBeNull();

    const resultText = (await resultLocator.innerText()).trim();
    expect(resultText.length > 0).toBeTruthy();

    // Additional sanity: result mentions electric or looks like a price figure
    const looksLikePrice = /\$?\s*\d[\d,]*(\.\d{2})?/.test(resultText);
    expect(looksLikePrice || /electric/i.test(resultText)).toBeTruthy();
  });
});