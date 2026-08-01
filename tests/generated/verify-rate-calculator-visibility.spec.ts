import { test, expect } from "@playwright/test";
import { EnergyCostCalculatorPage } from "../../pages/EnergyCostCalculatorPage";

test.describe("Energy Cost Calculator Page Initial State Verification", () => {
  test("Verify Rate Calculator Visibility and Default Fields", async ({ page }) => {
    const energyCostCalculatorPage = new EnergyCostCalculatorPage(page);

    await test.step("Step 1: Navigate to the Energy Cost Calculator page.", async () => {
      await energyCostCalculatorPage.navigateTo();
    });

    await test.step("Expected Result: Rate calculator section is visible with Service Type selection, Meter Read fields, and Calculate/Reset buttons.", async () => {
      // Verify Rate calculator section is visible
      await expect(await energyCostCalculatorPage.isRateCalculatorSectionVisible()).toBe(true);

      // Verify default values for Meter Read fields
      await expect(await energyCostCalculatorPage.getPreviousReadValue()).toBe("0");
      await expect(await energyCostCalculatorPage.getCurrentReadValue()).toBe("0");

      // Verify default value for estimated electric use
      await expect(await energyCostCalculatorPage.getEstimatedElectricUseValue()).toBe("0");

      // Verify estimated gas use field is disabled and its default value
      await expect(await energyCostCalculatorPage.getEstimatedGasUseValue()).toBe("0");
      await expect(await energyCostCalculatorPage.isEstimatedGasUseFieldDisabled()).toBe(true);

      // Verify default selected month (currentValue for gMonth1 is m06 - June)
      await expect(await energyCostCalculatorPage.getSelectedMonthValue()).toBe("m06");

      // Verify default service type (assuming 'Electric' is default, 'E' is currentValue for #e)
      await expect(await energyCostCalculatorPage.isElectricServiceTypeSelected()).toBe(true);
      await expect(await energyCostCalculatorPage.isElectricAndGasServiceTypeSelected()).toBe(false);

      // Verify Calculate and Reset buttons are visible
      await expect(await energyCostCalculatorPage.isCalculateButtonVisible()).toBe(true);
      await expect(await energyCostCalculatorPage.isResetButtonVisible()).toBe(true);
    });
  });
});