import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary

test.describe('Rate Calculator Functionality', () => {

  test('MTX-4433: Verify validation for non-numeric meter read inputs', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Assume navigation to the page is handled by a global setup or beforeEach hook
    // For this example, let's assume the page is already at the correct URL or navigate explicitly
    // await page.goto('/rate-calculator'); // Example navigation, if not handled globally

    // Step 1: Enter alphabetic characters into the 'Electric Meter Read' field.
    await rateCalculatorPage.enterPreviousMeterRead('ABC');

    // Action: Click Calculate
    await rateCalculatorPage.clickCalculate();

    // Expected Result: The system displays a validation error or prevents the 'Calculate' action.
    // Given no explicit error locator and the 'Calculate' button is not disabled,
    // we assert that the 'Estimated Electric use' field remains at its default/initial value,
    // indicating the calculation was prevented due to invalid input.
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('0'); // Initial/default value according to catalog
  });
});
