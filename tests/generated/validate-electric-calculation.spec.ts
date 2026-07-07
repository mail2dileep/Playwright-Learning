import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage'; // Adjust path as needed

test.describe('Validate Calculation for Electric Only Service', () => {
  test('should correctly compute price for Electric only service', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    // Assuming the test starts on the calculator page or navigates there
    // await page.goto('/your-calculator-page-url'); // Uncomment and specify URL if needed

    // Step 1: Select 'Electric only' service type.
    await calculatorPage.selectElectricOnlyService();

    // Expected Result: The 'Electric Meter Read' fields are enabled; 'Gas Meter Read' field is disabled.
    await expect(calculatorPage.getPreviousMeterReadLocator()).toBeEnabled();
    await expect(calculatorPage.getCurrentMeterReadLocator()).toBeEnabled();
    await expect(calculatorPage.getEstimatedGasUseLocator()).toBeDisabled();

    // Step 2: Enter a valid numeric value in the 'Electric Meter Read' field.
    // Assuming previous read is 0 and current is 500 for a usage of 500 kWh.
    await calculatorPage.enterPreviousMeterRead('0'); 
    await calculatorPage.enterCurrentMeterRead('500');

    // Expected Result: The value '500' is accepted in the current meter read field.
    await expect(calculatorPage.getCurrentMeterReadLocator()).toHaveValue('500');

    // Step 3: Click on the 'Calculate' button.
    await calculatorPage.clickCalculateButton();

    // Expected Result: The estimated electric use (kWh) reflects the entered usage.
    await expect(calculatorPage.getEstimatedElectricUseLocator()).toHaveValue('500');
  });
});
