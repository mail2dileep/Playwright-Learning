import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage';

test.describe('Calculator Page - Electric Only Functionality', () => {

  test('should correctly calculate electric usage when \'Electric only\' service type is selected', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    // Assume navigation to the calculator page is handled by a global setup or beforeEach hook
    // For demonstration, navigate to a placeholder URL.
    await page.goto('/calculator'); 

    // Step 1: Select 'Electric only' from the Service type dropdown (using radio button)
    await test.step("Select 'Electric only' service type", async () => {
      await calculatorPage.selectElectricOnlyService();
      // Expected Result: Only Electric-related input fields are active/relevant.
      // The 'Estimated Gas use (Ccf):' field should be disabled.
      await expect(calculatorPage.getEstimatedGasUseFieldLocator()).toBeDisabled();
    });

    // Step 2: Enter a value in the 'Electric Meter Read' fields
    // We'll enter values for both previous and current reads to enable a calculation.
    await test.step("Enter meter read values for electric service", async () => {
      await calculatorPage.enterPreviousRead('500');
      await calculatorPage.enterCurrentRead('1000');
      // Expected Result: Values are accepted in the fields.
      await expect(calculatorPage.getPreviousMeterReadFieldLocator()).toHaveValue('500');
      await expect(calculatorPage.getCurrentMeterReadFieldLocator()).toHaveValue('1000');
    });

    // Step 3: Click the 'Calculate' button.
    await test.step("Click 'Calculate' button", async () => {
      await calculatorPage.clickCalculateButton();
      // Expected Result: The calculated price for electric service is displayed.
      // Assuming 1000 (current) - 500 (previous) = 500 kWh.
      await expect(calculatorPage.getEstimatedElectricUseFieldLocator()).toHaveValue('500');
    });

  });
});