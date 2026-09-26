import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary

test.describe('Rate Calculator Functionality', () => {

  // Test setup: Navigate to the calculator page before each test
  test.beforeEach(async ({ page }) => {
    // Assuming the base URL is configured in playwright.config.ts,
    // and '/calculator' is the path to the rate calculator page.
    await page.goto('/calculator');
  });

  test('should calculate electric usage correctly and verify gas field is disabled', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Select Month (August)
    await rateCalculatorPage.selectMonth('m08'); // 'm08' for August

    // Step 2: Enter Previous Read
    await rateCalculatorPage.enterPreviousRead('1000');

    // Step 3: Enter Current Read
    await rateCalculatorPage.enterCurrentRead('1500');

    // Step 4: Select Electric service type
    await rateCalculatorPage.selectServiceType('Electric');

    // Step 5: Click Calculate
    await rateCalculatorPage.clickCalculate();

    // Step 6: Verify Estimated Electric use
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('500'); // Assuming Current - Previous = Consumption

    // Step 7: Verify Estimated Gas use field is disabled
    const isGasFieldDisabled = await rateCalculatorPage.isEstimatedGasUseFieldDisabled();
    expect(isGasFieldDisabled).toBe(true);
    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).toBe('0'); // Expecting default/0 value as it's disabled and not calculated for 'Electric' service

    // Step 8: Click Reset
    await rateCalculatorPage.clickReset();

    // Step 9: Verify fields are reset to initial values
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
  });

  test('should verify navigation to "How to Read Your Bill" functionality', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await rateCalculatorPage.clickHowToReadYourBill();

    // Assuming clicking this button navigates to a new page or shows a modal/section.
    // For this example, let's assume it navigates to '/how-to-read-your-bill'.
    await expect(page).toHaveURL(/.*\/how-to-read-your-bill/);
    // Further assertions can be added to verify content on the new page/modal.
  });

  test('should verify navigation to "How to Find Usage" functionality', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await rateCalculatorPage.clickHowToFindUsage();

    // Assuming clicking this button navigates to a new page or shows a modal/section.
    // For this example, let's assume it navigates to '/how-to-find-usage'.
    await expect(page).toHaveURL(/.*\/how-to-find-usage/);
    // Further assertions can be added to verify content on the new page/modal.
  });

});