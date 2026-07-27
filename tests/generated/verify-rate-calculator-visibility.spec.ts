import { test, expect } from '@playwright/test';
import { EnergyCostCalculatorPage } from '../pages/EnergyCostCalculatorPage';

test.describe('Energy Cost Calculator Functionality', () => {
  const ENERGY_CALCULATOR_URL = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test('MTX-4433: should display the rate calculator section', async ({ page }) => {
    const calculatorPage = new EnergyCostCalculatorPage(page);

    // Step 1: Navigate to the Energy Cost Calculator page.
    await calculatorPage.navigate(ENERGY_CALCULATOR_URL);

    // Expected Result: The rate calculator section is displayed on the page.
    // We assert the visibility of a key input field within the calculator as an indicator
    // that the entire section is displayed.
    await expect(calculatorPage.isEstimatedElectricUseFieldVisible()).toBeVisible();
  });
});
