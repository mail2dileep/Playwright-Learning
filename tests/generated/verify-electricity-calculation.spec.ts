import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // In a real enterprise scenario, the base URL would be configured in playwright.config.ts
    // and navigation might be handled by a dedicated navigation service or directly here.
    // For this example, we assume navigating to a placeholder URL.
    await rateCalculatorPage.navigate('/rate-calculator'); 
  });

  test('should correctly calculate electricity usage for electricity-only service', async () => {
    // Test Input Data
    const monthValue = 'm10'; // Corresponds to October as per catalog options
    const previousRead = '1000';
    const currentRead = '1500';
    const expectedElectricUse = '500'; // 1500 - 1000 = 500
    const expectedGasUse = '0'; // Since 'Electricity Only' is selected

    // Step 1: Select a month
    await rateCalculatorPage.selectMonth(monthValue);

    // Step 2: Enter previous meter read
    await rateCalculatorPage.enterPreviousRead(previousRead);

    // Step 3: Enter current meter read
    await rateCalculatorPage.enterCurrentRead(currentRead);

    // Step 4: Select Electricity only service type
    await rateCalculatorPage.selectElectricityService();

    // Step 5: Click the Calculate button
    await rateCalculatorPage.clickCalculateButton();

    // Step 6: Verify the estimated electric usage
    const actualElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(actualElectricUse).toBe(expectedElectricUse, 'Expected electric use to be calculated correctly.');

    // Step 7: Verify the estimated gas usage (should be 0 and disabled)
    const actualGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(actualGasUse).toBe(expectedGasUse, 'Expected gas use to be 0 for electricity-only service.');
    expect(await rateCalculatorPage.isGasUseInputDisabled()).toBe(true, 'Expected gas use input to be disabled.');
  });
});