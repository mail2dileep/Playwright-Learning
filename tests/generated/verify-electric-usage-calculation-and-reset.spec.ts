import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../../pages/RateCalculatorPage"; // Adjust path as necessary

test.describe("Rate Calculator Functionality", () => {
  let calculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new RateCalculatorPage(page);
    // Assuming the calculator is accessible at a specific URL or context.
    // For this example, we'll navigate to a placeholder URL.
    // In a real scenario, this would be the actual URL of the application page.
    await page.goto("https://example.com/rate-calculator");
    // Ensure the page elements are ready for interaction, if needed.
    await calculatorPage.monthDropdown.waitFor();
  });

  test("should verify electric usage calculation and reset feature", async () => {
    // Step 1: Set Electric Usage Values
    await test.step("Set electric usage calculation input values", async () => {
      await calculatorPage.selectMonth("m09"); // Select September
      await calculatorPage.enterPreviousRead("100");
      await calculatorPage.enterCurrentRead("200");
      await calculatorPage.selectElectricService();

      // Expected Result: All input fields are set correctly.
      expect(await calculatorPage.getSelectedMonth()).toBe("m09");
      expect(await calculatorPage.getPreviousRead()).toBe("100");
      expect(await calculatorPage.getCurrentRead()).toBe("200");
      expect(await calculatorPage.electricServiceRadio.isChecked()).toBe(true);
    });

    // Step 2: Calculate Usage
    await test.step("Calculate the usage and verify results", async () => {
      await calculatorPage.calculateUsage();

      // Expected Result: Estimated Electric use (kWh) should be '100'.
      // Estimated Gas use (Ccf) should remain '0' and disabled.
      await expect(calculatorPage.getEstimatedElectricUse()).resolves.toBe("100");
      await expect(calculatorPage.getEstimatedGasUse()).resolves.toBe("0");
      await expect(calculatorPage.isEstimatedGasUseDisabled()).resolves.toBe(true);
    });

    // Step 3: Reset Calculator
    await test.step("Reset the calculator and verify fields are cleared", async () => {
      await calculatorPage.resetCalculator();

      // Expected Result: Month should reset to 'June' (m06). Previous Read, Current Read,
      // Estimated Electric use, Estimated Gas use should reset to '0'.
      await expect(calculatorPage.getSelectedMonth()).resolves.toBe("m06"); // Default month
      await expect(calculatorPage.getPreviousRead()).resolves.toBe("0");
      await expect(calculatorPage.getCurrentRead()).resolves.toBe("0");
      await expect(calculatorPage.getEstimatedElectricUse()).resolves.toBe("0");
      await expect(calculatorPage.getEstimatedGasUse()).resolves.toBe("0");
    });
  });
});