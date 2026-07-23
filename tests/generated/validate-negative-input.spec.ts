import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('MTX-4506: Rate Calculator - Validate Negative Input Handling', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Navigate to the Rate Calculator page if not already there.
    // In an enterprise framework, this URL would typically be configured via playwright.config.ts
    // or a custom test fixture.
    // Example: await page.goto('/your-app/rate-calculator'); 
  });

  test('Validate negative value in Previous Meter Read prevents calculation', async ({ page }) => {
    // Step 1: Enter a negative value in the Electric Meter Read field
    // Assuming 'Electric Meter Read field' refers to 'Enter Previous Read:'
    await rateCalculatorPage.enterPreviousMeterRead('-100');
    await rateCalculatorPage.enterCurrentMeterRead('50'); // Provide a valid current read for context
    await rateCalculatorPage.clickCalculate();

    // Expected Result: System displays a validation error or prevents calculation.
    // As no specific error message locator is provided, we assert that the
    // 'Estimated Electric use (kWh)' remains at its default or a value indicating calculation prevention.
    // The catalog shows 'currentValue: "0"' for this field, implying 0 is the default/invalid state.
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    await expect(estimatedElectricUse).toBe('0');
  });

  test('Validate non-numeric characters in Meter Read fields prevent calculation', async ({ page }) => {
    // Step 2: Enter non-numeric characters in the meter read fields
    // Test for 'Enter Previous Read:'
    await rateCalculatorPage.enterPreviousMeterRead('abc');
    await rateCalculatorPage.enterCurrentMeterRead('100'); // Provide a valid current read for context
    await rateCalculatorPage.clickCalculate();

    // Expected Result: System prevents non-numeric input or displays an error message.
    // Assert that 'Estimated Electric use (kWh)' remains at its default value '0'.
    const estimatedElectricUsePrevious = await rateCalculatorPage.getEstimatedElectricUse();
    await expect(estimatedElectricUsePrevious).toBe('0');
    await rateCalculatorPage.clickReset(); // Reset for the next input test

    // Test for 'Enter Current Read:'
    await rateCalculatorPage.enterPreviousMeterRead('50'); // Provide a valid previous read for context
    await rateCalculatorPage.enterCurrentMeterRead('xyz');
    await rateCalculatorPage.clickCalculate();

    // Assert that 'Estimated Electric use (kWh)' remains at its default value '0'.
    const estimatedElectricUseCurrent = await rateCalculatorPage.getEstimatedElectricUse();
    await expect(estimatedElectricUseCurrent).toBe('0');
  });
});