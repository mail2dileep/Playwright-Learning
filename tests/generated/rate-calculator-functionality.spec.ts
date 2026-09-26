import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed

test.describe('Rate Calculator Functionality', () => {

  test.beforeEach(async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigateTo();
    // Ensure the page is loaded and initial state is as expected
    await expect(rateCalculatorPage.isPageLoaded()).resolves.toBeTruthy();
    // Also verify some default values after navigation (if applicable)
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
  });

  test('should successfully calculate electric usage', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Perform calculation for electric service
    await rateCalculatorPage.calculateElectricUsage('m07', '1000', '1100'); // July, Previous: 1000, Current: 1100

    // Assertions
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('100'); // Assuming 1100 - 1000 = 100 kWh
    await expect(rateCalculatorPage.isEstimatedGasUseDisabled()).toBeTruthy(); // Gas should remain disabled as per catalog
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0'); // Expect default/0 value for disabled gas
  });

  test('should successfully calculate electric and gas usage when selected', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Perform calculation for electric and gas service
    await rateCalculatorPage.calculateElectricAndGasUsage('m08', '2000', '2200'); // August, Previous: 2000, Current: 2200

    // Assertions
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('200'); // Assuming 2200 - 2000 = 200 kWh

    // As per the catalog, the gas consumption field is disabled regardless of service type selection.
    // If the application logic enables it, this test would need adjustment.
    await expect(rateCalculatorPage.isEstimatedGasUseDisabled()).toBeTruthy();
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0'); // Still expects 0 for disabled gas field.
  });

  test('should reset the form fields', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Fill some fields first
    await rateCalculatorPage.selectMonth('m03'); // March
    await rateCalculatorPage.enterPreviousRead('500');
    await rateCalculatorPage.enterCurrentRead('600');
    await rateCalculatorPage.selectElectricService();

    // Click reset
    await rateCalculatorPage.clickReset();

    // Assert that fields are reset to initial values (based on catalog currentValue)
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
    expect(await rateCalculatorPage.getSelectedMonth()).toBe('m06'); // Default selected month is June (m06)
  });
});