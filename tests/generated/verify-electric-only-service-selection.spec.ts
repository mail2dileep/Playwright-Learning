import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../pages/RateCalculatorPage";

test.describe("Service Type Selection Functionality", () => {
  // In a real scenario, you might have a beforeEach hook to navigate to the page
  // For this example, we assume the page is already loaded or navigation is handled elsewhere.
  // test.beforeEach(async ({ page }) => {
  //   await page.goto("/your-rate-calculator-url");
  // });

  test("Verify selecting 'Electric only' updates input fields correctly (MTX-4433)", async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Select 'Electric only' from the Service Type options.
    await test.step("Select 'Electric only' service type", async () => {
      await rateCalculatorPage.selectServiceTypeElectricOnly();
    });

    // Expected Result: The 'Electric Meter Read' field is enabled/visible and 'Gas Meter Read' is disabled or hidden.
    await test.step("Verify electric-related fields are enabled and gas-related field is disabled", async () => {
      // 'Enter Previous Read:' field should be enabled
      await expect(rateCalculatorPage.getPreviousReadInputField(),
        "'Enter Previous Read:' input field should be enabled for Electric only service."
      ).toBeEnabled();

      // 'Enter Current Read:' field should be enabled
      await expect(rateCalculatorPage.getCurrentReadInputField(),
        "'Enter Current Read:' input field should be enabled for Electric only service."
      ).toBeEnabled();

      // 'Estimated Electric use (kWh):' field should be enabled
      await expect(rateCalculatorPage.getEstimatedElectricUseInputField(),
        "'Estimated Electric use (kWh):' input field should be enabled for Electric only service."
      ).toBeEnabled();

      // 'Estimated Gas use (Ccf):' field should be disabled
      await expect(rateCalculatorPage.getEstimatedGasUseInputField(),
        "'Estimated Gas use (Ccf):' input field should be disabled for Electric only service."
      ).toBeDisabled();
    });
  });
});
