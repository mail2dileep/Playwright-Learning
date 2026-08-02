import { test, expect } from "@playwright/test";
import { CalculatorPage } from "../../pages/CalculatorPage";

test.describe('Negative Input Handling in Rate Calculator (MTX-4278)', () => {
  const CALCULATOR_URL = '/calculator'; // Assuming a base URL is configured in playwright.config.ts

  test('should prevent non-numeric input and prompt for valid values', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    await calculatorPage.navigateTo(CALCULATOR_URL);

    // Step 1: Enter non-numeric text into the Meter Read fields.
    await test.step('Enter non-numeric text into Meter Read fields', async () => {
      await calculatorPage.enterPreviousRead('abc');
      await calculatorPage.enterCurrentRead('xyz');

      // Expected Result: System prevents entry or displays a validation error message.
      // Assuming the input fields revert to '0' or prevent non-numeric entry, keeping '0'.
      await expect(calculatorPage.getPreviousReadInputLocator(), 'Previous Read field should remain 0').toHaveValue('0');
      await expect(calculatorPage.getCurrentReadInputLocator(), 'Current Read field should remain 0').toHaveValue('0');
    });

    // Step 2: Click 'Calculate' with empty fields.
    await test.step('Click "Calculate" with empty fields', async () => {
      // Fields are effectively empty/default '0' from Step 1.
      await calculatorPage.clickCalculateButton();

      // Expected Result: System prompts the user to enter valid values.
      // Assuming the calculation output fields will not update and retain their default '0'.
      await expect(calculatorPage.getEstimatedElectricUseOutputLocator(), 'Estimated Electric use should remain 0').toHaveValue('0');
      // No explicit error message locator from catalog, so verifying output state.
    });
  });
});
