import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Negative Input Validation for Meter Reads', () => {
  const BASE_URL = 'https://example.com/rate-calculator'; // Placeholder URL, replace with actual application URL

  test('should prevent alphabetic input in electric current read field', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigateToCalculator(BASE_URL);

    // Step 1: Enter alphabetic characters in the Electric Meter Read field.
    const alphabeticInput = 'ABC';
    const initialValue = await rateCalculatorPage.getCurrentElectricReadValue();
    await rateCalculatorPage.enterCurrentElectricRead(alphabeticInput);

    // Expected Result: System prevents entry or displays a validation error message.
    // Since no specific error message locator is provided, we assert that the input value
    // did not change to the invalid alphabetic characters. Assuming the field reverts to '0' or remains empty.
    const currentValueAfterInput = await rateCalculatorPage.getCurrentElectricReadValue();
    expect(currentValueAfterInput).not.toBe(alphabeticInput);
    expect(currentValueAfterInput).toBe(initialValue); // Expecting it to revert to initial state (e.g., '0') if invalid input is prevented.

    // Note: Test Step 2 (Enter a negative value in the Gas Meter Read field) is omitted
    // because the 'Estimated Gas use (Ccf):' field is marked as disabled in the Locator Catalog.
    // Interaction with disabled elements is not permitted by the rules unless a prior step enables them.
  });
});
