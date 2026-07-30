import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Service Type Selection Validation', () => {

  test('Verify that selecting "Electric only" displays the appropriate input fields', async ({ page }) => {
    // Instantiate Page Object
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Navigate to the calculator page (assuming a base URL is configured in playwright.config.ts)
    await page.goto('/calculator');

    // Step 1: Select 'Electric only' from the Service Type dropdown.
    await rateCalculatorPage.selectServiceTypeElectricOnly();

    // Expected Result: The 'Electric Meter Read' field is visible
    // Using 'Enter Previous Read:' as a representative for 'Electric Meter Read' field.
    expect(await rateCalculatorPage.isPreviousElectricReadFieldVisible(), 'Previous Electric Read field should be visible').toBe(true);

    // Expected Result: and the 'Gas Meter Read' field is hidden or disabled.
    // Check if the 'Estimated Gas use (Ccf)' field is visible.
    expect(await rateCalculatorPage.isEstimatedGasUseFieldVisible(), 'Estimated Gas use field should not be visible').toBe(false);
    // Check if the 'Estimated Gas use (Ccf)' field is disabled.
    // Based on the locator catalog, this field is initially disabled. Selecting "Electric only" should keep it disabled.
    expect(await rateCalculatorPage.isEstimatedGasUseFieldDisabled(), 'Estimated Gas use field should be disabled').toBe(true);
  });
});