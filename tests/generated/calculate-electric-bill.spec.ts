import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import

test.describe('Rate Calculator Functionality', () => {
  const baseURL = 'http://example.com/calculator'; // Placeholder URL

  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
  });

  test('should successfully calculate electric bill and reset', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Input calculation details for Electric service
    const month = 'm07'; // July
    const previousRead = '1000';
    const currentRead = '1500';
    const expectedElectricUse = '500'; // Assuming (1500 - 1000)

    await rateCalculatorPage.calculateElectricBill(month, previousRead, currentRead);

    // Step 2: Verify the estimated electric use
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe(expectedElectricUse);

    // Step 3: Verify estimated gas use is disabled and '0' as Electric only was selected
    await expect(rateCalculatorPage.isEstimatedGasUseInputDisabled()).resolves.toBe(true);
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');

    // Step 4: Click reset button
    await rateCalculatorPage.clickReset();

    // Step 5: Verify fields are reset to initial values
    await expect(rateCalculatorPage.getPreviousMeterReadValue()).resolves.toBe('0');
    await expect(rateCalculatorPage.getCurrentMeterReadValue()).resolves.toBe('0');
    await expect(rateCalculatorPage.getSelectedBillingMonthValue()).resolves.toBe('m06'); // Initial value from catalog
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0');
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
  });

  test('should successfully calculate electric and gas bill', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Input calculation details for Electric & Gas service
    const month = 'm08'; // August
    const previousRead = '2000';
    const currentRead = '2200';
    const expectedElectricUse = '200'; // Assuming (2200 - 2000)

    await rateCalculatorPage.calculateElectricGasBill(month, previousRead, currentRead);

    // Verify the estimated electric use
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe(expectedElectricUse);

    // Verify estimated gas use is still disabled and '0' based on catalog metadata
    await expect(rateCalculatorPage.isEstimatedGasUseInputDisabled()).resolves.toBe(true);
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
  });
}