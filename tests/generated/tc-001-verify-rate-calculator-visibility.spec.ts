import { test, expect } from '@playwright/test';
import { EnergyCostCalculatorPage } from '../../pages/EnergyCostCalculatorPage';

test.describe('Energy Cost Calculator Module', () => {
  test('TC_001_Verify_Rate_Calculator_Visibility: Verify that the rate calculator section is visible on the page', async ({ page }) => {
    const energyCostCalculatorPage = new EnergyCostCalculatorPage(page);

    // Step 1: Navigate to the Energy Cost Calculator URL.
    // Input Data: https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html
    // Expected Result: The page loads successfully.
    await energyCostCalculatorPage.navigate('https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html');
    // Implicitly, a successful navigation indicates the page loaded. Further actions confirm content.

    // Step 2: Observe the page for the Rate Calculator section.
    // Expected Result: The Rate Calculator section is clearly visible to the user.
    await expect(energyCostCalculatorPage.isRateCalculatorSectionVisible()).toBeVisible();
  });
});