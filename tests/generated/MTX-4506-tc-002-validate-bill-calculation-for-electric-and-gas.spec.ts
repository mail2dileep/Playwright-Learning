import { test, expect } from '@playwright/test';

class BillCalculatorPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async goto() {
    const base =
      process.env.APP_BASE_URL ||
      process.env.BASE_URL ||
      'http://localhost:3000';
    await this.page.goto(base, { waitUntil: 'domcontentloaded' });
  }

  async selectServiceTypeElectricAndGas() {
    // Try radio first
    const radio = this.page.getByRole('radio', { name: /electric\s*and\s*gas/i });
    if (await radio.count()) {
      await expect(radio).toBeVisible();
      await radio.check();
      return;
    }

    // Try buttons or toggles
    const toggleButton = this.page.getByRole('button', { name: /electric\s*and\s*gas/i });
    if (await toggleButton.count()) {
      await expect(toggleButton).toBeEnabled();
      await toggleButton.click();
      return;
    }

    // Try segmented control or tab
    const tab = this.page.getByRole('tab', { name: /electric\s*and\s*gas/i });
    if (await tab.count()) {
      await expect(tab).toBeVisible();
      await tab.click();
      return;
    }

    // Try select/combobox
    const serviceTypeCombo = this.page.getByRole('combobox', { name: /service\s*type/i }).first();
    if (await serviceTypeCombo.count()) {
      await expect(serviceTypeCombo).toBeVisible();
      // Try selecting by option label
      const optionByLabel = serviceTypeCombo.locator('option', { hasText: /electric\s*and\s*gas/i }).first();
      if (await optionByLabel.count()) {
        const value = await optionByLabel.getAttribute('value');
        if (value) {
          await serviceTypeCombo.selectOption(value);
          return;
        }
      }
      // Fallback: attempt known values
      for (const candidate of ['electric-gas', 'dual', 'both', 'electric_and_gas', 'dual-fuel']) {
        try {
          await serviceTypeCombo.selectOption(candidate);
          return;
        } catch {
          // continue
        }
      }
    }

    // Try any control with accessible name "Service Type" using generic locators
    const genericServiceSelector = this.page.locator(
      'select[name*="service" i], select[id*="service" i], [role="combobox"][name*="service" i]'
    ).first();
    if (await genericServiceSelector.count()) {
      await expect(genericServiceSelector).toBeVisible();
      const optionByLabel = genericServiceSelector.locator('option', { hasText: /electric\s*and\s*gas/i }).first();
      if (await optionByLabel.count()) {
        const value = await optionByLabel.getAttribute('value');
        if (value) {
          await genericServiceSelector.selectOption(value);
          return;
        }
      }
    }

    // Last resort: Click text if it's a toggle link or label
    const labelText = this.page.getByText(/electric\s*and\s*gas/i, { exact: false }).first();
    if (await labelText.count()) {
      await labelText.click();
      return;
    }

    throw new Error("Unable to select 'Electric and Gas' service type - appropriate control not found.");
  }

  async electricInput() {
    // Prioritize label association
    const candidates = [
      this.page.getByLabel(/^electric(\s*(meter)?\s*(read(ing)?|value))?$/i),
      this.page.getByPlaceholder(/electric/i),
      this.page.locator('input[name*="electric" i]'),
      this.page.locator('input[id*="electric" i]'),
      this.page.locator('[data-testid*="electric" i]'),
      this.page.locator('[data-test*="electric" i]'),
    ];
    for (const loc of candidates) {
      if (await loc.count()) return loc.first();
    }
    throw new Error('Electric meter input field not found.');
  }

  async gasInput() {
    const candidates = [
      this.page.getByLabel(/^gas(\s*(meter)?\s*(read(ing)?|value))?$/i),
      this.page.getByPlaceholder(/gas/i),
      this.page.locator('input[name*="gas" i]'),
      this.page.locator('input[id*="gas" i]'),
      this.page.locator('[data-testid*="gas" i]'),
      this.page.locator('[data-test*="gas" i]'),
    ];
    for (const loc of candidates) {
      if (await loc.count()) return loc.first();
    }
    throw new Error('Gas meter input field not found.');
  }

  async assertServiceInputsVisible() {
    const electric = await this.electricInput();
    const gas = await this.gasInput();
    await expect(electric, 'Electric input should be visible').toBeVisible();
    await expect(gas, 'Gas input should be visible').toBeVisible();
  }

  async enterElectricReading(value) {
    const input = await this.electricInput();
    await expect(input).toBeEditable();
    await input.fill(''); // clear
    await input.fill(String(value));
  }

  async enterGasReading(value) {
    const input = await this.gasInput();
    await expect(input).toBeEditable();
    await input.fill(''); // clear
    await input.fill(String(value));
  }

  async assertInputValues(electricValue, gasValue) {
    const e = await this.electricInput();
    const g = await this.gasInput();
    await expect(e).toHaveValue(String(electricValue));
    await expect(g).toHaveValue(String(gasValue));
  }

  async clickCalculate() {
    // Try button by role/name
    let button = this.page.getByRole('button', { name: /^calculate$/i }).first();
    if (await button.count()) {
      await expect(button).toBeEnabled();
      await button.click();
      return;
    }
    // Try variants
    button = this.page.getByRole('button', { name: /calculate|compute|estimate|get\s*quote/i }).first();
    if (await button.count()) {
      await expect(button).toBeEnabled();
      await button.click();
      return;
    }
    // Fallback by data attribute or id/class
    const fallback = this.page.locator(
      '[data-testid*="calculate" i], [data-test*="calculate" i], #calculate, .calculate'
    ).first();
    if (await fallback.count()) {
      await fallback.click();
      return;
    }
    throw new Error("Calculate button not found.");
  }

  async waitForAndGetResultText(timeoutMs = 8000) {
    const deadline = Date.now() + timeoutMs;
    const candidates = [
      this.page.getByTestId(/(result|total|bill|estimate|amount)/i),
      this.page.getByRole('status'),
      this.page.getByRole('alert'),
      this.page.locator('[aria-live]:not([aria-live="off"])'),
      this.page.locator('#result, .result, #total, .total, [data-result], [data-total], [data-testid="result"]'),
      this.page.getByText(/(estimated bill|bill estimate|total|price|amount|calculated)/i).locator('..'),
    ];

    while (Date.now() < deadline) {
      for (const loc of candidates) {
        if (!(await loc.count())) continue;
        const el = loc.first();
        try {
          await expect(el).toBeVisible({ timeout: 300 });
          const txt = (await el.textContent())?.trim() || '';
          // Ensure text has at least a number (optionally with currency)
          if (/\d/.test(txt)) {
            return txt;
          }
        } catch {
          // ignore and continue scanning
        }
      }
      await this.page.waitForTimeout(200);
    }
    throw new Error('Calculated price/bill estimate was not displayed within the expected time.');
  }
}

test.describe('MTX-4506 - TC_002 - Validate Bill Calculation for Electric and Gas', () => {
  test('TC_002 - Validate Bill Calculation for Electric and Gas', async ({ page }) => {
    test.info().annotations.push(
      { type: 'Requirement ID', description: 'MTX-4506' },
      { type: 'Priority', description: 'High' },
      { type: 'Test Name', description: 'TC_002 - Validate Bill Calculation for Electric and Gas' }
    );

    const calculator = new BillCalculatorPage(page);

    await test.step('Navigate to the Bill Calculator', async () => {
      await calculator.goto();
    });

    await test.step("Step 1: Select 'Electric and Gas' service type and verify inputs appear", async () => {
      await calculator.selectServiceTypeElectricAndGas();
      await calculator.assertServiceInputsVisible();
    });

    await test.step('Step 2: Enter valid numeric values for Electric and Gas and verify they are accepted', async () => {
      await calculator.enterElectricReading(500);
      await calculator.enterGasReading(100);
      await calculator.assertInputValues(500, 100);
    });

    await test.step("Step 3: Click 'Calculate' and verify the bill estimate is displayed", async () => {
      await calculator.clickCalculate();
      const resultText = await calculator.waitForAndGetResultText();

      // Assert the result contains a numeric value (and optionally a currency symbol)
      expect(resultText, 'Result should contain a numeric amount').toMatch(/(?:\$|£|€)?\s*\d[\d,]*(?:\.\d{1,2})?/);

      // Additional sanity: parsed numeric value should be > 0
      const numeric = parseFloat(resultText.replace(/[^0-9.]/g, ''));
      expect(numeric, 'Calculated amount should be greater than 0').toBeGreaterThan(0);
    });
  });
});