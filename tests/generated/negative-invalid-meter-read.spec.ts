import { test, expect, Page } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary

test.describe('Negative Test: Invalid Input in Meter Read Fields', () => {

  const BASE_URL = 'https://www.example.com/rate-calculator'; // Placeholder for the actual application URL

  test('should handle non-numeric input in the previous meter read field gracefully', async ({ page }) => {
    // Navigate to the rate calculator page
    await page.goto(BASE_URL);

    // Instantiate the Page Object
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Enter alphabetic characters into the 'Enter Previous Read:' field
    await rateCalculatorPage.enterPreviousMeterRead('ABC');

    // Step 2: Click 'Calculate' with invalid data
    await rateCalculatorPage.clickCalculateButton();

    // Expected Result: No calculation is performed and an error message is displayed to the user.
    // Since no locator for an error message is provided, we assert that the estimated electric use remains '0'.
    const estimatedUseAfterCalculation = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedUseAfterCalculation).toBe('0');
    // TODO: If a locator for an error message becomes available, add an assertion here, e.g.:
    // await expect(rateCalculatorPage.errorMessageLocator).toBeVisible();
    // await expect(rateCalculatorPage.errorMessageLocator).toHaveText('Please enter a valid numeric value.');
  });
});
