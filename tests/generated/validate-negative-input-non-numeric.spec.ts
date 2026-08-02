import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Validate Negative Input - Non-Numeric Values for Rate Calculator', () => {
  const CALCULATOR_URL = '/calculator'; // Placeholder URL, adjust as per application environment

  test.beforeEach(async ({ page }) => {
    // Assuming a base URL is configured in playwright.config.ts
    // and the path to the calculator is '/calculator'
    await page.goto(CALCULATOR_URL);
  });

  test('should prevent entry or maintain default value for non-numeric Electric Meter Read', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);
    const invalidInput = 'ABC';
    const initialValue = await rateCalculatorPage.getPreviousElectricMeterReadValue();

    // Step 1: Enter alphabetic characters into the Electric Meter Read field.
    await rateCalculatorPage.enterPreviousElectricMeterRead(invalidInput);

    // Expected Result: System prevents entry or displays a validation error message.
    // Given no explicit error message locator, we assert that the input field's value
    // either remains its initial state (0, as per locator catalog) or becomes empty,
    // indicating prevention of non-numeric input.
    const actualValueAfterInput = await rateCalculatorPage.getPreviousElectricMeterReadValue();

    // In many number-only fields, non-numeric input is ignored, and the field retains its previous valid value or '0'.
    // Based on the 'currentValue: "0"' in the locator catalog, asserting it remains '0' is appropriate.
    expect(actualValueAfterInput).toBe(initialValue);
    expect(actualValueAfterInput).toBe('0'); // Explicitly assert it remains '0' as per catalog initial value
  });
});
