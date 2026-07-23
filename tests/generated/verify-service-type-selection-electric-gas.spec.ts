import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Service Type Selection', () => {
  const BASE_URL = 'http://localhost:3000/calculator'; // Placeholder URL, adjust as needed

  test('Verify Service Type Selection - Electric and Gas', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await page.goto(BASE_URL); // Navigate to the calculator page

    // Step 1: Select 'Electric and Gas' from the Service Type. The catalog indicates this is a radio button.
    await test.step("Select 'Electric and Gas' from the Service Type options", async () => {
      await rateCalculatorPage.selectServiceTypeElectricAndGas();
      
      // Expected Result: Both Electric Meter Read and Gas Meter Read fields are enabled.
      await expect(await rateCalculatorPage.isElectricConsumptionFieldEnabled()).toBe(true);
      await expect(await rateCalculatorPage.isGasConsumptionFieldEnabled()).toBe(true);
    });

    // Step 2: Enter values in both fields and click Calculate.
    await test.step('Enter values in both fields and click Calculate', async () => {
      await rateCalculatorPage.enterElectricConsumption('450');
      await rateCalculatorPage.enterGasConsumption('120');
      await rateCalculatorPage.clickCalculate();
      
      // Verify input values were set correctly before calculation
      await expect(await rateCalculatorPage.getElectricConsumptionValue()).toEqual('450');
      await expect(await rateCalculatorPage.getGasConsumptionValue()).toEqual('120');

      // Expected Result: The combined calculated price for both services is displayed.
      // TODO: Locator for 'combined calculated price' not found in catalog. 
      //       Add assertion here once a suitable locator is identified from the application.
    });
  });
});
