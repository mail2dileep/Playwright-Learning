import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed for project structure

test.describe('Rate Calculator - Electric and Gas Service Calculation', () => {
  let calculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new RateCalculatorPage(page);
    // Assuming a base URL is set in playwright.config.ts or passed directly
    // For example: await calculatorPage.navigateTo('/energy-calculator');
    await calculatorPage.navigateTo('/calculator'); // Example URL, replace with actual page URL
  });

  test('TC_003 - Validate Calculation for Electric and Gas Service', async () => {
    // Step 1: Select 'Electric and Gas' from the Service Type dropdown.
    await test.step('Select "Electric and Gas" service type', async () => {
      await calculatorPage.selectServiceTypeElectricAndGas();
    });

    // Expected Result: Both Electric Meter Read and Gas Meter Read fields are active.
    await test.step('Verify Electric and Gas meter read fields are active', async () => {
      await expect(await calculatorPage.isEstimatedElectricUseFieldEnabled(), 'Estimated Electric use field should be enabled').toBe(true);
      await expect(await calculatorPage.isEstimatedGasUseFieldEnabled(), 'Estimated Gas use field should be enabled after selecting EG').toBe(true);
    });

    // Step 2: Enter valid numeric values in both meter read fields.
    const electricConsumption = '450';
    const gasConsumption = '120';
    await test.step(`Enter Electric: ${electricConsumption} and Gas: ${gasConsumption} consumption values`, async () => {
      await calculatorPage.enterElectricConsumption(electricConsumption);
      await calculatorPage.enterGasConsumption(gasConsumption);
    });

    // Expected Result: Values are accepted.
    await test.step('Verify entered values are accepted', async () => {
      await expect(await calculatorPage.getEstimatedElectricUseValue(), `Electric consumption should be ${electricConsumption}`).toBe(electricConsumption);
      await expect(await calculatorPage.getEstimatedGasUseValue(), `Gas consumption should be ${gasConsumption}`).toBe(gasConsumption);
    });

    // Step 3: Click on the 'Calculate' button.
    await test.step('Click on the "Calculate" button', async () => {
      await calculatorPage.clickCalculateButton();
    });

    // Expected Result: The total price for both services is displayed correctly.
    await test.step('Verify the total price for both services is displayed correctly', async () => {
      // TODO: Locator for the total price display is missing in the provided catalog.
      //       Cannot assert specific total price without a corresponding locator.
      //       This assertion would typically involve getting the text content of the total price element
      //       and comparing it against an expected calculated value or a specific format.
      // Example placeholder:
      // const actualTotalPrice = await calculatorPage.getCalculatedTotalPrice();
      // await expect(actualTotalPrice).toBe('$XXX.XX'); // Replace with actual expected value
      console.warn("WARNING: Cannot verify 'total price for both services is displayed correctly' because the locator for total price is missing in the catalog.");
    });
  });
});
