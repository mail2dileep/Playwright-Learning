import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;
  const baseUrl = 'http://localhost:3000'; // Placeholder URL, adjust as per environment

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigate(baseUrl + '/calculator'); // Adjust this URL as needed for the application route
    // Assuming initial state after navigation: month 'm06', reads '0', 'E' selected
  });

  test('should calculate estimated electric usage correctly for Electric service', async () => {
    // Step 1: Select a month (e.g., September, value m09)
    await rateCalculatorPage.selectMonth('m09');

    // Step 2: Enter previous meter read
    await rateCalculatorPage.enterPreviousRead('1000');

    // Step 3: Enter current meter read
    await rateCalculatorPage.enterCurrentRead('1500');

    // Step 4: Select Electric service type (explicitly select, though often default)
    await rateCalculatorPage.selectElectricService();

    // Step 5: Click Calculate button
    await rateCalculatorPage.clickCalculate();

    // Step 6: Verify the estimated electric use result
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    await expect(estimatedElectricUse).toBe('500'); // Example: 1500 - 1000 = 500 kWh

    // Verify Gas Use is still disabled and '0' if Electric only service is selected
    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    await expect(estimatedGasUse).toBe('0');
    await expect(await rateCalculatorPage.isEstimatedGasUseEnabled()).toBeFalsy();
  });

  test('should reset all fields to their default state when Reset button is clicked', async () => {
    // Pre-fill some fields to simulate user interaction
    await rateCalculatorPage.selectMonth('m12'); // December
    await rateCalculatorPage.enterPreviousRead('2000');
    await rateCalculatorPage.enterCurrentRead('2100');
    await rateCalculatorPage.selectElectricGasService(); // Select Electric & Gas
    await rateCalculatorPage.clickCalculate(); // Simulate a calculation to populate fields

    // Verify values before reset
    await expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m12');
    await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('2000');
    await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('2100');
    await expect(await rateCalculatorPage.isElectricGasServiceSelected()).toBeTruthy();
    await expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('100'); // 2100-2000

    // Click Reset button
    await rateCalculatorPage.clickReset();

    // Verify fields are reset to their assumed default values based on the Locator Catalog initial state (e.g., 'm06' for Month, '0' for reads)
    await expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06'); // Default month is June (m06)
    await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    await expect(await rateCalculatorPage.isElectricServiceSelected()).toBeTruthy(); // Assuming 'Electric Only' is default service after reset
    await expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
    await expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
    await expect(await rateCalculatorPage.isEstimatedGasUseEnabled()).toBeFalsy();
  });

  test('should enable Estimated Gas use input when Electric and Gas service type is selected', async () => {
    // Initially, based on the locator catalog, 'Estimated Gas use (Ccf):' is disabled
    await expect(await rateCalculatorPage.isEstimatedGasUseEnabled()).toBeFalsy();

    // Select the Electric and Gas service type radio button
    await rateCalculatorPage.selectElectricGasService();

    // Verify that the Estimated Gas use input field is now enabled
    await expect(await rateCalculatorPage.isEstimatedGasUseEnabled()).toBeTruthy();
    await expect(await rateCalculatorPage.isElectricGasServiceSelected()).toBeTruthy();
  });
});
