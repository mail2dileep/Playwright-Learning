import { test, expect } from '@playwright/test';

class MeterPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.electricInput = page.getByLabel(/electric meter read/i);
    this.gasInput = page.getByLabel(/gas meter read/i);
    this.calculateButton = page.getByRole('button', { name: /calculate/i });
    this.resultContainer = page.getByTestId('calculation-result');
  }

  async goto() {
    const target = process.env.METER_URL || '/';
    await this.page.goto(target);
  }

  async setElectric(value) {
    await this.electricInput.fill('');
    await this.electricInput.fill(String(value));
  }

  async setGas(value) {
    await this.gasInput.fill('');
    await this.gasInput.fill(String(value));
  }

  async clickCalculateIfEnabled() {
    if (!(await this.calculateButton.isDisabled())) {
      await this.calculateButton.click();
    }
  }

  async isInputInvalid(inputLocator) {
    const ariaInvalid = await inputLocator.getAttribute('aria-invalid');
    return ariaInvalid === 'true' || ariaInvalid === 'false' ? ariaInvalid === 'true' : false;
  }

  async getDescribedByLocatorFor(inputLocator) {
    const describedBy = await inputLocator.getAttribute('aria-describedby');
    if (describedBy) {
      const ids = describedBy.split(/\s+/).filter(Boolean);
      if (ids.length) {
        const selector = ids.map(id => `#${id}`).join(', ');
        return this.page.locator(selector);
      }
    }
    // Fallback: search within nearest field/container for an element that looks like an error
    const container = inputLocator.locator('xpath=ancestor-or-self::*[self::div or self::fieldset or self::label][1]');
    const commonError = container.locator([
      '[role="alert"]',
      '.error, .error-message, .invalid-feedback, .helper-text--error, .field-error',
      'small:has-text("invalid"), small:has-text("positive"), small:has-text("number")',
      'span:has-text("invalid"), span:has-text("positive"), span:has-text("number")',
      'div:has-text("invalid"), div:has-text("positive"), div:has-text("number")'
    ].join(', '));
    return commonError;
  }

  async isErrorVisibleForInput(inputLocator) {
    const errorLocator = await this.getDescribedByLocatorFor(inputLocator);
    try {
      return await errorLocator.isVisible({ timeout: 200 });
    } catch {
      return false;
    }
  }

  async errorTextForInput(inputLocator) {
    const errorLocator = await this.getDescribedByLocatorFor(inputLocator);
    if (await errorLocator.count()) {
      const first = errorLocator.first();
      if (await first.isVisible()) {
        return (await first.innerText()).trim();
      }
    }
    return '';
  }

  async hasAnyValidationErrors() {
    const electricInvalid = await this.isInputInvalid(this.electricInput);
    const gasInvalid = await this.isInputInvalid(this.gasInput);
    const electricErrorVisible = await this.isErrorVisibleForInput(this.electricInput);
    const gasErrorVisible = await this.isErrorVisibleForInput(this.gasInput);
    return electricInvalid || gasInvalid || electricErrorVisible || gasErrorVisible;
  }
}

test.describe('MTX-4506 - Negative Test - Invalid Meter Read Inputs', () => {
  test('Verify the system handles non-numeric or negative inputs gracefully', async ({ page }) => {
    const meterPage = new MeterPage(page);
    await meterPage.goto();

    // Step 1: Enter non-numeric characters into the Electric Meter Read field
    await meterPage.setElectric('abc');
    const electricValue = await meterPage.electricInput.inputValue();

    // Assert: System prevents non-numeric entry OR shows a validation error
    const nonAlphaPrevented = /^[0-9]*$/.test(electricValue); // only digits allowed => non-numeric prevented
    const electricErrorVisible = await meterPage.isErrorVisibleForInput(meterPage.electricInput);
    const electricAriaInvalid = await meterPage.isInputInvalid(meterPage.electricInput);

    expect(
      nonAlphaPrevented || electricErrorVisible || electricAriaInvalid,
      'Electric input should prevent non-numeric entry or show a validation error'
    ).toBeTruthy();

    // If error message exists, optionally assert its content mentions invalid/non-numeric
    const electricErrorText = (await meterPage.errorTextForInput(meterPage.electricInput)).toLowerCase();
    if (electricErrorText) {
      expect(
        /number|numeric|digits?|invalid|not allowed/.test(electricErrorText),
        `Electric error message should indicate non-numeric is invalid. Actual: "${electricErrorText}"`
      ).toBeTruthy();
    }

    // Step 2: Enter a negative value into the Gas Meter Read field
    await meterPage.setGas(-10);

    // Assert: System displays a validation error indicating only positive values are allowed
    const gasAriaInvalid = await meterPage.isInputInvalid(meterPage.gasInput);
    const gasErrorVisible = await meterPage.isErrorVisibleForInput(meterPage.gasInput);
    expect(
      gasAriaInvalid || gasErrorVisible,
      'Gas input should indicate validation error for negative values'
    ).toBeTruthy();

    const gasErrorText = (await meterPage.errorTextForInput(meterPage.gasInput)).toLowerCase();
    if (gasErrorText) {
      expect(
        /positive|greater than ?0|> ?0|non[- ]?negative|must be a positive|zero or greater|>= ?0/.test(gasErrorText),
        `Gas error message should indicate positive-only values. Actual: "${gasErrorText}"`
      ).toBeTruthy();
    }

    // Step 3: Click Calculate with invalid data
    const isCalculateDisabled = await meterPage.calculateButton.isDisabled();
    if (!isCalculateDisabled) {
      await meterPage.clickCalculateIfEnabled();
    }

    // Expected: Calculation is not performed, and error messages are highlighted.
    // Assert result container is not visible (or absent)
    await expect(meterPage.resultContainer, 'Result should not be visible when inputs are invalid').not.toBeVisible();

    // Assert that there is at least one visible validation cue
    expect(
      await meterPage.hasAnyValidationErrors(),
      'There should be visible validation errors highlighted on the form'
    ).toBeTruthy();
  });
});