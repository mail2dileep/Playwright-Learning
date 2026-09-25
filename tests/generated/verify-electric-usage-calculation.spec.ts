import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../pages/RateCalculatorPage";

test.describe("Rate Calculator Functionality", () => {
  const BASE_URL = "http://localhost:3000/rate-calculator"; // Assuming a base URL for the application

  test("should calculate electric usage correctly for 'Electric Only' service", async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step("Navigate to the Rate Calculator page", async () => {
      await rateCalculatorPage.navigateTo(BASE_URL);
    });

    await test.step("Select 'Electric Only' service type", async () => {
      await rateCalculatorPage.selectServiceType('Electric');
      await expect(rateCalculatorPage.isElectricServiceSelected()).resolves.toBeTruthy();
      await expect(rateCalculatorPage.isEstimatedGasUseDisabled()).resolves.toBeTruthy();
      await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
    });

    await test.step("Select 'October' from the month dropdown", async () => {
      await rateCalculatorPage.selectMonth('October');
      // Note: The dropdown value stores 'm10', not 'October'. We assert on the internal value.
      await expect(rateCalculatorPage.getSelectedMonthValue()).resolves.toBe('m10');
    });

    await test.step("Enter previous meter read as '1000'", async () => {
      await rateCalculatorPage.enterPreviousRead('1000');
      await expect(rateCalculatorPage.getPreviousMeterRead()).resolves.toBe('1000');
    });

    await test.step("Enter current meter read as '1500'", async () => {
      await rateCalculatorPage.enterCurrentRead('1500');
      await expect(rateCalculatorPage.getCurrentMeterRead()).resolves.toBe('1500');
    });

    await test.step("Click 'Calculate' button and verify estimated electric use", async () => {
      await rateCalculatorPage.clickCalculateButton();
      await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('500'); // 1500 - 1000 = 500
    });
  });

  test("should reset all fields when 'Reset' button is clicked", async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step("Navigate to the Rate Calculator page and populate fields", async () => {
      await rateCalculatorPage.navigateTo(BASE_URL);
      await rateCalculatorPage.selectServiceType('Electric');
      await rateCalculatorPage.selectMonth('October');
      await rateCalculatorPage.enterPreviousRead('1000');
      await rateCalculatorPage.enterCurrentRead('1500');
      await expect(rateCalculatorPage.getPreviousMeterRead()).resolves.not.toBe('0');
    });

    await test.step("Click the 'Reset' button", async () => {
      await rateCalculatorPage.clickResetButton();
    });

    await test.step("Verify all fields are reset to their default values", async () => {
      // Default values from catalog: month 'm06', previous/current reads '0', consumption '0'
      await expect(rateCalculatorPage.getSelectedMonthValue()).resolves.toBe('m06'); // June
      await expect(rateCalculatorPage.getPreviousMeterRead()).resolves.toBe('0');
      await expect(rateCalculatorPage.getCurrentMeterRead()).resolves.toBe('0');
      await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0');
      await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
      // For radio buttons, the default selected might be 'e' or 'eg' depending on app logic. Assuming 'e' for initial state based on gas being disabled.
      // Since the initial state is 'e' (electric only) and gas is disabled, and the test selects 'electric', we expect it to stay 'electric' or reset to default 'electric'.
      // The catalog says currentValue 'E' for '#e'. So checking if it's checked seems reasonable.
      await expect(rateCalculatorPage.isElectricServiceSelected()).resolves.toBeTruthy();
    });
  });
});
