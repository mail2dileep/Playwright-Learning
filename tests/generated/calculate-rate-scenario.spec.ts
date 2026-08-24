import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  const BASE_URL = 'http://localhost:3000/rate-calculator'; // Placeholder URL

  test.beforeEach(async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.goTo(BASE_URL);
  });

  test('should calculate electric usage and reset the form', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Select a billing month (e.g., March)
    await rateCalculatorPage.selectBillingMonth('m03');
    await expect(rateCalculatorPage.getCurrentSelectedMonthValue()).resolves.toBe('m03');

    // Step 2: Enter previous meter read
    const previousRead = '1000';
    await rateCalculatorPage.enterPreviousMeterRead(previousRead);
    await expect(rateCalculatorPage.getPreviousMeterReadValue()).resolves.toBe(previousRead);

    // Step 3: Enter current meter read
    const currentRead = '1500';
    await rateCalculatorPage.enterCurrentMeterRead(currentRead);
    await expect(rateCalculatorPage.getCurrentMeterReadValue()).resolves.toBe(currentRead);

    // Step 4: Select service type 'Electric Only'
    await rateCalculatorPage.selectServiceType('E');
    // Assuming a visual check or a more complex locator for checked state if needed.

    // Step 5: Click Calculate
    await rateCalculatorPage.clickCalculate();

    // Step 6: Verify the estimated electric use
    // For this example, we assume a simple calculation of 500 (1500 - 1000)
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('500');

    // Step 7: Verify estimated gas use remains disabled and '0'
    await expect(rateCalculatorPage.isGasUseFieldDisabled()).resolves.toBe(true);
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');

    // Step 8: Click Reset
    await rateCalculatorPage.clickReset();

    // Step 9: Verify all input fields are reset to initial values
    await expect(rateCalculatorPage.getCurrentSelectedMonthValue()).resolves.toBe('m06'); // Initial default month is June (m06)
    await expect(rateCalculatorPage.getPreviousMeterReadValue()).resolves.toBe('0');
    await expect(rateCalculatorPage.getCurrentMeterReadValue()).resolves.toBe('0');
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0');
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
  });
});
