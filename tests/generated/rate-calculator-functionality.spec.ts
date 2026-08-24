import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming the rate calculator is accessible at the root or a specific path
    // Replace with actual URL if known
    await page.goto('/rate-calculator');
  });

  test('should calculate estimated electric use correctly for electric service', async () => {
    // Step 1: Select a month (e.g., February - value m02)
    await rateCalculatorPage.selectMonth('m02');
    await expect(rateCalculatorPage.getSelectedMonth()).resolves.toBe('m02');

    // Step 2: Enter Previous Read
    await rateCalculatorPage.enterPreviousMeterRead('1000');
    await expect(rateCalculatorPage.getPreviousMeterRead()).resolves.toBe('1000');

    // Step 3: Enter Current Read
    await rateCalculatorPage.enterCurrentMeterRead('1500');
    await expect(rateCalculatorPage.getCurrentMeterRead()).resolves.toBe('1500');

    // Step 4: Select Electric service type
    await rateCalculatorPage.selectServiceType('electric');
    // Direct assertion for radio button state is not exposed via PO, focusing on calculation outcome.

    // Step 5: Click Calculate
    await rateCalculatorPage.clickCalculate();

    // Step 6: Verify Estimated Electric use
    // Assuming a calculation logic: Current - Previous = 1500 - 1000 = 500
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('500');

    // Step 7: Verify Estimated Gas use field is disabled and value is '0' (initial value)
    await expect(rateCalculatorPage.isEstimatedGasUseFieldDisabled()).resolves.toBe(true);
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
  });

  test('should reset all fields to their initial values', async () => {
    // Pre-fill some fields to test reset functionality
    await rateCalculatorPage.selectMonth('m12'); // December
    await rateCalculatorPage.enterPreviousMeterRead('2000');
    await rateCalculatorPage.enterCurrentMeterRead('2500');
    await rateCalculatorPage.selectServiceType('electricAndGas');
    await rateCalculatorPage.clickCalculate(); // To ensure consumption fields are updated

    // Verify fields are not initial before reset
    await expect(rateCalculatorPage.getSelectedMonth()).resolves.toBe('m12');
    await expect(rateCalculatorPage.getPreviousMeterRead()).resolves.toBe('2000');
    await expect(rateCalculatorPage.getCurrentMeterRead()).resolves.toBe('2500');
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('500'); // Assuming calculation

    // Click Reset
    await rateCalculatorPage.clickReset();

    // Verify fields are reset to initial states
    // Initial month value from catalog is 'm06' (June)
    await expect(rateCalculatorPage.getSelectedMonth()).resolves.toBe('m06');
    // Initial read values from catalog are '0'
    await expect(rateCalculatorPage.getPreviousMeterRead()).resolves.toBe('0');
    await expect(rateCalculatorPage.getCurrentMeterRead()).resolves.toBe('0');
    // Estimated consumption should also be reset to '0'
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0');
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
  });
});