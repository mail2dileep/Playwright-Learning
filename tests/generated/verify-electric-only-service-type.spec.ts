import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as per your project structure

test.describe('Service Type Selection - Electric Only', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Navigate to the calculator page. Adjust URL as necessary for your environment.
    await page.goto('/calculator'); 
  });

  test('MTX-4433: Verify that selecting \"Electric only\" enables electric fields and disables gas fields', async ({ page }) => {
    // Step 1: Select 'Electric only' from the Service type dropdown (which is a radio button).
    await test.step('Select \"Electric only\" service type', async () => {
      await rateCalculatorPage.selectElectricOnlyServiceType();
    });

    // Expected Result: Electric Meter Read field is enabled; Gas Meter Read field is disabled or hidden.
    await test.step('Verify field enablement/disablement', async () => {
      await expect(rateCalculatorPage.getPreviousMeterReadInputField()).toBeEnabled();
      await expect(rateCalculatorPage.getEstimatedGasUseInputField()).toBeDisabled();
      await expect(rateCalculatorPage.getEstimatedElectricUseInputField()).toBeEnabled();
    });

    // Step 2: Enter a value in the Electric Meter Read field.
    await test.step('Enter 500 in Electric Meter Read field', async () => {
      await rateCalculatorPage.enterPreviousMeterRead('500');
    });

    // Expected Result: Value is accepted in the field.
    await test.step('Verify value is accepted', async () => {
      await expect(rateCalculatorPage.getPreviousMeterReadInputField()).toHaveValue('500');
    });

    // Step 3: Click the Calculate button.
    await test.step('Click the Calculate button', async () => {
      await rateCalculatorPage.clickCalculateButton();
    });

    // Expected Result: The calculated price for electric service is displayed.
    await test.step('Verify calculated electric service is displayed', async () => {
      // We expect the 'Estimated Electric use (kWh):' field to display a calculated value, not '0' or empty.
      await expect(rateCalculatorPage.getEstimatedElectricUseInputField()).not.toHaveValue('0');
      await expect(rateCalculatorPage.getEstimatedElectricUseInputField()).not.toHaveValue('');
      // Additional check for numerical value if needed:
      // const estimatedValue = await rateCalculatorPage.getEstimatedElectricUseInputField().inputValue();
      // expect(parseFloat(estimatedValue)).toBeGreaterThan(0);
    });
  });
}