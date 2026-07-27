import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../pages/RateCalculatorPage";

test.describe("TC_002 - Validate Calculation for Electric Only Service", () => {
  test('Verify that the calculator correctly computes the price for Electric only service type', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Assume navigation to the page is handled by a global setup or a before hook
    // For this example, let's assume the page is already at the calculator URL.
    // await page.goto("/your-calculator-url"); 

    // Step 1: Select 'Electric only' from the Service Type dropdown.
    await test.step("Select 'Electric only' from the Service Type", async () => {
      await rateCalculatorPage.selectServiceTypeElectricOnly();
      // Expected Result: The Gas Meter Read field is disabled or hidden; Electric Meter Read field is active.
      await expect(rateCalculatorPage.estimatedGasUseInput).toBeDisabled();
      await expect(rateCalculatorPage.estimatedElectricUseInput).toBeEnabled();
    });

    // Step 2: Enter a valid numeric value in the Electric Meter Read field.
    await test.step("Enter 500 in the Electric Meter Read field", async () => {
      await rateCalculatorPage.enterCurrentRead('500');
      // Expected Result: Value is accepted in the field.
      await expect(rateCalculatorPage.currentReadInput).toHaveValue('500');
    });

    // Step 3: Click on the 'Calculate' button.
    await test.step("Click the 'Calculate' button", async () => {
      await rateCalculatorPage.clickCalculate();
      // Expected Result: The calculated price is displayed based on the configured Electric fuel rates.
      // Assuming 'Estimated Electric use (kWh)' field reflects the calculated value.
      const estimatedUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(estimatedUse).not.toBe('0');
      expect(Number(estimatedUse)).toBeGreaterThan(0);
    });
  });
});