import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

class CalculatorPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Preferred test-id based locators
    this.form = page.getByTestId('calculator-form');
    this.electricByTestId = page.getByTestId('electric-input');
    this.gasByTestId = page.getByTestId('gas-input');
    this.calculateByTestId = page.getByTestId('calculate-btn');
    this.resetByTestId = page.getByTestId('reset-btn');
    this.resultsByTestId = page.getByTestId('results-panel');

    // Accessible fallbacks
    this.electricByLabel = page.getByLabel(/electric/i);
    this.gasByLabel = page.getByLabel(/gas/i);
    this.calculateByRole = page.getByRole('button', { name: /calculate/i });
    this.resetByRole = page.getByRole('button', { name: /reset/i });

    // Dynamic current results locator used for verification
    this._currentResultsLocator = null;
  }

  async goto() {
    await this.page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  }

  async waitForReady() {
    // Wait for the form or primary input to be ready
    if (await this.form.count()) {
      await expect(this.form).toBeVisible();
      return;
    }
    if (await this.electricByTestId.count()) {
      await expect(this.electricByTestId).toBeVisible();
      return;
    }
    await expect(this.electricByLabel).toBeVisible();
  }

  async resolveLocator(primary, fallback) {
    if (primary && (await primary.count())) return primary;
    return fallback;
  }

  async resolveElectricInput() {
    return this.resolveLocator(this.electricByTestId, this.electricByLabel);
  }

  async resolveGasInput() {
    return this.resolveLocator(this.gasByTestId, this.gasByLabel);
  }

  async resolveCalculateButton() {
    return this.resolveLocator(this.calculateByTestId, this.calculateByRole);
  }

  async resolveResetButton() {
    return this.resolveLocator(this.resetByTestId, this.resetByRole);
  }

  async fillMeterReads({ electric, gas }) {
    const electricInput = await this.resolveElectricInput();
    const gasInput = await this.resolveGasInput();

    await electricInput.fill('');
    await electricInput.fill(String(electric));
    await gasInput.fill('');
    await gasInput.fill(String(gas));
  }

  async calculate() {
    const calculateBtn = await this.resolveCalculateButton();
    await calculateBtn.click();
  }

  async reset() {
    const resetBtn = await this.resolveResetButton();
    await resetBtn.click();
  }

  async expectResultsDisplayed() {
    // Prefer results by test id
    if (await this.resultsByTestId.count()) {
      this._currentResultsLocator = this.resultsByTestId;
      await expect(this._currentResultsLocator).toBeVisible();
      return;
    }
    // Fallback: region labeled as results/summary/total
    const altRegion = this.page.getByRole('region', { name: /result|summary|total/i });
    this._currentResultsLocator = altRegion;
    await expect(this._currentResultsLocator).toBeVisible();
  }

  async expectNoResults() {
    const target = this._currentResultsLocator || this.resultsByTestId;
    const count = await target.count();
    if (count === 0) {
      // Removed from DOM: acceptable
      expect(count, 'Results panel should be removed after reset').toBe(0);
      return;
    }
    await expect(target, 'Results panel should not be visible after reset').not.toBeVisible();
  }

  async expectInputsCleared() {
    const electricInput = await this.resolveElectricInput();
    const gasInput = await this.resolveGasInput();
    await expect(electricInput, 'Electric input should be cleared after reset').toHaveValue('');
    await expect(gasInput, 'Gas input should be cleared after reset').toHaveValue('');
  }

  async _selectsLocator() {
    const scoped = this.form.locator('select');
    if (await this.form.count()) {
      return scoped;
    }
    return this.page.locator('select');
  }

  async captureDropdownDefaults() {
    const selects = await this._selectsLocator();
    const count = await selects.count();
    const defaults = [];
    for (let i = 0; i < count; i++) {
      const sel = selects.nth(i);
      const value = await sel.inputValue();
      const text = await sel.evaluate((el) => el.selectedOptions && el.selectedOptions[0] ? el.selectedOptions[0].textContent.trim() : '');
      defaults.push({ index: i, value, text });
    }
    return defaults;
  }

  async assertDropdownsResetToDefaults(defaults) {
    const selects = await this._selectsLocator();
    const count = await selects.count();

    // If there were no dropdowns initially, pass this assertion
    if (defaults.length === 0) {
      expect(defaults.length, 'No dropdowns were detected before interaction; skipping dropdown reset checks.').toBe(0);
      return;
    }

    // Ensure the same number of dropdowns remain
    expect(count, 'Number of dropdowns changed after reset').toBeGreaterThanOrEqual(defaults.length);

    for (let i = 0; i < defaults.length; i++) {
      const sel = selects.nth(i);
      const expected = defaults[i];

      // Prefer comparing value; if it differs, compare displayed text as a fallback
      const actualValue = await sel.inputValue();
      if (actualValue !== expected.value) {
        const actualText = await sel.evaluate((el) => el.selectedOptions && el.selectedOptions[0] ? el.selectedOptions[0].textContent.trim() : '');
        expect(actualText, `Dropdown at index ${i} should reset to its default option`).toBe(expected.text);
      } else {
        expect(actualValue, `Dropdown at index ${i} should reset to its default value`).toBe(expected.value);
      }
    }
  }
}

test.describe('MTX-4506 - Verify Reset Functionality', () => {
  test('Verify Reset Functionality', async ({ page }) => {
    const calculator = new CalculatorPage(page);

    // Navigate and wait for ready state
    await calculator.goto();
    await calculator.waitForReady();

    // Capture dropdown defaults to verify reset returns them to default state
    const dropdownDefaults = await calculator.captureDropdownDefaults();

    // Step 1: Enter values and perform calculation
    await calculator.fillMeterReads({ electric: 300, gas: 50 });
    await calculator.calculate();

    // Expected: Calculation results are displayed
    await calculator.expectResultsDisplayed();

    // Step 2: Click Reset
    await calculator.reset();

    // Expected: Inputs cleared, dropdowns reset to defaults, results removed
    await calculator.expectInputsCleared();
    await calculator.assertDropdownsResetToDefaults(dropdownDefaults);
    await calculator.expectNoResults();
  });
});