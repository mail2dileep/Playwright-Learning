import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Pre-condition: The Rate Calculator page should be loaded.
    // In an enterprise framework, navigation might be handled by a global setup or fixture.
    // Example: await page.goto('YOUR_CALCULATOR_URL');
  });

  test('Verify Reset Functionality clears all input fields and selection to default state', async () => {
    await test.step('Step 1: Enter values into the meter read fields and select a service type', async () => {
      // Input Data: Electric: 1000, Gas: 400, Service: Electric and Gas
      // Assuming 'Electric: 1000' is Previous Read and 'Gas: 400' implies a Current Read of 1400 (1000 + 400).
      await rateCalculatorPage.enterMeterReads('1000', '1400');
      await rateCalculatorPage.selectServiceType('Electric and Gas');

      // Expected Result: Fields are populated with data.
      await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('1000');
      await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('1400');
      await expect(await rateCalculatorPage.isServiceTypeSelected('Electric and Gas')).toBe(true);
    });

    await test.step('Step 2: Click on the Reset button', async () => {
      // Input Data: Click Reset
      await rateCalculatorPage.clickReset();

      // Expected Result: All input fields are cleared and the service type dropdown returns to its default state.
      // Default values are based on the Locator Catalog's 'currentValue' where available, or common form reset behavior.
      await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
      await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
      await expect(await rateCalculatorPage.getMonthDropdownValue()).toBe('m06'); // Default month: June (value 'm06')
      await expect(await rateCalculatorPage.isServiceTypeSelected('Electric')).toBe(false); // Assuming no service type is selected by default after reset
      await expect(await rateCalculatorPage.isServiceTypeSelected('Electric and Gas')).toBe(false);

      // Verify output/calculated fields also reset to their default '0' values.
      await expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
      await expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
    });
  });
}