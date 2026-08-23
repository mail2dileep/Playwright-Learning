import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../../pages/RateCalculatorPage";

test.describe("Rate Calculator Functionality", () => {
  let rateCalculatorPage: RateCalculatorPage;
  const BASE_PATH = "/calculator"; // Assuming a base path for the application's calculator page

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Navigate to the calculator page before each test
    await rateCalculatorPage.navigateTo(BASE_PATH);
  });

  test("should calculate electric usage correctly and disable gas input when 'Electric' service is selected", async () => {
    const month = "m07"; // July
    const previousRead = "1000";
    const currentRead = "1500";

    // Perform the calculation workflow via Page Object method
    await rateCalculatorPage.calculateElectricOnlyUsage(month, previousRead, currentRead);

    // Assertions kept in the test layer
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe("500"); // (Current Read - Previous Read)

    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).toBe("0"); // Should be 0 when only electric selected

    // Verify the gas input is disabled
    expect(await rateCalculatorPage.isEstimatedGasUseInputDisabled()).toBe(true);
  });

  test("should enable gas usage input when 'Electric and Gas' service is selected", async () => {
    const month = "m08"; // August
    const previousRead = "2000";
    const currentRead = "2100";

    // Select Electric and Gas service
    await rateCalculatorPage.calculateElectricAndGasUsage(month, previousRead, currentRead);

    // Verify the gas input is now enabled
    expect(await rateCalculatorPage.isEstimatedGasUseInputDisabled()).toBe(false);

    // Perform some basic assertion for electric usage as well
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe("100");
  });

  test("should reset form fields to default values when the reset button is clicked", async () => {
    // Fill some values using Page Object methods
    await rateCalculatorPage.selectServiceTypeElectric(); // Ensure a radio is selected first
    await rateCalculatorPage.enterPreviousRead("123");
    await rateCalculatorPage.enterCurrentRead("456");
    await rateCalculatorPage.selectMonth("m10"); // October

    // Click the reset button via Page Object method
    await rateCalculatorPage.clickReset();

    // Verify fields are reset to their initial/default values
    // Based on Locator Catalog, previousRead and currentRead default to '0'.
    // Month dropdown defaults to 'm06' (June) as per currentValue in locator.
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe("0");
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe("0");
    // For input fields, inputValue() is reliable to get the current value
    expect(await rateCalculatorPage['previousReadInput'].inputValue()).toBe("0");
    expect(await rateCalculatorPage['currentReadInput'].inputValue()).toBe("0");
    // For select, selectOption returns the value, but to verify current selection, inputValue() or value attribute is typically used.
    // Playwright's toHaveValue() is good for this.
    await expect(rateCalculatorPage['monthDropdown']).toHaveValue("m06");
  });
});
