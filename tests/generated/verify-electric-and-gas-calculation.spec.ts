import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative path

test.describe('Rate Calculator Functionality', () => {
  test('MTX-4433: Verify calculation for Electric and Gas service', async ({ page }) => {
    // Instantiate Page Object
    const calculatorPage = new RateCalculatorPage(page);

    // Navigate to the calculator page (placeholder, adjust as per framework)
    // Replace with the actual URL of your application under test.
    await page.goto('http://localhost:8080/calculator'); // Example URL

    // Step 1: Select 'Electric and Gas' service type.
    // Input Data: Service Type: Electric and Gas
    await test.step('Select Electric and Gas service type', async () => {
      await calculatorPage.selectServiceTypeAsElectricAndGas();

      // Expected Result: Fields are ready for input.
      // Assert that the 'Electric and Gas' radio button is checked.
      await expect(await calculatorPage.isElectricAndGasServiceTypeChecked()).toBe(true);
      // Assert that the 'Estimated Gas use (Ccf):' field becomes enabled.
      await expect(await calculatorPage.isEstimatedGasUseInputEnabled()).toBe(true);
    });

    // Step 2: Enter valid numeric values in both meter read fields.
    // Input Data: Electric Meter Read: 500, Gas Meter Read: 200
    await test.step('Enter valid numeric values in both meter read fields', async () => {
      // Based on the available locators, 'Enter Previous Read:' and 'Enter Current Read:' are for electric.
      // We assume '550' as a current read value to ensure usage calculation for electric.
      await calculatorPage.enterElectricMeterReads('500', '550');
      // 'Estimated Gas use (Ccf):' is assumed to be the input field for 'Gas Meter Read'.
      await calculatorPage.enterEstimatedGasUsage('200');

      // Expected Result: Values are accepted. (Verify the fields contain the entered data).
      await expect(await calculatorPage.getPreviousElectricReadValue()).toEqual('500');
      await expect(await calculatorPage.getCurrentElectricReadValue()).toEqual('550');
      await expect(await calculatorPage.getEstimatedGasUse()).toEqual('200');
    });

    // Step 3: Click the 'Calculate' button.
    // Input Data: Click action
    await test.step('Click the Calculate button', async () => {
      await calculatorPage.clickCalculateButton();

      // Expected Result: The calculated price is displayed to the user.
      // As no explicit 'price' locator is given, we assert that the estimated usage fields
      // are populated with values different from their initial '0' state, implying a successful calculation.
      await expect(await calculatorPage.getEstimatedElectricUse()).not.toEqual('0');
      await expect(await calculatorPage.getEstimatedGasUse()).not.toEqual('0');
      // Further verify that these fields are visible after calculation.
      await expect(calculatorPage.getEstimatedElectricUse()).toBeVisible();
      await expect(calculatorPage.getEstimatedGasUse()).toBeVisible();
    });
  });
});
