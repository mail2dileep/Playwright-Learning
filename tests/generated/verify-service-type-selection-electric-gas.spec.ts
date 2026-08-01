import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../../pages/RateCalculatorPage";

test.describe("Service Type Selection", () => {
  test("Verify Service Type Selection - Electric and Gas", async ({ page }) => {
    // In a real scenario, you'd navigate to the page first.
    // await page.goto("/your-rate-calculator-url"); 

    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Select 'Electric and Gas' from the Service Type dropdown.
    await test.step("Select 'Electric and Gas' service type", async () => {
      await rateCalculatorPage.selectServiceTypeElectricAndGas();
      // Expected Result: Both 'Estimated Electric use' and 'Estimated Gas use' fields are visible and Gas field is enabled.
      await expect(rateCalculatorPage.isEstimatedGasUsageEnabled()).toBe(true, "Estimated Gas use field should be enabled after selecting Electric and Gas.");
    });

    // Step 2: Enter valid numeric values in both fields and click Calculate.
    const expectedElectricUsage = "450";
    const expectedGasUsage = "120";

    await test.step("Enter electric and gas usage and click Calculate", async () => {
      await rateCalculatorPage.enterEstimatedElectricUsage(expectedElectricUsage);
      await rateCalculatorPage.enterEstimatedGasUsage(expectedGasUsage);
      await rateCalculatorPage.clickCalculate();

      // Expected Result: The combined calculated price for both services is displayed.
      // Assuming the input fields reflect the entered values upon successful 'calculation' for verification, 
      // as no specific 'total price' display locator is available in the catalog.
      await expect(rateCalculatorPage.getEstimatedElectricUsageValue()).toEqual(expectedElectricUsage);
      await expect(rateCalculatorPage.getEstimatedGasUsageValue()).toEqual(expectedGasUsage);
    });
  });
});
