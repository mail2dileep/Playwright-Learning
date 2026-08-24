import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming the application loads the calculator at the root or a known path.
    // A real enterprise solution would use a base URL from playwright.config.ts
    // and specific path or route, e.g., await page.goto('/rate-calculator');
    await page.goto('https://www.example.com/rate-calculator'); // Placeholder URL, adjust as needed
  });

  test('should successfully calculate electric rates', async () => {
    // Step 1: Fill out the form for Electric service
    const month = 'm07'; // Represents July
    const previousRead = '1000';
    const currentRead = '1500';
    const expectedKwh = '500'; // Assuming a simple calculation (Current - Previous)

    await rateCalculatorPage.calculateRates(month, previousRead, currentRead, 'Electric');

    // Step 2: Verify the estimated electric use
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe(expectedKwh);
  });

  test('should successfully calculate electric and gas rates (electric portion)', async () => {
    // Note: The 'Estimated Gas use (Ccf)' input is disabled according to the provided locator catalog.
    // Therefore, this test focuses on confirming the electric calculation aspect when 'Electric & Gas' service type is selected.
    // If an enabled output field for gas consumption becomes available, further assertions would be added.

    const month = 'm08'; // Represents August
    const previousRead = '2000';
    const currentRead = '2600';
    const expectedKwh = '600'; // Assuming a simple calculation (Current - Previous)

    await rateCalculatorPage.calculateRates(month, previousRead, currentRead, 'ElectricAndGas');

    // Verify the estimated electric use, as gas input is disabled and not directly verifiable via output field in the catalog.
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe(expectedKwh);
    // TODO: Add assertions for estimated gas use if an enabled output field for it becomes available in the future.
  });

  test('should display initial default values correctly', async () => {
    // Verify default month selection. According to the catalog, currentValue for Month is "m06" (June).
    await expect(rateCalculatorPage.monthSelect).toHaveValue('m06');

    // Verify initial meter read input values. According to the catalog, currentValue for these fields is "0".
    await expect(rateCalculatorPage.previousReadInput).toHaveValue('0');
    await expect(rateCalculatorPage.currentReadInput).toHaveValue('0');
    await expect(rateCalculatorPage.estimatedElectricUseInput).toHaveValue('0');
  });
});
