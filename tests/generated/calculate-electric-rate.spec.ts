import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator - Electric Service Verification', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming the application is hosted at a base URL configured in playwright.config.ts
    // And '/calculator' is the relative path to the rate calculator page.
    await page.goto('/calculator'); 
  });

  test('should accurately calculate estimated electric use for simple meter reads', async () => {
    // Step 1: Select 'July' from the Month dropdown.
    await rateCalculatorPage.selectBillingMonth('m07');

    // Step 2: Enter '1000' as the Previous Meter Read.
    await rateCalculatorPage.enterPreviousMeterRead('1000');

    // Step 3: Enter '1500' as the Current Meter Read.
    await rateCalculatorPage.enterCurrentMeterRead('1500');

    // Step 4: Select 'Electric' service type.
    await rateCalculatorPage.selectElectricServiceType();

    // Step 5: Click the 'Calculate' button.
    await rateCalculatorPage.clickCalculateButton();

    // Step 6: Verify the 'Estimated Electric use (kWh)' result.
    // Expected: Current Read (1500) - Previous Read (1000) = 500 kWh
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('500');
  });

  test('should accurately calculate estimated electric use when selecting a different month', async () => {
    // Step 1: Select 'September' from the Month dropdown.
    await rateCalculatorPage.selectBillingMonth('m09');

    // Step 2: Enter '500' as the Previous Meter Read.
    await rateCalculatorPage.enterPreviousMeterRead('500');

    // Step 3: Enter '750' as the Current Meter Read.
    await rateCalculatorPage.enterCurrentMeterRead('750');

    // Step 4: Ensure 'Electric' service type is selected (it's often default).
    await rateCalculatorPage.selectElectricServiceType();

    // Step 5: Click the 'Calculate' button.
    await rateCalculatorPage.clickCalculateButton();

    // Step 6: Verify the 'Estimated Electric use (kWh)' result.
    // Expected: Current Read (750) - Previous Read (500) = 250 kWh
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('250');
  });
});