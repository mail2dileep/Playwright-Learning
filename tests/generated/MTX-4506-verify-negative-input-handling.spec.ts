import { test, expect } from '@playwright/test';

class CalculatorPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.electricInput = page.getByLabel(/electric meter read/i);
    this.gasInput = page.getByLabel(/gas meter read/i);
  }

  async goto() {
    const base = process.env.APP_URL || process.env.BASE_URL || 'http://localhost:3000';
    const path = process.env.CALCULATOR_PATH || '/calculator';
    const target = path.startsWith('http') ? path : new URL(path, base).toString();
    await this.page.goto(target);
  }

  async blurActiveElement() {
    await this.page.keyboard.press('Tab').catch(() => {});
  }

  async setElectric(value) {
    await this.electricInput.fill('');
    await this.electricInput.type(String(value), { delay: 10 }).catch(async () => {
      // Fallback if type fails (e.g., non-typable), use fill
      await this.electricInput.fill(String(value));
    });
    await this.blurActiveElement();
  }

  async setGas(value) {
    await this.gasInput.fill('');
    await this.gasInput.type(String(value), { delay: 10 }).catch(async () => {
      await this.gasInput.fill(String(value));
    });
    await this.blurActiveElement();
  }

  async getValueOf(input) {
    return (await input.inputValue().catch(() => '')) ?? '';
  }

  async isAriaInvalid(input) {
    return await input.evaluate((el) => el.getAttribute('aria-invalid') === 'true').catch(() => false);
  }

  async isHTML5Invalid(input) {
    return await input.evaluate((el) => {
      if (el && typeof el.checkValidity === 'function') {
        return !el.checkValidity();
      }
      return false;
    }).catch(() => false);
  }

  async findErrorNearInput(input) {
    const container = input.locator('xpath=ancestor::*[self::div or self::fieldset or self::label or self::form][1]');
    const candidates = [
      container.getByRole('alert'),
      container.locator('[aria-live="assertive"], [aria-live="polite"]'),
      container.locator('.error, .error-message, .validation-error, .help.is-danger, [data-test*="error"], [id*="error"], [class*="error"]'),
      // Fallback: any small/help text in container
      container.locator('small, .help, .hint')
    ];

    for (const loc of candidates) {
      const first = loc.first();
      if (await first.isVisible().catch(() => false)) {
        const text = (await first.innerText().catch(() => '')).trim();
        if (text) {
          return { visible: true, text, locator: first };
        }
      }
    }

    // Global alert as last resort
    const globalAlert = this.page.getByRole('alert').first();
    if (await globalAlert.isVisible().catch(() => false)) {
      const text = (await globalAlert.innerText().catch(() => '')).trim();
      if (text) {
        return { visible: true, text, locator: globalAlert };
      }
    }

    return { visible: false, text: '', locator: null };
  }
}

test.describe('MTX-4506 - Verify Negative Input Handling', () => {
  test('Validate that the calculator handles non-numeric or negative inputs gracefully', async ({ page }) => {
    const calculator = new CalculatorPage(page);
    await calculator.goto();

    // Ensure fields are present
    await expect(calculator.electricInput).toBeVisible();
    await expect(calculator.gasInput).toBeVisible();

    // Step 1: Enter non-numeric characters in the electric meter read field
    await calculator.setElectric('ABC');

    // Allow potential validation UI to render
    await page.waitForTimeout(150);

    const electricValue = await calculator.getValueOf(calculator.electricInput);
    const electricError = await calculator.findErrorNearInput(calculator.electricInput);
    const electricAriaInvalid = await calculator.isAriaInvalid(calculator.electricInput);
    const electricHTML5Invalid = await calculator.isHTML5Invalid(calculator.electricInput);

    // Expected: validation error is shown OR non-numeric entry is prevented
    if (electricValue === '') {
      // Non-numeric prevented (commonly for number inputs)
      expect(electricValue).toBe('');
    } else {
      // If value persisted, there must be validation error/invalid state
      expect(electricError.visible || electricAriaInvalid || electricHTML5Invalid).toBeTruthy();
    }

    // Step 2: Enter negative values in the gas meter read field
    await calculator.setGas(-10);

    // Allow potential validation UI to render
    await page.waitForTimeout(150);

    const gasError = await calculator.findErrorNearInput(calculator.gasInput);
    const gasAriaInvalid = await calculator.isAriaInvalid(calculator.gasInput);
    const gasHTML5Invalid = await calculator.isHTML5Invalid(calculator.gasInput);

    // Expected: An error indicating only positive values are allowed
    if (gasError.visible && gasError.text) {
      expect(gasError.text).toMatch(/positive|greater\s*than\s*0|zero|>=\s*0|no negative/i);
    } else {
      // If no textual error is visible, the field must still be in an invalid state
      expect(gasAriaInvalid || gasHTML5Invalid).toBeTruthy();
    }
  });
});