import { test, expect } from '@playwright/test';

class CalculatorPage {
  constructor(page) {
    this.page = page;
    this.serviceTypeCombobox = page.getByRole('combobox', { name: /service type/i });
    this.electricMeterInput = page.getByLabel(/electric meter read/i);
    this.gasMeterInput = page.getByLabel(/gas meter read/i);
    this.calculateButton = page.getByRole('button', { name: /calculate/i });
  }

  async goto() {
    const baseUrl = process.env.APP_BASE_URL || process.env.BASE_URL || 'http://localhost:3000';
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  }

  async selectServiceType(type) {
    const escaped = this._escapeRegExp(type);
    // Try native select first
    try {
      await this.serviceTypeCombobox.selectOption({ label: type });
    } catch {
      // Fallback to ARIA combobox/listbox pattern
      await this.serviceTypeCombobox.click();
      const option = this.page.getByRole('option', { name: new RegExp(`^${escaped}$`, 'i') });
      if (await option.count()) {
        await option.first().click();
      } else {
        // Fallback to selecting by text
        await this.page.getByText(new RegExp(`^${escaped}$`, 'i')).first().click();
      }
    }
  }

  async ensureFieldsReadyForInput() {
    await expect(this.electricMeterInput, 'Electric meter input should be visible').toBeVisible();
    await expect(this.electricMeterInput, 'Electric meter input should be editable').toBeEditable();
    await expect(this.gasMeterInput, 'Gas meter input should be visible').toBeVisible();
    await expect(this.gasMeterInput, 'Gas meter input should be editable').toBeEditable();
  }

  async enterMeterReads(electricValue, gasValue) {
    await this.electricMeterInput.fill(String(electricValue));
    await this.gasMeterInput.fill(String(gasValue));
    await expect(this.electricMeterInput).toHaveValue(String(electricValue));
    await expect(this.gasMeterInput).toHaveValue(String(gasValue));
  }

  async clickCalculate() {
    await expect(this.calculateButton).toBeEnabled();
    await this.calculateButton.click();
  }

  async waitForEstimateVisible() {
    const estimateCandidates = this.page.locator(
      [
        '[data-testid="estimate-result"]',
        '[data-testid="estimated-price"]',
        '[data-testid="bill-amount"]',
        '[id*="estimate"]',
        '[class*="estimate"]',
        '[aria-live]',
        'text=/estimated (price|bill|amount|total)/i'
      ].join(', ')
    ).filter({ hasText: /\d/ });

    await expect(estimateCandidates.first()).toBeVisible({ timeout: 10000 });
    return estimateCandidates.first();
  }

  async getEstimateNumericValue() {
    const estimateLocator = await this.waitForEstimateVisible();
    const text = (await estimateLocator.innerText()).trim();
    // Extract a numeric amount from the text (supports optional currency symbols and commas)
    const match = text.replace(/\s/g, '').match(/(?:[$£€])?(\d{1,3}(?:[,]\d{3})*(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)/);
    if (!match) return { rawText: text, amount: NaN };
    const normalized = match[1].replace(/,/g, '');
    const amount = parseFloat(normalized);
    return { rawText: text, amount };
  }

  _escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

test.describe('MTX-4506 - Verify Calculation Functionality', () => {
  test('Validate that the calculator provides a price estimate when valid data is entered', async ({ page }) => {
    const calculator = new CalculatorPage(page);

    // Step 1: Navigate and select "Electric and Gas" service type
    await calculator.goto();
    await calculator.selectServiceType('Electric and Gas');
    await calculator.ensureFieldsReadyForInput(); // Expected: Fields are ready for input

    // Step 2: Enter valid numeric values in meter read fields
    await calculator.enterMeterReads(500, 100); // Expected: Values are accepted in the fields

    // Step 3: Click "Calculate" and verify estimate is displayed
    await calculator.clickCalculate();

    const { rawText, amount } = await calculator.getEstimateNumericValue();

    // Assertions for estimate visibility and validity
    expect.soft(Number.isFinite(amount), `Expected a finite numeric estimate, got: "${rawText}"`).toBeTruthy();
    expect(amount).toBeGreaterThan(0);

    // Optional semantic assertion: ensure the displayed text implies an estimate/bill
    await expect(page.locator('body')).toContainText(/estimate|estimated|bill|amount|total/i, { timeout: 5000 });
  });
});