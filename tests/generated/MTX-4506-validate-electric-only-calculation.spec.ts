import { test, expect } from '@playwright/test';

class CalculatorPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    // Determine target URL
    const directUrl = process.env.CALCULATOR_URL;
    const base = process.env.BASE_URL;
    const url = directUrl || (base ? `${base.replace(/\/$/, '')}/calculator` : 'http://localhost:3000/calculator');
    await this.page.goto(url);
  }

  // Locators
  serviceType() {
    return this.page.getByRole('combobox', { name: /service\s*type/i });
  }

  electricMeterRead() {
    return this.page.getByLabel(/electric\s*meter\s*read/i);
  }

  gasMeterRead() {
    return this.page.getByLabel(/gas\s*meter\s*read/i);
  }

  calculateButton() {
    return this.page.getByRole('button', { name: /calculate/i });
  }

  // Try to discover a visible price/result element
  async priceLocator() {
    const candidates = [
      this.page.getByTestId('calculated-price'),
      this.page.getByTestId('price'),
      this.page.locator('[data-testid*="price"]'),
      this.page.getByRole('status'),
      this.page.locator('.result, #result, .price, #price'),
      this.page.getByText(/\b(total\s*)?price\b|\bamount\b|\btotal\b/i).first(),
    ];

    for (const loc of candidates) {
      try {
        if ((await loc.count()) > 0) {
          const first = loc.first();
          if (await first.isVisible()) {
            return first;
          }
        }
      } catch {
        // continue to next candidate
      }
    }
    // Fallback to any visible paragraph/div with currency
    const fallback = this.page.locator('text=/[£$€]\s*\\d/');
    if (await fallback.first().isVisible().catch(() => false)) {
      return fallback.first();
    }
    throw new Error('Calculated price element not found on the page.');
  }

  // Attempt to extract electric rate and any fixed fee from the UI (best-effort)
  async getElectricRatePerUnit() {
    const rateCandidates = [
      this.page.getByTestId('electric-rate'),
      this.page.getByText(/electric\s*(rate|unit\s*rate|price\s*per\s*kwh)/i),
    ];
    for (const loc of rateCandidates) {
      try {
        if ((await loc.count()) > 0) {
          const text = ((await loc.first().textContent()) || '').trim();
          const rate = this._extractNumber(text);
          if (!Number.isNaN(rate) && rate > 0) return rate;
        }
      } catch {
        // continue
      }
    }
    return null;
  }

  async getFixedFee() {
    const feeCandidates = [
      this.page.getByTestId('fixed-fee'),
      this.page.getByTestId('standing-charge'),
      this.page.getByText(/(fixed\s*fee|standing\s*charge|basic\s*charge)/i),
    ];
    for (const loc of feeCandidates) {
      try {
        if ((await loc.count()) > 0) {
          const text = ((await loc.first().textContent()) || '').trim();
          const fee = this._extractNumber(text);
          if (!Number.isNaN(fee) && fee >= 0) return fee;
        }
      } catch {
        // continue
      }
    }
    return 0;
  }

  _extractNumber(text) {
    // Parses numbers with optional currency symbols and thousands separators
    const match = (text || '').replace(/[, ]+/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  }

  async selectServiceType(optionLabel) {
    const dropdown = this.serviceType();
    try {
      await dropdown.selectOption({ label: optionLabel });
    } catch {
      // Fallback to clicking and choosing the option by role
      await dropdown.click();
      await this.page.getByRole('option', { name: new RegExp(optionLabel, 'i') }).click();
    }
  }

  async calculate() {
    const btn = this.calculateButton();
    await btn.click();
  }

  async getDisplayedPriceNumber() {
    const priceLoc = await this.priceLocator();
    await expect(priceLoc).toBeVisible();
    const text = (await priceLoc.textContent()) || '';
    const num = this._extractNumber(text);
    return { text: text.trim(), value: num };
  }
}

test.describe('MTX-4506 - Validate Electric Only Calculation', () => {
  test('Validate Electric Only Calculation', async ({ page }) => {
    const calculator = new CalculatorPage(page);
    await calculator.goto();

    await test.step("Step 1: Select 'Electric only' from the Service type dropdown and verify fields state", async () => {
      await calculator.selectServiceType('Electric only');

      const electricField = calculator.electricMeterRead();
      const gasField = calculator.gasMeterRead();

      await expect(electricField, 'Electric Meter Read field should be enabled').toBeEnabled();

      // Gas field should be disabled or hidden. If visible, it must be disabled.
      const gasVisible = await gasField.isVisible().catch(() => false);
      if (gasVisible) {
        await expect(gasField, 'Gas Meter Read field should be disabled when Electric only is selected').toBeDisabled();
      }
    });

    await test.step('Step 2: Enter Electric Meter Read value and ensure it is accepted', async () => {
      const electricField = calculator.electricMeterRead();
      await electricField.fill(''); // clear any existing value
      await electricField.type('500');
      await expect(electricField).toHaveValue(/^\s*500\s*$/);
    });

    await test.step("Step 3: Click 'Calculate' and validate the calculated price", async () => {
      // Best-effort compute expected price using rates visible on the page, if available.
      const rate = await calculator.getElectricRatePerUnit();
      const fixedFee = await calculator.getFixedFee();
      const meterRead = 500;

      await calculator.calculate();

      // Wait for price to appear/update
      const { value: displayedPrice, text: displayedText } = await calculator.getDisplayedPriceNumber();
      expect(displayedText.length).toBeGreaterThan(0);

      // If we could discover a rate, assert numeric correctness; else assert presence and numeric format.
      if (rate !== null && !Number.isNaN(rate)) {
        const expectedPrice = rate * meterRead + (fixedFee || 0);
        // toBeCloseTo with 2 decimals tolerance
        expect(displayedPrice, `Displayed price "${displayedText}" should equal computed price for Electric only`).toBeCloseTo(expectedPrice, 2);
      } else {
        // Fallback: ensure the displayed price is a valid positive number
        expect(Number.isFinite(displayedPrice)).toBeTruthy();
        expect(displayedPrice).toBeGreaterThanOrEqual(0);
      }
    });
  });
});