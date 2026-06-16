import { test, expect } from '@playwright/test';

class MeterReadPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Inputs (prefer accessible names; fallback CSS if app uses data-test attributes)
    this.electricInput = page.getByRole('textbox', { name: /electric/i }).or(
      page.locator('[data-test="electric-input"], #electric, input[name*="electric" i]')
    );
    this.gasInput = page.getByRole('textbox', { name: /gas/i }).or(
      page.locator('[data-test="gas-input"], #gas, input[name*="gas" i]')
    );

    // Calculate button
    this.calculateButton = page.getByRole('button', { name: /calculate/i }).or(
      page.locator('[data-test="calculate-button"], button#calculate, button[name*="calculate" i]')
    );

    // Validation messages (broad coverage for common patterns)
    this.validationMessages = page.locator(
      [
        '[role="alert"]',
        '[aria-live="assertive"]',
        '[aria-live="polite"].error, [aria-live="polite"].validation-message',
        '.error',
        '.error-message',
        '.validation-error',
        '.validation-message',
        '[data-test*="error"]',
        '[data-test*="validation"]',
        '.field-error',
        '.form-error',
      ].join(', ')
    );
  }

  async goto() {
    const base = process.env.APP_BASE_URL || 'http://localhost:3000';
    const path = process.env.METER_PAGE_PATH || '/meter-read';
    await this.page.goto(`${base}${path}`);
    // Wait for page to be ready (either of the inputs should be visible)
    await Promise.race([
      this.electricInput.first().waitFor({ state: 'visible' }),
      this.gasInput.first().waitFor({ state: 'visible' }),
    ]);
  }

  async enterElectric(value) {
    await this.electricInput.first().fill('');
    await this.electricInput.first().type(String(value), { delay: 10 });
    await this.electricInput.first().blur();
  }

  async enterGas(value) {
    await this.gasInput.first().fill('');
    await this.gasInput.first().type(String(value), { delay: 10 });
    await this.gasInput.first().blur();
  }

  async clearFields() {
    await this.electricInput.first().fill('');
    await this.gasInput.first().fill('');
    await this.electricInput.first().blur();
    await this.gasInput.first().blur();
  }

  async clickCalculate() {
    await this.calculateButton.first().click({ trial: false });
  }

  async getElectricValue() {
    return await this.electricInput.first().inputValue();
  }

  async getGasValue() {
    return await this.gasInput.first().inputValue();
  }

  async getFieldValues() {
    const [e, g] = await Promise.all([this.getElectricValue(), this.getGasValue()]);
    return { electric: e, gas: g };
  }

  async hasAnyValidationErrorVisible() {
    const messages = this.validationMessages;
    const count = await messages.count();
    for (let i = 0; i < count; i++) {
      if (await messages.nth(i).isVisible()) return true;
    }
    return false;
  }

  async getCombinedValidationText() {
    const messages = this.validationMessages;
    const count = await messages.count();
    const parts = [];
    for (let i = 0; i < count; i++) {
      if (await messages.nth(i).isVisible()) {
        const txt = await messages.nth(i).innerText().catch(() => '');
        if (txt) parts.push(txt.trim());
      }
    }
    return parts.join(' | ');
  }

  async areInputsMarkedInvalid() {
    const [eAria, gAria] = await Promise.all([
      this.electricInput.first().getAttribute('aria-invalid'),
      this.gasInput.first().getAttribute('aria-invalid'),
    ]);

    const [eClass, gClass] = await Promise.all([
      this.electricInput.first().getAttribute('class'),
      this.gasInput.first().getAttribute('class'),
    ]);

    const hasInvalidClass = (cls) =>
      typeof cls === 'string' &&
      /\b(invalid|is-invalid|error|has-error)\b/i.test(cls);

    return (
      (eAria === 'true' || hasInvalidClass(eClass)) ||
      (gAria === 'true' || hasInvalidClass(gClass))
    );
  }

  async waitForValidationPrompt(options = { timeout: 2000 }) {
    const end = Date.now() + (options.timeout ?? 2000);
    // Poll for either a visible error message or invalid-marked fields
    while (Date.now() < end) {
      if (await this.hasAnyValidationErrorVisible()) return true;
      if (await this.areInputsMarkedInvalid()) return true;
      await this.page.waitForTimeout(100);
    }
    return false;
  }
}

test.describe('MTX-4506 Validate Negative Input Handling', () => {
  test('Validate Negative Input Handling', async ({ page }) => {
    const meterPage = new MeterReadPage(page);
    await meterPage.goto();

    // Step 1: Enter non-numeric characters into the meter read fields.
    await meterPage.enterElectric('abc');
    await meterPage.enterGas('@#$');

    const valuesAfterInvalidInput = await meterPage.getFieldValues();
    const invalidBlocked =
      valuesAfterInvalidInput.electric.trim() === '' &&
      valuesAfterInvalidInput.gas.trim() === '';

    const errorVisibleAfterType = await meterPage.hasAnyValidationErrorVisible();

    // Expected: System prevents entry OR displays a validation error message.
    expect(
      invalidBlocked || errorVisibleAfterType,
      'System should prevent non-numeric entry or show a validation error message after invalid input.'
    ).toBeTruthy();

    // Step 2: Click 'Calculate' with empty fields.
    await meterPage.clearFields();
    await meterPage.clickCalculate();

    // Expected: System prompts the user to enter valid values.
    const gotPrompt = await meterPage.waitForValidationPrompt({ timeout: 3000 });
    expect(gotPrompt, 'System should prompt the user to enter valid values when fields are empty.').toBeTruthy();

    // If a visible validation message exists, assert it conveys the need for valid values.
    if (await meterPage.hasAnyValidationErrorVisible()) {
      const promptText = (await meterPage.getCombinedValidationText()) || '';
      expect(promptText.length, 'Validation message should not be empty when visible.').toBeGreaterThan(0);
      // Check for common prompt language
      expect(
        /(enter|provide|input|supply).*(valid|value|reading|number)|required|invalid/i.test(promptText),
        `Validation message should prompt for valid values. Actual: "${promptText}"`
      ).toBeTruthy();
    } else {
      // Otherwise ensure inputs are marked invalid (e.g., aria-invalid)
      expect(
        await meterPage.areInputsMarkedInvalid(),
        'Inputs should be marked invalid when Calculate is clicked with empty fields.'
      ).toBeTruthy();
    }
  });
});