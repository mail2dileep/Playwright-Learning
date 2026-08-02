import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage';

test.describe('Service Type Selection - Electric and Gas', () => {

  test('Validate that selecting \'Electric and Gas\' allows input for both utilities', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    // Navigate to the calculator page (assuming base URL is configured in playwright.config.ts)
    // await page.goto('/calculator'); // Example navigation if needed
    // For this test, we assume we are already on the calculator_current parentContainer.

    // Step 1: Select 'Electric and Gas' from the Service Type dropdown.
    // Input Data: Service Type: Electric and Gas
    await test.step('Select \'Electric and Gas\' service type', async () => {
      await calculatorPage.selectElectricAndGasServiceType();

      // Expected Result: Both Electric Meter Read and Gas Meter Read fields are enabled and visible.
      await expect(calculatorPage.getElectricCurrentReadFieldLocator(), 'Electric Current Read field should be enabled').toBeEnabled();
      await expect(calculatorPage.getEstimatedGasUseFieldLocator(), 'Gas Meter Read field should be enabled').toBeEnabled();
    });

    // Step 2: Enter values in both fields and click Calculate.
    // Input Data: Electric Meter Read: 450, Gas Meter Read: 120
    await test.step('Enter meter reads and click Calculate', async () => {
      await calculatorPage.enterElectricCurrentRead('450');
      await calculatorPage.enterGasConsumption('120');
      await calculatorPage.clickCalculate();

      // Expected Result: The combined bill price for both Electric and Gas is calculated and displayed.
      // Assert that the estimated use fields have updated values (not '0' or default) implying calculation.
      const estimatedElectricUse = await calculatorPage.getEstimatedElectricUseValue();
      const estimatedGasUse = await calculatorPage.getEstimatedGasUseValue();

      await expect(estimatedElectricUse).not.toBeNull();
      await expect(estimatedElectricUse).not.toBe('0'); // Assuming '0' is the default and calculation changes it
      await expect(estimatedGasUse).not.toBeNull();
      await expect(estimatedGasUse).not.toBe('0'); // Assuming '0' is the default and calculation changes it
      
      // Further assertions could be added here if specific calculated values are known.
    });
  });
});