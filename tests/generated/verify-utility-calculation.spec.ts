import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import

test.describe('Utility Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming a base URL is configured in playwright.config.ts or passed directly.
    // Replace with the actual URL of the application under test.
    await rateCalculatorPage.navigate('https://www.example.com/rate-calculator'); 
  });

  test('should calculate electric usage correctly for specified month and reads', async () => {
    // Step 1: Select a billing month (e.g., July - m07)
    await rateCalculatorPage.selectBillingMonth('m07');

    // Step 2: Enter previous meter read
    await rateCalculatorPage.enterPreviousRead('1000');

    // Step 3: Enter current meter read
    await rateCalculatorPage.enterCurrentRead('1150');

    // Step 4: Select Electric service type
    await rateCalculatorPage.selectServiceTypeElectric();

    // Step 5: Click Calculate
    await rateCalculatorPage.clickCalculate();

    // Expected Result: Estimated Electric use is 150 kWh, Gas use is 0 (disabled)
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('150');

    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).toBe('0'); // Expecting 0 as electric only is selected

    const isGasUseDisabled = await rateCalculatorPage.isEstimatedGasUseInputDisabled();
    expect(isGasUseDisabled).toBeTruthy();
  });

  test('should reset form fields to default values', async () => {
    // First, fill some fields to ensure the reset operation has a visible effect
    await rateCalculatorPage.selectBillingMonth('m08');
    await rateCalculatorPage.enterPreviousRead('2000');
    await rateCalculatorPage.enterCurrentRead('2500');
    await rateCalculatorPage.selectServiceTypeElectricAndGas();

    // Click Reset
    await rateCalculatorPage.clickReset();

    // Verify fields are reset to their default values as per application's behavior
    // (e.g., Month 'm06', reads '0', Estimated usages '0')
    expect(await rateCalculatorPage.getSelectedBillingMonthValue()).toBe('m06');
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
    expect(await rateCalculatorPage.isEstimatedGasUseInputDisabled()).toBeTruthy();
  });
});
