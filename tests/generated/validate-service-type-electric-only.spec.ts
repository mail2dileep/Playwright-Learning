import { test, expect } from \"@playwright/test\";
import { RateCalculatorPage } from \"../../pages/RateCalculatorPage\";

test.describe("Service Type Selection for Rate Calculator", () => {
  const BASE_URL = "http://localhost:3000/rate-calculator"; // Placeholder URL, adjust as needed

  test("MTX-4278: Validate Service Type Selection - Electric Only", async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Action: Navigate to the page
    await rateCalculatorPage.navigate(BASE_URL);

    // Step 1
    // Action: Select 'Electric only' from the Service Type dropdown.
    // Note: Based on locator catalog, 'Electric only' is a radio button, not a dropdown.
    await rateCalculatorPage.selectElectricOnlyServiceType();

    // Expected Result: Electric Meter Read field is enabled/visible; Gas Meter Read field is disabled or hidden as per design.
    await expect(await rateCalculatorPage.isCurrentMeterReadFieldEnabled()).toBe(true);
    await expect(await rateCalculatorPage.isEstimatedGasUseFieldDisabled()).toBe(true);

    // Step 2
    // Action: Enter a value in the Electric Meter Read field and click Calculate.
    await rateCalculatorPage.enterCurrentMeterRead("500");
    await rateCalculatorPage.clickCalculate();

    // Expected Result: The bill price is calculated and displayed based on electric rates only.
    // Verify that estimated electric use is calculated (e.g., non-zero value)
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUseValue();
    expect(parseFloat(estimatedElectricUse)).toBeGreaterThan(0);

    // Verify that estimated gas use remains disabled and potentially zero.
    await expect(await rateCalculatorPage.isEstimatedGasUseFieldDisabled()).toBe(true);
    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUseValue();
    expect(parseFloat(estimatedGasUse)).toBe(0); // Assuming 0 for disabled/not applicable gas usage when electric only selected
  });
});
