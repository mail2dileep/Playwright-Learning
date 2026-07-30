import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage'; // Relative import

test.describe('Verify Service Type Selection', () => {

  test('should enable Electric and Gas fields when "Electric and Gas" service type is selected', async ({ page }) => {
    // Assuming navigation to the calculator page is handled by a beforeEach or base URL configuration.
    // For this example, we'll assume the page is already at the calculator URL.
    // Example: await page.goto('/calculator');

    const calculatorPage = new CalculatorPage(page);

    // Step 1: Select 'Electric and Gas' from the Service Type options.
    await test.step('Select "Electric and Gas" service type', async () => {
      await calculatorPage.selectServiceTypeElectricAndGas();
    });

    // Expected Result: Both 'Electric Meter Read' and 'Gas Meter Read' fields are enabled and visible.
    // 'Electric Meter Read' maps to 'Enter Previous Read:' field
    // 'Gas Meter Read' maps to 'Estimated Gas use (Ccf):' field (which was initially disabled)
    await test.step('Verify "Enter Previous Read:" and "Estimated Gas use (Ccf):" fields are enabled and visible', async () => {
      await expect(calculatorPage.enterPreviousReadField).toBeEnabled();
      await expect(calculatorPage.enterPreviousReadField).toBeVisible();

      await expect(calculatorPage.estimatedGasUseField).toBeEnabled();
      await expect(calculatorPage.estimatedGasUseField).toBeVisible();
    });
  });
});
