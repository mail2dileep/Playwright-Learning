import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../pages/RateCalculatorPage";

test.describe('Energy Calculator Functionality', () => {
  test('Verify calculation for Electric and Gas service', async ({ page }) => {
    // Navigate to the calculator page. Replace with your actual application URL.
    // await page.goto('http://your-application-url/calculator');

    const calculatorPage = new RateCalculatorPage(page);

    // Step 1: Select 'Electric and Gas' service type.
    // Input Data: Service Type: Electric and Gas
    // Expected Result: Fields are ready for input.
    await test.step('Select "Electric and Gas" service type', async () => {
      await calculatorPage.selectElectricAndGasServiceType();
      // Verify that the 'Estimated Gas use' field becomes enabled, indicating it's ready for input.
      await expect(calculatorPage.gasUseInputLocator).toBeEnabled();
    });

    // Step 2: Enter valid numeric values in both meter read fields.
    // Input Data: Electric Meter Read: 500, Gas Meter Read: 200
    // Expected Result: Values are accepted.
    await test.step('Enter valid numeric values in meter read fields', async () => {
      await calculatorPage.enterElectricUse('500');
      await calculatorPage.enterGasUse('200');

      // Assert that the entered values are correctly reflected in the input fields.
      await expect(await calculatorPage.getElectricUseValue()).toEqual('500');
      await expect(await calculatorPage.getGasUseValue()).toEqual('200');
    });

    // Step 3: Click the 'Calculate' button.
    // Input Data: Click action
    // Expected Result: The calculated price is displayed to the user.
    await test.step('Click the "Calculate" button', async () => {
      await calculatorPage.clickCalculate();
      // TODO: Implement assertion for the calculated price display.
      // A specific locator for the calculated price display element is needed from the catalog.
      // Example if a locator like 'calculatedPriceDisplay' was available:
      // await expect(calculatorPage.calculatedPriceDisplayLocator).toBeVisible();
      // await expect(calculatorPage.calculatedPriceDisplayLocator).toHaveText(/\$\d{1,3}(,\d{3})*\.\d{2}/); // Example regex for currency format
    });
  });
});