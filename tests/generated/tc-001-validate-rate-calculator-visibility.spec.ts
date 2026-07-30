import { test, expect } from '@playwright/test';
import { EnergyCostCalculatorPage } from '../../pages/EnergyCostCalculatorPage';

test.describe('Energy Cost Calculator Page', () => {
  const CALCULATOR_PAGE_URL = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test('TC_001 - Validate Rate Calculator Visibility', async ({ page }) => {
    const calculatorPage = new EnergyCostCalculatorPage(page);

    // Step 1: Navigate to the Energy Cost Calculator page.
    await test.step('Navigate to the Energy Cost Calculator page', async () => {
      await calculatorPage.navigateTo(CALCULATOR_PAGE_URL);
    });

    // Expected Result: The Rate Calculator section is displayed correctly on the page.
    // We verify the visibility of a key element (Calculate button) within the section.
    await test.step('Verify Rate Calculator section is displayed', async () => {
      await expect(calculatorPage.getCalculateButtonLocator()).toBeVisible();
      // Optionally, verify a disabled element is present but disabled
      await expect(calculatorPage.getGasUseInputFieldLocator()).toBeVisible();
      await expect(calculatorPage.getGasUseInputFieldLocator()).toBeDisabled();
    });
  });
});
