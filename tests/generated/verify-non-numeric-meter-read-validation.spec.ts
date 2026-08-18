import { test, expect } from '@playwright/test';
import { MeterReadCalculatorPage } from '../../pages/MeterReadCalculatorPage';

test.describe('Meter Read Calculator - Non-Numeric Input Validation', () => {
  let meterReadPage: MeterReadCalculatorPage;

  test.beforeEach(async ({ page }) => {
    meterReadPage = new MeterReadCalculatorPage(page);
    // Navigate to the calculator page. Adjust the URL as per your application's actual path.
    await meterReadPage.navigateTo('/calculator'); // Placeholder URL path
  });

  test('should prevent calculation when non-numeric current meter read is entered', async () => {
    // Step 1: Enter non-numeric characters in the Electric Meter Read field.
    // Input Data: ABC
    await meterReadPage.enterCurrentMeterRead('ABC');

    // Step 2: Click 'Calculate'.
    await meterReadPage.clickCalculateButton();

    // Expected Result: Calculation is not performed; error message is visible.
    // As there is no explicit error message locator provided, we assert that the
    // 'Estimated Electric use (kWh)' field retains its default/initial value '0',
    // indicating that the calculation did not proceed or resulted in an invalid state.
    const estimatedElectricUseValue = await meterReadPage.getEstimatedElectricUseValue();
    expect(estimatedElectricUseValue).toBe('0');

    // If there were an explicit error message element, we would add an assertion like:
    // await expect(meterReadPage.errorMessageElement).toBeVisible();
  });
});