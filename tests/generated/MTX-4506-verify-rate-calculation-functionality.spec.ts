import { test, expect } from '@playwright/test';

class RateCalculatorPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Commonly used locators
    this.serviceTypeCombo = page.getByRole('combobox', { name: /service type/i });
    this.serviceTypeRadioElectricGas = page.getByRole('radio', { name: /electric\s*and\s*gas/i });
    this.serviceTypeTabElectricGas = page.getByRole('tab', { name: /electric\s*and\s*gas/i });

    this.electricInput = page.getByLabel(/electric meter read/i);
    this.gasInput = page.getByLabel(/gas meter read/i);

    this.calculateButton = page.getByRole('button', { name: /calculate/i });

    // Potential result targets
    this.resultPreferred = page.locator([
      '[data-testid="calculated-price"]',
      '[data-test="calculated-price"]',
      '#calculated-price',
      '#price',
      'output[name="calculated-price"]',
      'output[name="price"]'
    ].join(', '));
  }

  async goto(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async selectServiceTypeElectricAndGas() {
    // Try radio first
    if (await this.serviceTypeRadioElectricGas.isVisible().catch(() => false)) {
      await this.serviceTypeRadioElectricGas.check();
    }
    // Try a tab based UI
    else if (await this.serviceTypeTabElectricGas.isVisible().catch(() => false)) {
      await this.serviceTypeTabElectricGas.click();
    }
    // Try a combobox/select
    else if (await this.serviceTypeCombo.isVisible().catch(() => false)) {
      const optionValue = await this._findOptionValueInCombo(this.serviceTypeCombo, /electric\s*and\s*gas/i);
      if (optionValue) {
        await this.serviceTypeCombo.selectOption(optionValue);
      } else {
        // Fallback attempts
        await this.serviceTypeCombo.selectOption({ label: 'Electric and Gas' }).catch(async () => {
          await this.serviceTypeCombo.click();
          await this.page.getByRole('option', { name: /electric\s*and\s*gas/i }).click();
        });
      }
    } else {
      // Last resort: try clicking a button with that name
      const button = this.page.getByRole('button', { name: /electric\s*and\s*gas/i });
      if (await button.isVisible().catch(() => false)) {
        await button.click();
      } else {
        throw new Error("Unable to locate a control to select 'Electric and Gas' service type.");
      }
    }

    // Expect fields ready for input
    await expect(this.electricInput, 'Electric Meter Read input should be visible after selecting service type').toBeVisible();
    await expect(this.electricInput, 'Electric Meter Read input should be enabled').toBeEnabled();
    await expect(this.gasInput, 'Gas Meter Read input should be visible after selecting service type').toBeVisible();
    await expect(this.gasInput, 'Gas Meter Read input should be enabled').toBeEnabled();
  }

  async fillMeterReads(electricValue, gasValue) {
    await this.electricInput.fill('');
    await this.electricInput.fill(String(electricValue));
    await this.gasInput.fill('');
    await this.gasInput.fill(String(gasValue));

    await expect(this.electricInput).toHaveValue(String(electricValue));
    await expect(this.gasInput).toHaveValue(String(gasValue));
  }

  async clickCalculate() {
    await expect(this.calculateButton, 'Calculate button should be visible').toBeVisible();
    await expect(this.calculateButton, 'Calculate button should be enabled').toBeEnabled();
    await this.calculateButton.click();
  }

  async assertPriceDisplayed() {
    const priceLocator = await this._findCalculatedPriceLocator();
    await expect(priceLocator, 'A calculated price/bill estimate should be displayed').toBeVisible();
    const text = (await priceLocator.textContent())?.trim() || '';
    // Basic sanity: contains at least some digits; prefer currency-like pattern
    const currencyOrNumber = /(\$|£|€)\s?\d{1,3}(,\d{3})*(\.\d{2})?|\b\d{1,3}(,\d{3})+(\.\d{2})?\b|\b\d+(\.\d{2})?\b/;
    expect(currencyOrNumber.test(text)).toBeTruthy();
  }

  async _findCalculatedPriceLocator() {
    // 1) Preferred result targets
    if (await this.resultPreferred.count() > 0) {
      const el = this.resultPreferred.first();
      await expect(el).toBeVisible({ timeout: 10000 });
      // Wait until it contains some digits
      await expect.poll(async () => (await el.textContent()) || '').toMatch(/\d/);
      return el;
    }

    // 2) aria-live regions that often hold computed results
    const liveRegion = this.page.locator('[aria-live="polite"], [aria-live="assertive"]');
    if (await liveRegion.count() > 0) {
      const el = liveRegion.first();
      await expect(el).toBeVisible({ timeout: 10000 });
      await expect.poll(async () => (await el.textContent()) || '').toMatch(/\d/);
      return el;
    }

    // 3) A region/section that semantically mentions an estimate/price/total
    const container = this.page.locator([
      'section:has-text(/estimate|total|price|bill/i)',
      '[role="region"]:has-text(/estimate|total|price|bill/i)',
      'div:has-text(/estimate|total|price|bill/i)'
    ].join(', '));

    if (await container.count() > 0) {
      const region = container.first();
      // Try to find a price-like text inside
      const regionPrice = region.getByText(/(\$|£|€)?\s?\d{1,3}(,\d{3})*(\.\d{2})?\b/);
      await expect(region).toBeVisible({ timeout: 10000 });
      await expect(regionPrice).toBeVisible({ timeout: 10000 });
      return regionPrice.first();
    }

    // 4) Fallback: any price-like text on the page (avoids matching input values)
    const anyPriceText = this.page.getByText(/(\$|£|€)\s?\d{1,3}(,\d{3})*(\.\d{2})?\b/).first();
    if (await anyPriceText.count().catch(() => 0)) {
      await expect(anyPriceText).toBeVisible({ timeout: 10000 });
      return anyPriceText;
    }

    // 5) Last resort: any numeric text that looks like a total, allowing no currency symbol
    const anyNumericText = this.page.getByText(/\b\d{1,3}(,\d{3})+(\.\d{2})?\b/).first();
    await expect(anyNumericText).toBeVisible({ timeout: 10000 });
    return anyNumericText;
  }

  async _findOptionValueInCombo(combo, nameRegex) {
    const options = combo.locator('option');
    const count = await options.count();
    for (let i = 0; i < count; i++) {
      const option = options.nth(i);
      const label = (await option.textContent())?.trim() || '';
      const value = await option.getAttribute('value');
      if (nameRegex.test(label) || (value && nameRegex.test(value))) {
        return value || label;
      }
    }
    return null;
  }
}

test.describe('MTX-4506 Verify Rate Calculation Functionality', () => {
  test('Verify Rate Calculation Functionality', async ({ page }) => {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
    const ratePage = new RateCalculatorPage(page);

    await test.step('Navigate to the Rate Calculator page', async () => {
      await ratePage.goto(BASE_URL);
      // Wait for the Service Type control or the Calculate button to ensure page is ready
      await Promise.race([
        ratePage.serviceTypeCombo.waitFor({ state: 'visible' }).catch(() => Promise.resolve()),
        page.getByText(/service type/i).waitFor({ state: 'visible' }).catch(() => Promise.resolve()),
        ratePage.calculateButton.waitFor({ state: 'visible' }).catch(() => Promise.resolve())
      ]);
    });

    await test.step("Step 1: Select 'Electric and Gas' service type and verify fields are ready", async () => {
      await ratePage.selectServiceTypeElectricAndGas();
    });

    await test.step('Step 2: Enter valid numeric values into Electric and Gas meter read fields', async () => {
      await ratePage.fillMeterReads(500, 200);
    });

    await test.step("Step 3: Click 'Calculate' and verify a price/bill estimate is displayed", async () => {
      await ratePage.clickCalculate();
      await ratePage.assertPriceDisplayed();
    });
  });
});