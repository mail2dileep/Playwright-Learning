import { test, expect, Page } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage'; // Adjust path as needed based on framework structure

test.describe('Calculator Input Validation - MTX-4433', () => {

  test('should prevent non-numeric input in Previous Electric Read field', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    // Step 1: Navigate to the calculator page (assuming a base URL)
    await calculatorPage.navigate('http://localhost:3000/calculator'); // Example URL

    // Action: Enter alphabetic characters into the 'Electric Meter Read' field.
    // Input Data: Electric Meter Read: ABC
    await calculatorPage.enterPreviousRead('ABC');

    // Expected Result: System prevents entry or displays a validation error message.
    // Since there's no locator for an error message, we verify the field's value.
    // Assuming the system prevents non-numeric input by reverting to its default or clearing.
    // The initial currentValue for this field is "0".
    await expect(calculatorPage.getPreviousReadValue()).resolves.toBe('0');
  });
});