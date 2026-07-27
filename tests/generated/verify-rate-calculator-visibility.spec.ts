import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path based on your framework structure

test.describe('Rate Calculator Page Verification', () => {
  test('should display the rate calculator section correctly', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Navigate to the CPS Energy website page containing the rate calculator.
    const url = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';
    await rateCalculatorPage.navigateTo(url);

    // Expected Result: The rate calculator section is displayed correctly on the page.
    // We assert the visibility of a key, prominent element within the calculator section
    // to confirm the section itself is displayed.
    await expect(rateCalculatorPage.getRateCalculatorSectionIndicator()).toBeVisible();
  });
});