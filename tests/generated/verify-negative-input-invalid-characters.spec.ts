import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator - Negative Input Scenarios', () => {

  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming a base URL is configured in playwright.config.ts or passed directly
    await rateCalculatorPage.navigateTo('https://www.example.com/calculator'); // Placeholder URL
  });

  test('MTX-4433: Verify that alphabetic characters are not accepted in Electric Meter Read field', async () => {
    const invalidInput = 'ABC';
    
    // Get the initial value of the field. From the catalog, it's '0'.
    const initialValue = await rateCalculatorPage.getPreviousElectricMeterReadValue();

    await rateCalculatorPage.enterPreviousElectricMeterRead(invalidInput);

    // Retrieve the value after attempting to input invalid characters.
    const finalValue = await rateCalculatorPage.getPreviousElectricMeterReadValue();

    // Assertion: System prevents entry means the value should not change to the invalid input.
    // More specifically, it should remain the initial value or be empty.
    // Given the 'currentValue' is '0', we expect it to remain '0' if entry is prevented.
    expect(finalValue).toBe(initialValue, 'Expected Electric Meter Read field value to remain unchanged (prevented invalid input).');
    expect(finalValue).not.toBe(invalidInput, `Expected Electric Meter Read field not to accept '${invalidInput}'.`);
  });
});