import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary based on project structure

test.describe('Rate Calculator Component Verification', () => {

  const PAGE_URL = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test('should display the Rate Calculator component successfully', async ({ page }) => {
    // Instantiate Page Object
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Navigate to the CPS Energy website page containing the rate calculator.
    await rateCalculatorPage.navigate(PAGE_URL);

    // Expected Result 1: The page loads successfully.
    await expect(page).toHaveURL(PAGE_URL);
    console.log(`Navigated to: ${PAGE_URL}`); // Enterprise framework pattern for logging

    // Step 2: Scroll to the Rate Calculator section.
    // Playwright automatically scrolls elements into view when interacting with them or asserting visibility.
    // We will assert on a key element within the Rate Calculator component to confirm its presence.

    // Expected Result 2: The Rate Calculator component is visible and rendered correctly.
    // Assert that a prominent element within the calculator (e.g., the 'Month' dropdown) is visible.
    const monthSelectLocator = rateCalculatorPage.getMonthSelectLocator();
    await expect(monthSelectLocator).toBeVisible();
    console.log('Rate Calculator component (Month dropdown) is visible.'); // Enterprise framework pattern for logging
  });
});
