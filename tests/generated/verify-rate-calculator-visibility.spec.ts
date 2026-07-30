import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage';

test.describe('Rate Calculator Component Visibility', () => {
  const targetUrl = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test('Should verify the Rate Calculator component is visible on the page', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Navigate to the CPS Energy website page containing the rate calculator.
    await test.step('Navigate to the Rate Calculator page', async () => {
      await rateCalculatorPage.navigateToRateCalculatorPage(targetUrl);
      // Expected Result: The page loads successfully. (Implicitly verified by subsequent actions)
    });

    // Step 2: Scroll to the Rate Calculator section and verify visibility.
    await test.step('Verify the Rate Calculator component is visible', async () => {
      await rateCalculatorPage.verifyRateCalculatorComponentIsVisible();
      // Expected Result: The Rate Calculator component is visible and rendered correctly.
      // Assertions are kept in the test layer to confirm the component's presence.
      // Verifying a primary input element confirms the component's interactive readiness.
      await expect(page.getByLabel('Month')).toBeVisible();
    });
  });
});