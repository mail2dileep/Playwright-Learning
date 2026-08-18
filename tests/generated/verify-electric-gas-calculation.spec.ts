import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage'; // Adjust path as necessary

test.describe('Energy Consumption Calculator', () => {
  let calculatorPage: CalculatorPage;
  const baseUrl = 'https://example.com/calculator'; // Placeholder URL for the application under test

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    await calculatorPage.navigateTo(baseUrl);
  });

  test('Verify calculation for Electric and Gas service', async () => {
    await test.step('Step 1: Select "Electric and Gas" service type', async () => {
      await calculatorPage.selectServiceType('Electric and Gas');

      // Expected Result: Both input fields are active.
      await expect(calculatorPage.getEstimatedElectricUseField()).toBeEnabled();
      await expect(calculatorPage.getEstimatedGasUseField()).toBeEnabled();
    });

    await test.step('Step 2: Enter valid numeric values in both meter read fields', async () => {
      // The input data "Electric: 400, Gas: 200" from the requirement cannot be directly entered
      // into the 'Previous Read' and 'Current Read' fields as these are not specific to Electric/Gas.
      // Assuming generic meter read values that would lead to some consumption.
      const previousReadValue = '1000';
      const currentReadValue = '1400';

      await calculatorPage.enterMeterReads(previousReadValue, currentReadValue);

      // Expected Result: Values are accepted.
      await expect(calculatorPage.getPreviousReadValue()).toEqual(previousReadValue);
      await expect(calculatorPage.getCurrentReadValue()).toEqual(currentReadValue);
    });

    await test.step('Step 3: Click the "Calculate" button', async () => {
      await calculatorPage.clickCalculateButton();

      // Expected Result: The total calculated price for both services is displayed.
      // This implies that the output fields for estimated electric and gas use should now contain calculated values.
      const estimatedElectricUse = await calculatorPage.getEstimatedElectricUseValue();
      const estimatedGasUse = await calculatorPage.getEstimatedGasUseValue();

      await expect(estimatedElectricUse).not.toBe('');
      await expect(estimatedElectricUse).not.toBe('0'); // Expecting a non-zero calculation result for electric.
      await expect(estimatedGasUse).not.toBe('');
      await expect(estimatedGasUse).not.toBe('0');     // Expecting a non-zero calculation result for gas (now that EG service is selected).
    });
  });
}