import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage';

test.describe('Rate Calculator Component Visibility', () => {
  const PAGE_URL = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test('should verify the visibility of the Rate Calculator component', async ({ page }) => {
    // Step 1: Navigate to the CPS Energy website page containing the rate calculator.
    const rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigate(PAGE_URL);

    // Expected Result: The page loads successfully.
    await expect(page).toHaveURL(/energy-cost-calculator/);
    console.log(`Successfully navigated to: ${PAGE_URL}`);

    // Step 2: Scroll to the Rate Calculator section.
    // Playwright's `toBeVisible()` handles scrolling into view if needed. No explicit scroll action is typically required.

    // Expected Result: The Rate Calculator component is visible and rendered correctly.
    // We use the Page Object method to get the locator for the Rate Calculator container
    // and then assert its visibility in the test layer.
    await expect(rateCalculatorPage.getRateCalculatorSectionLocator(), 'Rate Calculator component should be visible').toBeVisible();
    console.log('Rate Calculator component is visible.');
  });
});