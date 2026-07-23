import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage';

test.describe('Rate Calculator - Electric Only Service Validation', () => {
  test('Validate Calculation for Electric Only Service', async ({ page }) => {
    // Navigate to the calculator page (assuming base URL is configured in playwright.config.ts)
    // await page.goto('/calculator'); // This step is typically handled in a before hook or fixture, 
                                   // but for a standalone test, it might be included here if not globally configured.
                                   // Assuming the test context will open the page relevant to the calculator.

    const calculatorPage = new CalculatorPage(page);

    // Step 1: Select 'Electric only' from the Service Type dropdown (interpreted as radio button based on locators)
    await test.step('Select 'Electric only' service type and verify field states', async () => {
      await calculatorPage.selectServiceTypeElectricOnly();
      // Expected Result: Electric Meter Read field is enabled; Gas Meter Read field may be disabled or hidden depending on UI design.
      await expect(calculatorPage.PreviousMeterReadField).toBeEnabled();
      await expect(calculatorPage.EstimatedGasUseField).toBeDisabled(); // Locator catalog says gasconsumption is disabled
    });

    // Step 2: Enter a valid value in the Electric Meter Read field
    await test.step('Enter a valid value in the Electric Meter Read field', async () => {
      await calculatorPage.enterPreviousElectricMeterRead('500');
      // Expected Result: Value is accepted in the field.
      await expect(calculatorPage.PreviousMeterReadField).toHaveValue('500');
    });

    // Step 3: Click the Calculate button
    await test.step('Click the Calculate button and verify result display', async () => {
      await calculatorPage.clickCalculateButton();
      // Expected Result: The calculated price is displayed to the user.
      // Assuming 'Estimated Electric use (kWh):' field will display a non-zero calculated value.
      await expect(calculatorPage.EstimatedElectricUseField).not.toHaveValue('0', { timeout: 10000 }); // Add timeout for potential calculation delay
    });
  });
});