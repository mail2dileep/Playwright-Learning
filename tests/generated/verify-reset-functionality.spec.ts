import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../../pages/RateCalculatorPage";

test.describe("Rate Calculator Functionality", () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming a base URL is configured in playwright.config.ts
    // Or navigate directly if no base URL is set for this context.
    await rateCalculatorPage.navigateTo("/rate-calculator"); // Replace with actual path if different
  });

  test("MTX-4433: Verify Reset Functionality", async () => {
    // Step 1: Enter values in the meter read fields and click Calculate.
    // Input Data: Electric: 300, Gas: 50 (Interpreted as resulting estimated values)
    await test.step("Enter meter reads, select EG service, and calculate", async () => {
      await rateCalculatorPage.selectMonth('m06'); // Select June
      await rateCalculatorPage.enterPreviousMeterRead("100");
      await rateCalculatorPage.enterCurrentMeterRead("400");
      await rateCalculatorPage.selectElectricAndGasService(); // To enable Gas calculation
      await rateCalculatorPage.clickCalculate();

      // Expected Result: Calculation result is displayed.
      // Assuming previous=100, current=400 results in electric=300 and gas=50 for this scenario.
      await expect(rateCalculatorPage.estimatedElectricUseInput).toHaveValue("300");
      await expect(rateCalculatorPage.estimatedGasUseInput).toHaveValue("50");
      await expect(rateCalculatorPage.estimatedElectricUseInput).toBeEnabled();
      await expect(rateCalculatorPage.estimatedGasUseInput).toBeEnabled(); // Should be enabled after EG selection
    });

    // Step 2: Click the Reset button.
    await test.step("Click the Reset button", async () => {
      await rateCalculatorPage.clickReset();

      // Expected Result: All input fields are cleared and the result display is removed or reset to zero.
      await expect(rateCalculatorPage.getPreviousMeterReadValue()).resolves.toBe("0");
      await expect(rateCalculatorPage.getCurrentMeterReadValue()).resolves.toBe("0");
      await expect(rateCalculatorPage.getEstimatedElectricUseValue()).resolves.toBe("0");
      await expect(rateCalculatorPage.getEstimatedGasUseValue()).resolves.toBe("0");

      // Verify month dropdown resets to default (June in this case, based on catalog currentValue)
      await expect(rateCalculatorPage.monthDropdown).toHaveValue("m06");
    });
  });
});
