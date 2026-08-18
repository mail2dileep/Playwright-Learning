import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as per framework structure

test.describe('Energy Cost Calculator Page Tests', () => {
  let rateCalculatorPage: RateCalculatorPage;
  const energyCostCalculatorUrl = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigate(energyCostCalculatorUrl);
  });

  test('MTX-4278: Verify visibility of Rate Calculator component', async () => {
    // Step 1: Navigate to the Energy Cost Calculator page. (Handled in beforeEach hook)
    // Expected Result: Page loads successfully. (Implicitly verified by Playwright's navigation and subsequent element checks)
    
    // Step 2: Scroll to the Rate Calculator section.
    // Expected Result: Rate Calculator component is visible to the user.
    // We verify the visibility of a key element within the calculator component.
    await expect(rateCalculatorPage.getMonthSelectLocator()).toBeVisible();
  });
});