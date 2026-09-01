import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  const BASE_URL = 'http://example.com/rate-calculator'; // Replace with actual application URL

  test('should calculate electric usage correctly with Electric service type', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await rateCalculatorPage.navigate(BASE_URL);
    await rateCalculatorPage.selectBillingMonth('m07'); // Select July
    await rateCalculatorPage.enterPreviousRead('1000');
    await rateCalculatorPage.enterCurrentRead('1500');
    await rateCalculatorPage.selectServiceType('electric');
    await rateCalculatorPage.clickCalculate();

    // Assertions
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('500');
    // Gas use should remain 0 as it's disabled and not selected
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
  });

  test('should reset the form fields', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await rateCalculatorPage.navigate(BASE_URL);
    await rateCalculatorPage.selectBillingMonth('m08'); // Select August
    await rateCalculatorPage.enterPreviousRead('200');
    await rateCalculatorPage.enterCurrentRead('400');
    await rateCalculatorPage.selectServiceType('electricAndGas');
    await rateCalculatorPage.clickCalculate();

    // Verify fields are filled before reset
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.not.toBe('0');

    await rateCalculatorPage.clickReset();

    // Assertions after reset
    await expect(rateCalculatorPage.previousReadInput).toHaveValue('0');
    await expect(rateCalculatorPage.currentReadInput).toHaveValue('0');
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0');
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
  });
});