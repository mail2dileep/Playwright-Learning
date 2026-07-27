import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary

test.describe('Verify Service Type Selection - Electric and Gas', () => {
  test('should enable electric and gas fields and calculate combined price', async ({ page }) => {
    // TODO: Replace with actual URL for the calculator page
    await page.goto('/rate-calculator'); 

    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Select 'Electric and Gas' from the Service type radio button.
    // Input Data: Service Type: Electric and Gas
    await rateCalculatorPage.selectServiceTypeElectricAndGas();

    // Expected Result: Both Electric Meter Read and Gas Meter Read fields are enabled.
    await expect(rateCalculatorPage.getCurrentElectricReadInputField()).toBeEnabled();
    await expect(rateCalculatorPage.getEstimatedGasUseInputField()).toBeEnabled();

    // Step 2: Enter values in both meter read fields.
    // Input Data: Electric: 450 (Current Read), Gas: 120
    await rateCalculatorPage.enterElectricMeterReads('0', '450'); // Assuming previous read is 0 for this test scenario
    await rateCalculatorPage.enterEstimatedGasUse('120');

    // Expected Result: Values are accepted in both fields.
    await expect(rateCalculatorPage.getCurrentElectricReadInputField()).toHaveValue('450');
    await expect(rateCalculatorPage.getEstimatedGasUseInputField()).toHaveValue('120');

    // Step 3: Click the Calculate button.
    // Input Data: Click 'Calculate'
    await rateCalculatorPage.clickCalculateButton();

    // Expected Result: The combined calculated price for both services is displayed.
    // This typically means the output fields are visible and show calculated (non-zero) values.
    await expect(rateCalculatorPage.getEstimatedElectricUseOutputField()).toBeVisible();
    await expect(rateCalculatorPage.getEstimatedGasUseOutputField()).toBeVisible();
    
    // Assert that the calculated values are not the default '0' after calculation
    await expect(rateCalculatorPage.getEstimatedElectricUseOutputField()).not.toHaveValue('0');
    await expect(rateCalculatorPage.getEstimatedGasUseOutputField()).not.toHaveValue('0');
    // Further assertions could involve specific expected calculated values if they are known.
  });
});
