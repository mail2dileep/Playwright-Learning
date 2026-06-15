import { test, expect } from '@playwright/test';

class MeterPage {
  constructor(page, { baseUrl, path } = {}) {
    this.page = page;
    this.baseUrl = baseUrl || process.env.BASE_URL || 'http://localhost:3000';
    this.path = path || process.env.METER_PAGE_PATH || '/';
  }

  async goto() {
    const url = this.baseUrl ? new URL(this.path, this.baseUrl).toString() : this.path;
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  // Resolve Electric Meter Read input using accessible label first, then fallbacks
  async getElectricInput() {
    const byLabel = this.page.getByLabel(/electric meter read/i);
    if (await byLabel.count()) return byLabel.first();
    return this.page
      .locator(
        [
          'input[aria-label*="electric" i]',
          'input[name*="electric" i]',
          'input[id*="electric" i]',
          '[data-test="electric-input"]',
          '[data-testid="electric-input"]',
          'input[placeholder*="electric" i]',
        ].join(','),
      )
      .first();
  }

  // Resolve Gas Meter Read input using accessible label first, then fallbacks
  async getGasInput() {
    const byLabel = this.page.getByLabel(/gas meter read/i);
    if (await byLabel.count()) return byLabel.first();
    return this.page
      .locator(
        [
          'input[aria-label*="gas" i]',
          'input[name*="gas" i]',
          'input[id*="gas" i]',
          '[data-test="gas-input"]',
          '[data-testid="gas-input"]',
          'input[placeholder*="gas" i]',
        ].join(','),
      )
      .first();
  }

  async getCalculateButton() {
    const byRole = this.page.getByRole('button', { name: /calculate/i });
    if (await byRole.count()) return byRole.first();
    return this.page.locator('[data-test="calculate"], [data-testid="calculate"], button[id*="calc" i], button[name*="calc" i]').first();
  }

  async clearAndType(locator, value) {
    await locator.click({ force: true });
    // Some numeric inputs need to select and delete contents
    await locator.fill('');
    await locator.type(String(value), { delay: 20 });
    // Trigger validation by blurring
    await locator.blur();
  }

  async enterElectric(value) {
    const input = await this.getElectricInput();
    await this.clearAndType(input, value);
  }

  async enterGas(value) {
    const input = await this.getGasInput();
    await this.clearAndType(input, value);
  }

  async clickCalculate() {
    const btn = await this.getCalculateButton();
    await btn.click();
  }

  async getElectricValue() {
    const input = await this.getElectricInput();
    return input.inputValue();
  }

  async getGasValue() {
    const input = await this.getGasInput();
    return input.inputValue();
  }

  async hasAriaInvalid(input) {
    const ariaInvalid = (await input.getAttribute('aria-invalid')) || '';
    return ariaInvalid.toLowerCase() === 'true';
    }

  async getDescribedByElements(input) {
    const idsAttr = await input.getAttribute('aria-describedby');
    if (!idsAttr) return [];
    const ids = idsAttr.split(/\s+/).filter(Boolean);
    const locators = ids.map((id) => this.page.locator(`[id="${id}"]`));
    return locators;
  }

  async getAssociatedLabelText(input) {
    const labelText = await input.evaluate((el) => {
      const id = el.getAttribute('id');
      let text = '';
      if (id) {
        const l = document.querySelector(`label[for="${id}"]`);
        text = l?.textContent?.trim() || '';
      }
      if (!text) {
        // Try to find nearest label ancestor
        const nearest = el.closest('label');
        text = nearest?.textContent?.trim() || '';
      }
      if (!text) {
        text = el.getAttribute('aria-label') || '';
      }
      return text;
    });
    return (labelText || '').trim();
  }

  async findNearbyErrorElement(input) {
    // 1) aria-invalid or aria-describedby targets
    if (await this.hasAriaInvalid(input)) {
      const described = await this.getDescribedByElements(input);
      for (const d of described) {
        if ((await d.count()) > 0 && (await d.isVisible())) return d.first();
      }
    }

    // 2) Common sibling/nearby error containers
    const siblingError = input.locator('xpath=following-sibling::*[contains(@class,"error") or contains(@class,"invalid") or contains(@data-test,"error") or contains(@class,"helper")][1]');
    if ((await siblingError.count()) > 0 && (await siblingError.isVisible())) return siblingError.first();

    // 3) Parent-descendant error
    const parentError = input.locator('xpath=ancestor::*[self::div or self::section][1]//*[contains(@class,"error") or contains(@class,"invalid") or contains(@data-test,"error") or contains(@role,"alert")]').first();
    if ((await parentError.count()) > 0 && (await parentError.isVisible())) return parentError.first();

    // 4) Global alerts mentioning the field label
    const labelText = await this.getAssociatedLabelText(input);
    if (labelText) {
      const escaped = labelText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const globalAlert = this.page.getByRole('alert').filter({ hasText: new RegExp(escaped, 'i') }).first();
      if ((await globalAlert.count()) > 0 && (await globalAlert.isVisible())) return globalAlert;
      const textAlert = this.page.getByText(new RegExp(`${escaped}.*(invalid|error|number|numeric|positive|non[-\\s]?negative|greater than)`, 'i')).first();
      if ((await textAlert.count()) > 0 && (await textAlert.isVisible())) return textAlert;
    }

    // 5) Any visible alert related to numbers
    const genericAlert = this.page.locator('[role="alert"], .error, .error-message, [data-test*="error"]').filter({
      hasText: /(invalid|error|number|numeric|digits|positive|non[-\s]?negative|greater than)/i,
    }).first();
    if ((await genericAlert.count()) > 0 && (await genericAlert.isVisible())) return genericAlert;

    return null;
  }

  async hasElectricError() {
    const input = await this.getElectricInput();
    if (await this.hasAriaInvalid(input)) return true;
    const el = await this.findNearbyErrorElement(input);
    return !!el;
  }

  async hasGasError() {
    const input = await this.getGasInput();
    if (await this.hasAriaInvalid(input)) return true;
    const el = await this.findNearbyErrorElement(input);
    return !!el;
  }

  async getGasErrorText() {
    const input = await this.getGasInput();
    const el = await this.findNearbyErrorElement(input);
    if (el && (await el.count()) > 0) {
      return (await el.innerText()).trim();
    }
    return '';
  }

  async getResultText() {
    // Try common result containers
    const candidates = this.page.locator(
      [
        '[data-test="result"]',
        '[data-testid="result"]',
        '[data-test="total"]',
        '[data-testid="total"]',
        '#result',
        '#total',
        '.result',
        '.total',
        '[role="status"]',
        '[aria-live]',
      ].join(','),
    );

    const count = await candidates.count();
    for (let i = 0; i < count; i++) {
      const el = candidates.nth(i);
      if (await el.isVisible()) {
        const txt = ((await el.innerText()) || '').trim();
        if (txt) return txt;
      }
    }
    return '';
  }
}

test.describe('Requirement ID: MTX-4506', () => {
  test('TC_005 - Negative Test: Invalid Input in Meter Read Fields', async ({ page }) => {
    const app = new MeterPage(page, {
      baseUrl: process.env.BASE_URL,
      path: process.env.METER_PAGE_PATH || '/',
    });

    await app.goto();

    // Step 1: Enter alphabetic characters into the Electric Meter Read field.
    await test.step('Step 1: Enter invalid alphabetic input into Electric Meter Read', async () => {
      await app.enterElectric('ABC');

      const electricValue = await app.getElectricValue();
      const electricHasError = await app.hasElectricError();

      // Expect: System prevents entry (value remains empty or sanitized) OR shows a validation error
      expect(
        electricHasError || electricValue.trim() === '' || /^[^a-zA-Z]*$/.test(electricValue),
        'Electric field should prevent non-numeric entry or display a validation error',
      ).toBeTruthy();
    });

    // Step 2: Enter a negative value into the Gas Meter Read field.
    await test.step('Step 2: Enter negative value into Gas Meter Read', async () => {
      await app.enterGas('-50');

      const gasHasError = await app.hasGasError();
      expect(gasHasError, 'Gas field should display a validation error for negative values').toBeTruthy();

      const gasErrorText = await app.getGasErrorText();
      if (gasErrorText) {
        expect(
          /positive|greater than\s*0|>\s*0|non[-\s]?negative|must be (a )?positive|only positive/i.test(gasErrorText),
        ).toBeTruthy();
      }
    });

    // Step 3: Click 'Calculate' with invalid data.
    await test.step("Step 3: Click 'Calculate' with invalid data and verify no calculation occurs", async () => {
      await app.clickCalculate();

      // Errors should remain visible
      const electricStillInvalid = (await app.hasElectricError()) || (await app.getElectricValue()).trim() === '';
      const gasStillInvalid = await app.hasGasError();

      expect(electricStillInvalid, 'Electric field should remain invalid after Calculate').toBeTruthy();
      expect(gasStillInvalid, 'Gas field should remain invalid after Calculate').toBeTruthy();

      // Calculation should not be performed: result should be absent or non-numeric/empty
      const resultText = (await app.getResultText()) || '';
      expect(
        resultText.length === 0 || !/\d/.test(resultText),
        'Calculation result should not be produced with invalid inputs',
      ).toBeTruthy();
    });
  });
});