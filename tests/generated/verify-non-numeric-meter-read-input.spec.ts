import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage';

test.describe('Meter Read Input Validation', () => {
  test('Verify validation for non-numeric meter read inputs (MTX-4433)', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    const baseURL = 'http://example.com/calculator'; // Placeholder URL, replace with actual application URL

    // Navigate to the calculator page
    await calculatorPage.navigateTo(baseURL);

    // Step 1: Enter alphabetic characters into the 'Electric Meter Read' field.
    // Input Data: Electric Meter Read: ABC
    await calculatorPage.enterPreviousElectricMeterRead('ABC');

    // Attempt to click the 'Calculate' button
    // The system is expected to prevent the 'Calculate' action.
    // We check the disabled state of the button as an indicator of prevention/validation.
    await calculatorPage.clickCalculateButton();

    // Expected Result: The system displays a validation error or prevents the 'Calculate' action.
    // Since no explicit error message locator is provided, we assert that the 'Calculate' button is disabled.
    await expect(calculatorPage.getCalculateButtonLocator()).toBeDisabled();
  });
});
