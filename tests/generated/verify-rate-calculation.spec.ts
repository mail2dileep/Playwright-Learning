import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {

  test('should calculate electric usage and reset correctly', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Assume navigation to the calculator page is handled by Playwright config baseURL or a beforeEach hook.
    // Example: await page.goto('/calculator');

    // Step 1: Select a billing month (e.g., July, value 'm07')
    await rateCalculatorPage.selectBillingMonth('m07');
    await expect(rateCalculatorPage.getMonthDropdownValue()).resolves.toBe('m07');

    // Step 2: Enter previous meter read
    await rateCalculatorPage.enterPreviousMeterRead('1000');
    await expect(rateCalculatorPage.getPreviousMeterReadValue()).resolves.toBe('1000');

    // Step 3: Enter current meter read
    await rateCalculatorPage.enterCurrentMeterRead('1500');
    await expect(rateCalculatorPage.getCurrentMeterReadValue()).resolves.toBe('1500');

    // Step 4: Ensure Electric Only service type is selected (often default, but explicit for robustness)
    await rateCalculatorPage.selectServiceTypeElectricOnly();
    // As there is no direct public getter for radio button selection state in the PO, we'll omit assertion here.

    // Step 5: Click Calculate
    await rateCalculatorPage.clickCalculate();

    // Step 6: Verify estimated electric use (1500 - 1000 = 500 kWh)
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('500');

    // Step 7: Verify estimated gas use is disabled and its value is '0' (as per locator catalog data)
    const isGasUseDisabled = await rateCalculatorPage.isEstimatedGasUseDisabled();
    expect(isGasUseDisabled).toBe(true);
    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).toBe('0');

    // Step 8: Click Reset
    await rateCalculatorPage.clickReset();

    // Step 9: Verify fields are reset to their initial state (usually '0' or default month 'm06')
    await expect(rateCalculatorPage.getPreviousMeterReadValue()).resolves.toBe('0');
    await expect(rateCalculatorPage.getCurrentMeterReadValue()).resolves.toBe('0');
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0');
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
    // The default month after reset (currentValue in catalog) is 'm06' (June).
    await expect(rateCalculatorPage.getMonthDropdownValue()).resolves.toBe('m06');
  });
});
