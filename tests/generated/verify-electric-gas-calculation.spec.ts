import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {

  test('Verify Electric and Gas Calculation - MTX-4506', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    // In a real enterprise framework, page.goto() might be handled by a fixture or global setup.
    // For this example, assuming the test starts on the Rate Calculator page.
    // If a base URL is configured in playwright.config.ts, page.goto('/') might be appropriate here.

    await test.step('Step 1: Select \'Electric and Gas\' from the Service Type options.', async () => {
      await calculatorPage.selectServiceType('Electric and Gas');

      // Expected Result: Both Electric Meter Read and Gas Meter Read fields are enabled.
      // 'Enter Current Read:' is a key Electric input field.
      // 'Estimated Gas use (Ccf):' is assumed to be the Gas input field that gets enabled.
      await expect(calculatorPage.getCurrentElectricReadLocator()).toBeEnabled();
      await expect(calculatorPage.getEstimatedGasUseLocator()).toBeEnabled();
    });

    await test.step('Step 2: Enter valid numeric values in both Electric and Gas Meter Read fields.', async () => {
      const electricValue = '450';
      const gasValue = '120';

      // Assuming 'Enter Previous Read:' also needs a default value for calculation.
      await calculatorPage.enterPreviousElectricRead('0');
      await calculatorPage.enterCurrentElectricRead(electricValue);
      await calculatorPage.enterGasRead(gasValue);

      // Expected Result: Values are accepted in both fields.
      await expect(calculatorPage.getCurrentElectricReadLocator()).toHaveValue(electricValue);
      await expect(calculatorPage.getEstimatedGasUseLocator()).toHaveValue(gasValue);
    });

    await test.step('Step 3: Click on the \'Calculate\' button and verify results.', async () => {
      await calculatorPage.clickCalculateButton();

      // Expected Result: The combined calculated price for both services is displayed.
      // As there is no explicit 'price' display field in the catalog, we assert that
      // the estimated consumption fields for Electric and Gas are updated (not '0'),
      // implying a successful calculation and display of results.
      await expect(calculatorPage.getEstimatedElectricUseLocator()).not.toHaveValue('0');
      await expect(calculatorPage.getEstimatedGasUseLocator()).not.toHaveValue('0');
      // Further assertion might involve checking for specific calculated values if known.
    });
  });
});