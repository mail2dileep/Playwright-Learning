import { test, expect } from '@playwright/test';

const BASE_URL = process.env.APP_URL || process.env.BASE_URL || 'http://localhost:3000';

test.use({ baseURL: BASE_URL });

class CalculatorPage {
  /**
   * Page Object for Energy Calculator
   * Targets common and test-id based selectors for resilience
   */
  constructor(page) {
    this.page = page;

    // Inputs
    this.electricInput = page.locator(
      '[data-testid="input-electric"], input[name="electric"], #electric, input[aria-label="Electric"]'
    );
    this.gasInput = page.locator(
      '[data-testid="input-gas"], input[name="gas"], #gas, input[aria-label="Gas"]'
    );

    // Buttons
    this.calculateButton = page.locator(
      '[data-testid="btn-calculate"], button:has-text("Calculate"), [role="button"]:has-text("Calculate")'
    );
    this.resetButton = page.locator(
      '[data-testid="btn-reset"], button:has-text("Reset"), [role="button"]:has-text("Reset")'
    );

    // Result container
    this.result = page.locator(
      '[data-testid="calculation-result"], #result, .result, [role="status"], [aria-live="polite"]'
    );
  }

  async goto() {
    await this.page.goto('/');
    // Wait for primary controls to ensure page is ready
    await expect(this.calculateButton, 'Calculate button should be visible on load').toBeVisible();
    await expect(this.resetButton, 'Reset button should be visible on load').toBeVisible();
  }

  async enterInputs(electric, gas) {
    await this.electricInput.fill(String(electric));
    await this.gasInput.fill(String(gas));
  }

  async calculate() {
    await this.calculateButton.click();
  }

  async reset() {
    await this.resetButton.click();
  }

  async getResultText() {
    const text = await this.result.textContent().catch(() => '');
    return (text || '').trim();
  }
}

test.describe('MTX-4506 - Verify Reset Functionality', () => {
  test('Verify Reset Functionality', async ({ page }) => {
    const app = new CalculatorPage(page);

    // Navigate to app
    await app.goto();

    // Step 1: Enter values and perform a calculation
    await app.enterInputs(450, 80);
    await app.calculate();

    // Expected Result: Calculation result is displayed.
    await expect(app.result, 'Calculation result should be visible after calculation').toBeVisible();
    await expect(app.result, 'Calculation result should not be empty').toHaveText(/\S/);

    // Step 2: Click on the 'Reset' button
    await app.reset();

    // Expected Result: All input fields are cleared and the calculation result is removed.
    await expect(app.electricInput, 'Electric input should be cleared after reset').toHaveValue('');
    await expect(app.gasInput, 'Gas input should be cleared after reset').toHaveValue('');
    await expect(app.result, 'Calculation result should be removed/hidden after reset').not.toBeVisible();

    // Optional additional guard: ensure no residual text remains if container persists
    const textAfterReset = await app.getResultText();
    expect(textAfterReset === '' || !(await app.result.isVisible())).toBeTruthy();
  });
});