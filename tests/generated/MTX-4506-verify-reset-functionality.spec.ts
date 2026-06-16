const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

class MeterPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Inputs
    this.electricInput = page.locator('[data-testid="electric-input"], input[name="electric"], #electric');
    this.gasInput = page.locator('[data-testid="gas-input"], input[name="gas"], #gas');

    // Buttons
    this.calculateButton = page.locator('[data-testid="calculate-button"], button:has-text("Calculate"), [type="submit"]:has-text("Calculate")');
    this.resetButton = page.locator('[data-testid="reset-button"], button:has-text("Reset")');

    // Dropdown (tariff/meter type)
    this.dropdown = page.locator('[data-testid="tariff-select"], select[name="tariff"], select#tariff');

    // Results container
    this.resultContainer = page.locator('[data-testid="result"], [data-testid="result-container"], #result, .result');
  }

  async goto(url = BASE_URL) {
    await this.page.goto(url);
  }

  async fillMeters(electric, gas) {
    await this.electricInput.fill(String(electric));
    await this.gasInput.fill(String(gas));
  }

  async calculate() {
    if (await this.calculateButton.count()) {
      await this.calculateButton.click();
    } else {
      // If no explicit calculate button, blur inputs to trigger auto-calc
      await this.gasInput.blur();
    }
  }

  async reset() {
    await this.resetButton.click();
  }

  async getResultText() {
    if (!(await this.resultContainer.count())) return '';
    return (await this.resultContainer.innerText()).trim();
  }

  async getDropdownSelectedText() {
    if (!(await this.dropdown.count())) return '';
    const selectedOption = this.dropdown.locator('option:checked');
    if (await selectedOption.count()) {
      const txt = await selectedOption.first().textContent();
      return (txt || '').trim();
    }
    // Fallback for custom UI exposing current value
    const valueEl = this.page.locator('[data-testid="tariff-select-value"]');
    if (await valueEl.count()) {
      return (await valueEl.first().innerText()).trim();
    }
    // Last resort: inner text of the control
    return (await this.dropdown.innerText()).trim();
  }

  async selectNonDefaultOptionIfAvailable(defaultText) {
    if (!(await this.dropdown.count())) return;
    const options = this.dropdown.locator('option');
    const count = await options.count();
    for (let i = 0; i < count; i++) {
      const option = options.nth(i);
      const label = ((await option.textContent()) || '').trim();
      if (label && label !== defaultText) {
        const value = await option.getAttribute('value');
        if (value) {
          await this.dropdown.selectOption({ value });
        } else {
          await this.dropdown.selectOption({ label });
        }
        break;
      }
    }
  }
}

test.describe('MTX-4506 - Verify Reset Functionality', () => {
  test('Verify Reset Functionality', async ({ page }) => {
    const meterPage = new MeterPage(page);

    // Navigate to application
    await meterPage.goto(BASE_URL);

    // Capture default dropdown selection (if present) and change it to a non-default option (if available)
    const defaultDropdownText = await meterPage.getDropdownSelectedText();
    await meterPage.selectNonDefaultOptionIfAvailable(defaultDropdownText);

    // Step 1: Enter values and perform calculation
    await meterPage.fillMeters(300, 100);
    await meterPage.calculate();

    // Expected: Calculation result is displayed
    if (await meterPage.resultContainer.count()) {
      await expect(meterPage.resultContainer).toBeVisible();
      await expect(meterPage.resultContainer).not.toHaveText('');
    } else {
      // If the app renders results dynamically later, wait briefly and then assert existence/visibility
      await page.waitForTimeout(300);
      await expect(meterPage.resultContainer).toBeVisible();
      await expect(meterPage.resultContainer).not.toHaveText('');
    }

    // Step 2: Click Reset
    await meterPage.reset();

    // Expected: All inputs cleared
    await expect(meterPage.electricInput).toHaveValue('');
    await expect(meterPage.gasInput).toHaveValue('');

    // Expected: Dropdown returns to default (only if dropdown exists)
    if (await meterPage.dropdown.count()) {
      const afterResetDropdownText = await meterPage.getDropdownSelectedText();
      expect(afterResetDropdownText).toBe(defaultDropdownText);
    }

    // Expected: Results removed (hidden or not present)
    await expect(meterPage.resultContainer).toBeHidden();
  });
});