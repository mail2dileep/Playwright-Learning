import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

class CalculatorPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Core UI elements with resilient selectors
    this.serviceType = page.locator(':is([data-testid="service-type"], select[name="serviceType"], select#serviceType, select[aria-label="Service type"], select[aria-label="Service Type"])');
    this.electricMeterRead = page.locator(':is([data-testid="electric-meter-read"], input[name="electricMeterRead"], input#electricMeterRead, input[aria-label="Electric Meter Read"], input[placeholder="Electric Meter Read"])');
    this.gasMeterRead = page.locator(':is([data-testid="gas-meter-read"], input[name="gasMeterRead"], input#gasMeterRead, input[aria-label="Gas Meter Read"], input[placeholder="Gas Meter Read"])');
    this.calculateButton = page.locator(':is([data-testid="calculate-btn"], button#calculate, button[name="calculate"], button:has-text("Calculate"))');
    this.totalPrice = page.locator(':is([data-testid="total-price"], #totalPrice, .total-price, [data-testid="result-total"], [role="status"].total, [aria-live="polite"].total)').first();
  }

  async goto(url = BASE_URL) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async selectServiceType(optionLabel) {
    await expect(this.serviceType).toBeVisible();

    // Try native <select> first
    try {
      await this.serviceType.selectOption({ label: optionLabel });
    } catch {
      // Fallback for custom dropdowns
      await this.serviceType.click();
      const option = this.page.locator(
        ':is([role="option"], option, li[role="option"], div[role="option"], li, div, span)',
        { hasText: optionLabel }
      ).first();
      await expect(option, `Option "${optionLabel}" should be present in the dropdown`).toBeVisible();
      await option.click();
    }

    // Verify selection reflected
    // For a select, check the value; for custom, check text content around control
    const selectedText = await this.serviceType.evaluate((el) => {
      if (el && el.tagName && el.tagName.toLowerCase() === 'select') {
        const idx = el.selectedIndex;
        const opt = el.options?.[idx];
        return opt ? opt.text : '';
      }
      return (el.getAttribute('aria-label') || el.textContent || '').trim();
    });
    expect(selectedText).toMatch(new RegExp(optionLabel, 'i'));
  }

  async expectBothMeterFieldsEnabled() {
    await expect(this.electricMeterRead, 'Electric meter read field should be visible').toBeVisible();
    await expect(this.gasMeterRead, 'Gas meter read field should be visible').toBeVisible();
    await expect(this.electricMeterRead, 'Electric meter read field should be enabled').toBeEnabled();
    await expect(this.gasMeterRead, 'Gas meter read field should be enabled').toBeEnabled();
  }

  async fillMeterReads({ electric, gas }) {
    await this.electricMeterRead.fill('');
    await this.electricMeterRead.fill(String(electric));
    await this.gasMeterRead.fill('');
    await this.gasMeterRead.fill(String(gas));
  }

  async expectMeterReads({ electric, gas }) {
    await expect(this.electricMeterRead).toHaveValue(String(electric));
    await expect(this.gasMeterRead).toHaveValue(String(gas));
  }

  async clickCalculate() {
    await expect(this.calculateButton, 'Calculate button should be visible').toBeVisible();
    await expect(this.calculateButton, 'Calculate button should be enabled').toBeEnabled();
    await this.calculateButton.click();
  }

  async expectTotalPriceDisplayed() {
    await expect(this.totalPrice, 'Total price result should be visible').toBeVisible();
    await expect(this.totalPrice, 'Total price should contain a numeric value').toHaveText(/[\d]+(?:[.,]\d+)?/);
  }
}

test.describe('MTX-4506 - Validate Electric and Gas Calculation', () => {
  test('Validate Electric and Gas Calculation', async ({ page }) => {
    const calculator = new CalculatorPage(page);

    // Navigate to application under test
    await calculator.goto();

    // Step 1: Select 'Electric and Gas' from Service type dropdown
    await calculator.selectServiceType('Electric and Gas');
    await calculator.expectBothMeterFieldsEnabled();

    // Step 2: Enter valid numeric values in both meter read fields
    await calculator.fillMeterReads({ electric: 450, gas: 150 });
    await calculator.expectMeterReads({ electric: 450, gas: 150 });

    // Step 3: Click the 'Calculate' button and validate the total is displayed
    await calculator.clickCalculate();
    await calculator.expectTotalPriceDisplayed();
  });
});