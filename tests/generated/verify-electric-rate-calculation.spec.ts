import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import

test.describe('Electric Rate Calculator Functionality', () => {

  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming a base URL is set in playwright.config.ts and the calculator is at the root or a known path.
    // For this example, let's assume the calculator is the primary content of the page after navigation.
    await rateCalculatorPage.navigateTo('/');
  });

  test('should successfully calculate electric usage for a given month and meter reads', async () => {
    const month = 'm07'; // July
    const previousRead = '1000';
    const currentRead = '1250';
    const expectedEstimatedUsage = '250'; // Based on (1250 - 1000)

    // Step 1: Select a month
    await rateCalculatorPage.selectMonth(month);
    await expect(await rateCalculatorPage.getSelectedMonth()).toBe(month);

    // Step 2: Enter previous meter read
    await rateCalculatorPage.enterPreviousRead(previousRead);
    await expect(await rateCalculatorPage.getPreviousRead()).toBe(previousRead);

    // Step 3: Enter current meter read
    await rateCalculatorPage.enterCurrentRead(currentRead);
    await expect(await rateCalculatorPage.getCurrentRead()).toBe(currentRead);

    // Step 4: Select electric service type
    await rateCalculatorPage.selectElectricService();
    await expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true);
    await expect(await rateCalculatorPage.isElectricAndGasServiceSelected()).toBe(false);

    // Step 5: Click Calculate
    await rateCalculatorPage.clickCalculate();

    // Step 6: Verify the estimated electric usage
    // This assumes the calculation happens client-side immediately or after a quick server roundtrip.
    await expect(rateCalculatorPage.estimatedElectricUseInputLocator).toBeVisible(); // Check visibility first
    await expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe(expectedEstimatedUsage);

  });

  test('should reset form fields when the Reset button is clicked', async () => {
    // Fill some fields first
    await rateCalculatorPage.selectMonth('m08'); // August
    await rateCalculatorPage.enterPreviousRead('500');
    await rateCalculatorPage.enterCurrentRead('700');
    await rateCalculatorPage.selectElectricService();
    await rateCalculatorPage.clickCalculate(); // To ensure fields are populated and possibly calculation done

    // Verify fields are filled
    await expect(await rateCalculatorPage.getSelectedMonth()).toBe('m08');
    await expect(await rateCalculatorPage.getPreviousRead()).toBe('500');
    await expect(await rateCalculatorPage.getCurrentRead()).toBe('700');
    await expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true);

    // Click Reset
    await rateCalculatorPage.clickReset();

    // Verify fields are reset to initial values
    // Initial values from catalog: Month (m06), Previous (0), Current (0), Estimated (0)
    await expect(await rateCalculatorPage.getSelectedMonth()).toBe('m06'); // Default from catalog
    await expect(await rateCalculatorPage.getPreviousRead()).toBe('0');   // Default from catalog
    await expect(await rateCalculatorPage.getCurrentRead()).toBe('0');    // Default from catalog
    // Based on catalog 'e' has currentValue 'E', implying it's the default and should be selected again after reset.
    await expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true);
    await expect(await rateCalculatorPage.isElectricAndGasServiceSelected()).toBe(false);
    await expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0'); // Default from catalog
  });

});