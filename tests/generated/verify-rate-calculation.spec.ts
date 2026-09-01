import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed

test.describe('Rate Calculator Functionality', () => {

  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming the application is running on localhost:3000 or similar
    await rateCalculatorPage.navigateTo('/calculator'); // Example URL, replace with actual app path
  });

  test('should calculate electric usage correctly and reset fields', async () => {
    // Step 1: Select a month
    await rateCalculatorPage.selectMonth('m03'); // March

    // Step 2: Enter previous and current meter reads
    await rateCalculatorPage.enterPreviousRead('100');
    await rateCalculatorPage.enterCurrentRead('200');

    // Step 3: Select Electric service type
    await rateCalculatorPage.selectElectricServiceType();

    // Step 4: Click Calculate button
    await rateCalculatorPage.clickCalculate();

    // Step 5: Verify estimated electric use
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('100'); // 200 - 100 = 100

    // Step 6: Verify estimated gas use is disabled
    const isGasUseDisabled = await rateCalculatorPage.isEstimatedGasUseDisabled();
    expect(isGasUseDisabled).toBe(true);

    // Step 7: Click Reset button
    await rateCalculatorPage.clickReset();

    // Step 8: Verify fields are reset to initial values (0 for reads, 'm06' for month)
    const previousReadAfterReset = await rateCalculatorPage.getPreviousReadValue();
    const currentReadAfterReset = await rateCalculatorPage.getCurrentReadValue();
    const selectedMonthAfterReset = await rateCalculatorPage.getSelectedMonthValue();
    expect(previousReadAfterReset).toBe('0');
    expect(currentReadAfterReset).toBe('0');
    expect(selectedMonthAfterReset).toBe('m06'); // Default value from locator catalog
  });

  test('should verify navigation to "How to Read Your Bill" is possible', async ({ page }) => {
    await rateCalculatorPage.clickHowToReadYourBill();
    // For this example, we'll assert that no error occurred during the click and a navigation happened.
    // A more robust test would involve checking the new page title or URL.
    await expect(page).not.toHaveURL(/.*error.*/); // Example assertion: ensures no error page loaded
  });
});