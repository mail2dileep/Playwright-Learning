import { test, expect } from '@playwright/test';
import { BillCalculatorPage } from '../../pages/BillCalculatorPage'; // Adjust path as necessary

test.describe('Bill Calculation for Electric Only Service', () => {

  test('Validate Bill Calculation for Electric Only Service', async ({ page }) => {
    const billCalculatorPage = new BillCalculatorPage(page);

    // Navigate to the calculator page if not already there.
    // Typically, the base URL is configured in playwright.config.ts.
    // If a specific path is needed, uncomment and adjust:
    // await billCalculatorPage.navigateToCalculatorPage('/your-calculator-path');

    await test.step('Step 1: Select \'Electric only\' from the Service Type dropdown.', async () => {
      await billCalculatorPage.selectElectricOnlyService();

      // Expected Result: Electric Meter Read field is enabled; Gas Meter Read field is disabled or hidden.
      await expect(await billCalculatorPage.isPreviousElectricMeterReadInputEnabled(), 'Previous Electric Meter Read field should be enabled').toBe(true);
      await expect(await billCalculatorPage.isEstimatedGasUseCcfInputDisabled(), 'Estimated Gas Use (Ccf) field should be disabled').toBe(true);
    });

    await test.step('Step 2: Enter a valid numeric value in the Electric Meter Read field.', async () => {
      const electricReadValue = '500';
      await billCalculatorPage.enterPreviousElectricMeterRead(electricReadValue);

      // Expected Result: Value is accepted in the field.
      await expect(await billCalculatorPage.getPreviousElectricMeterReadValue(), `Previous Electric Meter Read field should have value "${electricReadValue}"`).toBe(electricReadValue);
    });

    await test.step('Step 3: Click on the \'Calculate\' button.', async () => {
      await billCalculatorPage.clickCalculateButton();

      // Expected Result: The calculated price is displayed to the user based on the configured Electric fuel rates.
      // This assertion checks if the 'Estimated Electric use (kWh)' field contains a non-empty value after calculation.
      const calculatedKwhValue = await billCalculatorPage.getEstimatedElectricUseKwhValue();
      expect(calculatedKwhValue).not.toBeNull();
      expect(calculatedKwhValue).not.toBe('');
      // Optionally, if the exact calculation logic and expected result are known, one could assert a specific value:
      // expect(Number(calculatedKwhValue)).toBeGreaterThan(0);
    });
  });
});
