import { test, expect } from '@playwright/test';

class CalculatorPage {
  constructor(page) {
    this.page = page;
    this.serviceTypeSelect = page.getByTestId('service-type-select');
    this.electricMeterInput = page.getByTestId('input-electric-meter');
    this.gasMeterInput = page.getByTestId('input-gas-meter');
    this.calculateButton = page.getByTestId('btn-calculate');
    this.totalPrice = page.getByTestId('total-price');
  }

  async goto() {
    const defaultBase = process.env.BASE_URL || 'http://localhost:3000';
    const target =
      process.env.CALCULATOR_URL ||
      `${defaultBase.replace(/\/$/, '')}/calculator`;
    await this.page.goto(target);
  }

  async selectServiceType(serviceName) {
    // Prefer a test-id based select first
    if (await this.serviceTypeSelect.count()) {
      await this.serviceTypeSelect.selectOption({ label: serviceName });
      return;
    }
    // Try a labeled combobox/select
    const labeledCombobox = this.page.getByRole('combobox', { name: /service type/i });
    if (await labeledCombobox.count()) {
      await labeledCombobox.selectOption({ label: serviceName });
      return;
    }
    // Try a radio option by role/name
    const radioOption = this.page.getByRole('radio', { name: serviceName });
    if (await radioOption.count()) {
      await radioOption.check();
      return;
    }
    // Try direct label clicking
    const labelOption = this.page.getByLabel(serviceName, { exact: true });
    if (await labelOption.count()) {
      await labelOption.click();
      return;
    }
    throw new Error(`Unable to select service type: ${serviceName}`);
  }

  async enterMeterReads(electricValue, gasValue) {
    await this.electricMeterInput.fill(String(electricValue));
    await this.gasMeterInput.fill(String(gasValue));
  }

  async clickCalculate() {
    await this.calculateButton.click();
  }

  async getTotalPriceNumber() {
    await expect(this.totalPrice).toBeVisible();
    await expect(this.totalPrice).toHaveText(/\S+/);
    const text = (await this.totalPrice.textContent()) || '';
    const numeric = parseFloat(text.replace(/[^\d.-]/g, ''));
    if (Number.isNaN(numeric)) {
      throw new Error(`Total price is not a valid number: "${text}"`);
    }
    return numeric;
  }
}

test.describe('MTX-4506 - Validate Electric and Gas Calculation', () => {
  test('Validate Electric and Gas Calculation', async ({ page }) => {
    const calculator = new CalculatorPage(page);

    // Navigate to calculator
    await calculator.goto();

    // Step 1: Select 'Electric and Gas' from the Service Type options
    await calculator.selectServiceType('Electric and Gas');

    // Expected: Both Electric Meter Read and Gas Meter Read fields are enabled.
    await expect(calculator.electricMeterInput).toBeVisible();
    await expect(calculator.gasMeterInput).toBeVisible();
    await expect(calculator.electricMeterInput).toBeEnabled();
    await expect(calculator.gasMeterInput).toBeEnabled();

    // Step 2: Enter valid values in both meter read fields
    const electricRead = 450;
    const gasRead = 120;
    await calculator.enterMeterReads(electricRead, gasRead);

    // Expected: Values are accepted in both fields.
    await expect(calculator.electricMeterInput).toHaveValue(String(electricRead));
    await expect(calculator.gasMeterInput).toHaveValue(String(gasRead));

    // Step 3: Click on the Calculate button
    await calculator.clickCalculate();

    // Expected: The combined calculated price for both services is displayed.
    await expect(calculator.totalPrice).toBeVisible();
    await expect(calculator.totalPrice).toHaveText(/\S+/);

    // Basic sanity: result is a positive number
    const totalPrice = await calculator.getTotalPriceNumber();
    expect(totalPrice).toBeGreaterThan(0);

    // Optional strict validation if rates are provided via environment variables
    const er = process.env.ELECTRIC_RATE ? parseFloat(process.env.ELECTRIC_RATE) : undefined;
    const gr = process.env.GAS_RATE ? parseFloat(process.env.GAS_RATE) : undefined;
    if (typeof er === 'number' && !Number.isNaN(er) && typeof gr === 'number' && !Number.isNaN(gr)) {
      const expected = Math.round((electricRead * er + gasRead * gr) * 100) / 100;
      expect(totalPrice).toBeCloseTo(expected, 2);
    }
  });
});