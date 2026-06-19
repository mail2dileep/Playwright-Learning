import { test, expect } from '@playwright/test';
import { EnergyCostCalculatorPage } from '../../pages/EnergyCostCalculatorPage';

test.describe('Energy Cost Calculator Page Functionality', () => {
  const ENERGY_CALCULATOR_URL = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test('TC_001_Verify_Rate_Calculator_Visibility: Verify that the rate calculator section is visible on page load', async ({ page }) => {
    const calculatorPage = new EnergyCostCalculatorPage(page);

    // Step 1: Navigate to the Energy Cost Calculator URL.
    await test.step('Navigate to the Energy Cost Calculator URL', async () => {
      await calculatorPage.navigateToCalculatorPage(ENERGY_CALCULATOR_URL);
      // Optional: Add a simple page load check if not implicitly covered by visibility assertion
      await expect(page).toHaveURL(ENERGY_CALCULATOR_URL);
    });

    // Step 2: Locate the Rate Calculator section and verify its visibility.
    await test.step('Verify the Rate Calculator section is visible', async () => {
      await expect(await calculatorPage.isRateCalculatorSectionVisible()).toBe(true);
    });
  });
});