import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../pages/RateCalculatorPage";

test.describe("Verify Rate Calculator Functionality", () => {
  let rateCalculatorPage: RateCalculatorPage;

  // Assuming a base URL is configured in playwright.config.ts
  const pageUrl = "/rate-calculator"; // Replace with actual URL if needed

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigateTo(pageUrl);
  });

  test("TC_004 - Verify Reset Functionality", async ({ page }) => {
    // Step 1: Enter values in the meter read fields and perform a calculation.
    // Input Data: Electric: 300, Gas: 50
    // (Interpreting 'Electric: 300' as a difference leading to 300 kWh usage)
    await rateCalculatorPage.selectElectricAndGasService(); // To enable potential gas calculations
    await rateCalculatorPage.enterPreviousRead('100');
    await rateCalculatorPage.enterCurrentRead('400');
    await rateCalculatorPage.clickCalculateButton();

    // Expected Result for Step 1: Calculation result is displayed.
    // Verify electric consumption is 300 (400 - 100)
    await expect(rateCalculatorPage.estimatedElectricUseInput).toHaveValue('300');
    // Verify gas consumption, it should remain '0' as per catalog and no direct input provided
    await expect(rateCalculatorPage.estimatedGasUseInput).toHaveValue('0');

    // Step 2: Click the 'Reset' button.
    await rateCalculatorPage.clickResetButton();

    // Expected Result for Step 2: All input fields are cleared, dropdown returns to default,
    // and the result display is removed.
    await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('0');
    await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('0');
    await expect(rateCalculatorPage.getSelectedMonthValue()).resolves.toBe('m06'); // Default value 'm06' for June
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0');
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
  });
});