import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  test('Verify Service Type Selection - Electric Only', async ({ page }) => {
    // Assuming a base URL is configured in playwright.config.ts
    // For example: baseURL: 'http://localhost:3000/'
    // Navigate to the calculator page or the specific path where the component is rendered
    await page.goto('/calculator'); 

    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Select 'Electric only' from the Service Type and verify field visibility.
    // Expected: Only electric meter read fields are visible; gas meter read field is hidden.
    await test.step("Select 'Electric only' service type and verify field visibility", async () => {
      await rateCalculatorPage.selectServiceTypeElectricOnly();

      await expect(rateCalculatorPage.getPreviousElectricReadLocator()).toBeVisible();
      await expect(rateCalculatorPage.getCurrentElectricReadLocator()).toBeVisible();
      await expect(rateCalculatorPage.getEstimatedGasUseCcfLocator()).toBeHidden();
    });

    // Step 2: Enter a valid numeric value in the Electric Meter Read fields and click Calculate.
    // Expected: The calculated price for electric usage is displayed.
    await test.step('Enter electric meter read values and calculate', async () => {
      // Assuming previous read starts at 0, and current read is 500 for a usage of 500.
      await rateCalculatorPage.enterPreviousElectricRead('0');
      await rateCalculatorPage.enterCurrentElectricRead('500');
      await rateCalculatorPage.clickCalculate();

      const calculatedElectricUsage = await rateCalculatorPage.getEstimatedElectricUseKwhValue();

      // Verify that the estimated electric use output field is visible and contains a non-default value.
      await expect(rateCalculatorPage.getEstimatedElectricUseKwhLocator()).toBeVisible();
      await expect(calculatedElectricUsage).not.toBe('0'); // Expect a calculated value, not the default '0'
      await expect(calculatedElectricUsage).toMatch(/^\d+$/); // Ensure the value is a number
    });
  });
});