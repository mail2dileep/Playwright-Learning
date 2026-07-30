import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; 

test.describe('Rate Calculator - Service Type Selection', () => {
  test('Verify Service Type Selection - Electric and Gas', async ({ page }) => {
    // Pre-condition: Navigate to the Rate Calculator page.
    // In an enterprise framework, this URL would typically be configured in playwright.config.ts
    // or passed via environment variables, and navigation might be handled in a `test.beforeEach`.
    // For this example, we'll assume the page is already loaded or navigate to a placeholder.
    // await page.goto('/your-rate-calculator-path'); 

    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Select 'Electric and Gas' from the Service Type options.
    // This corresponds to interacting with the radio button identified by the Page Object.
    await rateCalculatorPage.selectServiceTypeElectricAndGas();

    // Expected Result: Both 'Electric Meter Read' and 'Gas Meter Read' fields are visible and editable.
    // 'Electric Meter Read' is interpreted as the 'Enter Current Read:' field based on the locator catalog.
    // 'Gas Meter Read' is interpreted as the 'Estimated Gas use (Ccf):' field based on the locator catalog.

    // Assert visibility and editability for the 'Electric Meter Read' field.
    const electricMeterReadField = rateCalculatorPage.getElectricCurrentReadField();
    await expect(electricMeterReadField).toBeVisible();
    await expect(electricMeterReadField).toBeEnabled();

    // Assert visibility and editability for the 'Gas Meter Read' field.
    const gasMeterReadField = rateCalculatorPage.getEstimatedGasUseField();
    await expect(gasMeterReadField).toBeVisible();
    // The locator catalog initially marks 'Estimated Gas use (Ccf):' as disabled: true.
    // This assertion validates that selecting 'Electric and Gas' correctly enables it.
    await expect(gasMeterReadField).toBeEnabled(); 
  });
});
