import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage';

test.describe('Rate Calculator Utility Bill Scenarios', () => {
  const BASE_URL = 'http://localhost:3000/rate-calculator'; // Placeholder URL for the application under test

  test.beforeEach(async ({ page }) => {
    // Instantiate the Page Object and navigate to the base URL before each test
    const rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigateTo(BASE_URL);
  });

  test('should successfully calculate electric usage when only electric service is selected', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Action: Select billing month
    await rateCalculatorPage.selectBillingMonth('m07'); // Corresponds to 'July'
    // Action: Enter previous and current meter reads
    await rateCalculatorPage.enterPreviousRead('100');
    await rateCalculatorPage.enterCurrentRead('250');
    // Action: Choose 'Electric' service type
    await rateCalculatorPage.chooseServiceType('Electric');
    // Action: Click 'Calculate' button
    await rateCalculatorPage.clickCalculateButton();

    // Assertion: Verify estimated electric use
    await expect(rateCalculatorPage.getEstimatedElectricUseValue()).resolves.toBe('150');
    // Assertion: Verify estimated gas use input remains disabled
    await expect(rateCalculatorPage.isEstimatedGasUseInputEnabled()).resolves.toBeFalsy();
  });

  test('should calculate electric usage and enable gas usage when Electric & Gas service is selected', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Action: Select billing month
    await rateCalculatorPage.selectBillingMonth('m08'); // Corresponds to 'August'
    // Action: Enter previous and current meter reads
    await rateCalculatorPage.enterPreviousRead('200');
    await rateCalculatorPage.enterCurrentRead('400');
    // Action: Choose 'Electric & Gas' service type
    await rateCalculatorPage.chooseServiceType('Electric & Gas');
    // Action: Click 'Calculate' button
    await rateCalculatorPage.clickCalculateButton();

    // Assertion: Verify estimated electric use (assuming calculation logic for electric remains consistent)
    await expect(rateCalculatorPage.getEstimatedElectricUseValue()).resolves.toBe('200');
    // Assertion: Verify estimated gas use input is now enabled
    await expect(rateCalculatorPage.isEstimatedGasUseInputEnabled()).resolves.toBeTruthy();
    // Assertion: Verify estimated gas use value (assuming it defaults to '0' if no specific gas consumption is calculated based on reads)
    await expect(rateCalculatorPage.getEstimatedGasUseValue()).resolves.toBe('0');
  });

  test('should reset all input fields to their default states', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Pre-condition: Fill fields and perform a calculation to set non-default values
    await rateCalculatorPage.selectBillingMonth('m09'); // Corresponds to 'September'
    await rateCalculatorPage.enterPreviousRead('500');
    await rateCalculatorPage.enterCurrentRead('1000');
    await rateCalculatorPage.chooseServiceType('Electric & Gas');
    await rateCalculatorPage.clickCalculateButton();

    // Verify fields are not in their default state before reset
    await expect(rateCalculatorPage.getEstimatedElectricUseValue()).resolves.toBe('500');
    await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('500');

    // Action: Click the 'Reset' button
    await rateCalculatorPage.clickResetButton();

    // Assertion: Verify all relevant input fields are reset to their default values
    await expect(rateCalculatorPage.getEstimatedElectricUseValue()).resolves.toBe('0');
    await expect(rateCalculatorPage.getEstimatedGasUseValue()).resolves.toBe('0');
    // Verify that the previous and current read inputs are reset to '0' as per catalog's currentValue
    await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('0');
    await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('0');
    // Verify that the gas usage input returns to its default disabled state (from catalog)
    await expect(rateCalculatorPage.isEstimatedGasUseInputEnabled()).resolves.toBeFalsy();
  });
});
