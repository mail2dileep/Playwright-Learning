import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed based on your project structure

test.describe('Rate Calculator Functionality', () => {
  const BASE_URL = 'https://example.com/rate-calculator'; // Placeholder URL - configure in Playwright config or replace with actual URL

  test('should successfully calculate estimated electric bill', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigate(BASE_URL);

    // Step 1: Select month (July)
    await rateCalculatorPage.selectBillingMonth('m07');
    await expect(rateCalculatorPage.verifySelectedMonth('July')).resolves.toBe('July');

    // Step 2: Enter previous and current meter reads
    const previousRead = '1000';
    const currentRead = '1200';
    await rateCalculatorPage.enterPreviousRead(previousRead);
    await rateCalculatorPage.enterCurrentRead(currentRead);
    await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe(previousRead);
    await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe(currentRead);

    // Step 3: Select Electric service type
    await rateCalculatorPage.selectServiceType('electric');
    await expect(rateCalculatorPage.isElectricServiceChecked()).resolves.toBe(true);
    await expect(rateCalculatorPage.isElectricGasServiceChecked()).resolves.toBe(false);

    // Step 4: Click Calculate and verify results
    await rateCalculatorPage.clickCalculate();

    // Assuming a calculation is performed: 1200 - 1000 = 200 kWh
    const expectedElectricUse = '200';
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe(expectedElectricUse);

    // Verify gas use is disabled and shows 0 for electric-only service
    await expect(rateCalculatorPage.isEstimatedGasUseDisabled()).resolves.toBe(true);
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
  });

  test('should reset form fields correctly', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigate(BASE_URL);

    // Fill some fields to be reset
    await rateCalculatorPage.selectBillingMonth('m09'); // September
    await rateCalculatorPage.enterPreviousRead('500');
    await rateCalculatorPage.enterCurrentRead('600');
    await rateCalculatorPage.selectServiceType('electric-gas');

    // Verify fields are filled as expected before reset
    await expect(rateCalculatorPage.verifySelectedMonth('September')).resolves.toBe('September');
    await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('500');
    await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('600');
    await expect(rateCalculatorPage.isElectricGasServiceChecked()).resolves.toBe(true);
    await expect(rateCalculatorPage.isEstimatedGasUseDisabled()).resolves.toBe(false); // Should be enabled for EG service

    // Click Reset button
    await rateCalculatorPage.clickReset();

    // Verify fields are reset to their default states
    // According to locator catalog, default month is 'm06' (June) and reads are '0'.
    await expect(rateCalculatorPage.verifySelectedMonth('June')).resolves.toBe('June');
    await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('0');
    await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('0');
    // Assuming 'Electric' is the default selected service type after reset
    await expect(rateCalculatorPage.isElectricServiceChecked()).resolves.toBe(true);
    await expect(rateCalculatorPage.isElectricGasServiceChecked()).resolves.toBe(false);
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0');
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
    await expect(rateCalculatorPage.isEstimatedGasUseDisabled()).resolves.toBe(true); // Gas use should be disabled after reset to Electric service
  });

  test('should display disabled gas use field for default/electric service', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigate(BASE_URL);

    // Explicitly select Electric service, or rely on default if page loads this way
    await rateCalculatorPage.selectServiceType('electric');

    // Verify the gas consumption field is disabled and its value is '0'
    await expect(rateCalculatorPage.isEstimatedGasUseDisabled()).resolves.toBe(true);
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
  });

  test('should enable gas use field when Electric & Gas service is selected', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigate(BASE_URL);

    // Select Electric & Gas service
    await rateCalculatorPage.selectServiceType('electric-gas');

    // Verify the gas consumption field is now enabled (no longer disabled)
    await expect(rateCalculatorPage.isEstimatedGasUseDisabled()).resolves.toBe(false);
    // Input value might still be '0' if no gas readings entered, but the field itself should be enabled.
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
  });
});
