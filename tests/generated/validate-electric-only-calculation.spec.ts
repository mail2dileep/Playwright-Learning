import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage';

test.describe('MTX-4506: Validate Electric Only Calculation', () => {
  test('Verify that the calculator correctly computes the price for Electric only service', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming a navigation to the calculator page is handled externally or within a test.beforeEach
    // await page.goto('/rate-calculator'); // Example navigation

    // Step 1: Select 'Electric only' from the Service Type dropdown
    await test.step("Select 'Electric only' from the Service Type options", async () => {
      await rateCalculatorPage.selectElectricOnlyServiceType();

      // Expected Result: Electric Meter Read field is enabled; Gas Meter Read field is disabled or hidden.
      await expect(await rateCalculatorPage.isElectricUsageFieldEnabled(), 'Electric Meter Read field should be enabled').toBe(true);
      await expect(await rateCalculatorPage.isGasUsageFieldDisabledOrHidden(), 'Gas Meter Read field should be disabled or hidden').toBe(true);
    });

    // Step 2: Enter a valid numeric value in the Electric Meter Read field
    const electricUsageValue = '500';
    await test.step(`Enter '${electricUsageValue}' in the Electric Meter Read field`, async () => {
      await rateCalculatorPage.setElectricUsage(electricUsageValue);

      // Expected Result: Value is accepted in the field.
      await expect(await rateCalculatorPage.getElectricUsageValue(), `Electric Meter Read field should show '${electricUsageValue}'`).toEqual(electricUsageValue);
    });

    // Step 3: Click on the 'Calculate' button
    await test.step("Click on the 'Calculate' button", async () => {
      // This action will issue a warning in the console because the locator is missing.
      await rateCalculatorPage.clickCalculateButton();

      // Expected Result: The calculated price is displayed to the user.
      // This assertion will also issue a warning and return an empty string due to missing locator.
      const calculatedPrice = await rateCalculatorPage.getCalculatedPrice();
      // TODO: Implement actual assertion when 'Calculated Price' display locator is available.
      await expect(calculatedPrice.length).toBeGreaterThan(0); // Expecting some text, currently will fail as it returns empty
      console.log(`Calculated Price (if available): ${calculatedPrice}`);
    });
  });
});