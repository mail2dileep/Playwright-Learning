import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary for your project structure

test.describe('Rate Calculator Functionality', () => {
  const BASE_URL = 'http://localhost:3000/rate-calculator'; // Placeholder URL, update as needed

  test.beforeEach(async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigateTo(BASE_URL);
  });

  test('should calculate electric usage correctly for electric service', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Select 'March' as the billing month.
    await rateCalculatorPage.selectBillingMonth('m03'); // Using value 'm03' for March
    await expect(await rateCalculatorPage.getSelectedMonth()).toBe('m03');

    // Step 2: Enter a previous meter read.
    await rateCalculatorPage.enterPreviousRead('1000');
    await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('1000');

    // Step 3: Enter a current meter read.
    await rateCalculatorPage.enterCurrentRead('1500');
    await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('1500');

    // Step 4: Select 'Electric' service type.
    await rateCalculatorPage.selectElectricService();
    await expect(await rateCalculatorPage.isElectricServiceSelected()).toBeTruthy();
    // Gas use is expected to be disabled for Electric only service type
    await expect(await rateCalculatorPage.isEstimatedGasUseEnabled()).toBeFalsy();

    // Step 5: Click the 'Calculate' button.
    await rateCalculatorPage.clickCalculate();
    // Expected: Estimated Electric use is (1500 - 1000) = 500
    await expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('500');
  });

  test('should reset form and calculate usage correctly for electric & gas service', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Populate fields first to ensure reset functionality is tested
    await rateCalculatorPage.selectBillingMonth('m12'); // December
    await rateCalculatorPage.enterPreviousRead('500');
    await rateCalculatorPage.enterCurrentRead('700');
    await rateCalculatorPage.selectElectricService();
    await rateCalculatorPage.clickCalculate();

    // Step 6: Click the 'Reset' button.
    await rateCalculatorPage.clickReset();
    // Expected: All input fields are reset to their default values (e.g., '0' for reads, 'm06' for month, 'E' selected).
    await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    await expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
    await expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
    await expect(await rateCalculatorPage.getSelectedMonth()).toBe('m06'); // Default month is June (m06)
    await expect(await rateCalculatorPage.isElectricServiceSelected()).toBeTruthy(); // Default is Electric (E)

    // Step 7: Select 'October' as the billing month.
    await rateCalculatorPage.selectBillingMonth('m10'); // Using value 'm10' for October
    await expect(await rateCalculatorPage.getSelectedMonth()).toBe('m10');

    // Step 8: Enter a previous meter read.
    await rateCalculatorPage.enterPreviousRead('2000');
    await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('2000');

    // Step 9: Enter a current meter read.
    await rateCalculatorPage.enterCurrentRead('3000');
    await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('3000');

    // Step 10: Select 'Electric & Gas' service type.
    await rateCalculatorPage.selectElectricGasService();
    await expect(await rateCalculatorPage.isElectricGasServiceSelected()).toBeTruthy();
    // Gas use is expected to be enabled for Electric & Gas service type
    await expect(await rateCalculatorPage.isEstimatedGasUseEnabled()).toBeTruthy();

    // Step 11: Click the 'Calculate' button.
    await rateCalculatorPage.clickCalculate();
    // Expected: Estimated Electric use is (3000 - 2000) = 1000
    // Assuming Estimated Gas use also updates to a non-zero value, e.g., '100'
    await expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('1000');
    await expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('100'); // Placeholder value
  });
});