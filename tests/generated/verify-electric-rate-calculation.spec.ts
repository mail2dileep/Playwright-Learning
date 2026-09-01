import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import

test.describe('Rate Calculator Functionality', () => {
  // Define a placeholder URL. Adjust this to your application's actual URL.
  const TEST_URL = 'http://localhost:3000/calculator'; 

  test.beforeEach(async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigateTo(TEST_URL);
  });

  test('should successfully calculate electric consumption for a given period', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    const month = 'm03'; // March
    const previousRead = '1000';
    const currentRead = '1500';
    const expectedKwh = '500'; // Assuming (current - previous) = kWh based on simple logic

    // Perform calculation using a workflow method
    await rateCalculatorPage.calculateElectricConsumption(month, previousRead, currentRead);

    // Assert the estimated electric use from the Page Object's getter
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toEqual(expectedKwh);
  });

  test('should reset all fields to their default values when the Reset button is clicked', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Fill some fields first to ensure they change from their initial default values
    await rateCalculatorPage.selectBillingMonth('m07'); // Change from default 'm06'
    await rateCalculatorPage.enterPreviousRead('2000'); // Change from default '0'
    await rateCalculatorPage.enterCurrentRead('2100'); // Change from default '0'
    await rateCalculatorPage.selectServiceTypeElectricGas(); // Change from assumed default 'Electric'

    // Click the reset button
    await rateCalculatorPage.clickResetButton();

    // Verify fields are reset to default values based on the Locator Catalog's initial/currentValue
    expect(await rateCalculatorPage.getCurrentMonthValue()).toEqual('m06'); // Default from catalog
    expect(await rateCalculatorPage.getPreviousReadValue()).toEqual('0'); // Default from catalog
    expect(await rateCalculatorPage.getCurrentReadValue()).toEqual('0'); // Default from catalog
    expect(await rateCalculatorPage.isServiceTypeElectricChecked()).toBe(true); // Assuming 'Electric' is the default selected radio
    expect(await rateCalculatorPage.isServiceTypeElectricGasChecked()).toBe(false);
  });
});