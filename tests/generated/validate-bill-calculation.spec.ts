import { test, expect } from "@playwright/test";
import { BillCalculatorPage } from "../pages/BillCalculatorPage";

test.describe("Bill Calculation Functionality", () => {
  let billCalculatorPage: BillCalculatorPage;

  test.beforeEach(async ({ page }) => {
    billCalculatorPage = new BillCalculatorPage(page);
    // Assume navigation to the calculator page is handled here or in a base test fixture.
    // For this example, we'll assume the page is already loaded to the calculator URL.
    // await page.goto("https://www.example.com/bill-calculator");
  });

  test("MTX-4433: Validate Bill Calculation for Electric and Gas Service", async () => {
    const electricReadValue = '450';
    const gasReadValue = '120';

    // Step 1: Select 'Electric and Gas' from the Service Type dropdown.
    await test.step("Select 'Electric and Gas' service type", async () => {
      await billCalculatorPage.selectServiceTypeElectricAndGas();

      // Expected Result: Both Electric Meter Read and Gas Meter Read fields are enabled.
      await expect(billCalculatorPage.currentElectricReadInputLocator,
        "'Enter Current Read:' field for electric service should be enabled."
      ).toBeEnabled();
      await expect(billCalculatorPage.estimatedGasUseInputLocator,
        "'Estimated Gas use (Ccf):' field should be enabled after selecting EG service."
      ).toBeEnabled();
    });

    // Step 2: Enter valid numeric values in both meter read fields.
    await test.step("Enter electric and gas meter read values", async () => {
      await billCalculatorPage.enterCurrentElectricRead(electricReadValue);
      await billCalculatorPage.enterEstimatedGasUse(gasReadValue);

      // Expected Result: Values are accepted in both fields.
      await expect(billCalculatorPage.currentElectricReadInputLocator,
        `'Enter Current Read:' field should have value '${electricReadValue}'.`
      ).toHaveValue(electricReadValue);
      await expect(billCalculatorPage.estimatedGasUseInputLocator,
        `'Estimated Gas use (Ccf):' field should have value '${gasReadValue}'.`
      ).toHaveValue(gasReadValue);
    });

    // Step 3: Click on the 'Calculate' button.
    await test.step("Click 'Calculate' button", async () => {
      await billCalculatorPage.clickCalculateButton();

      // Expected Result: The combined calculated price for both services is displayed.
      // TODO: Locator for combined calculated price not found in catalog. 
      // As per requirements, if a specific locator for the expected result is not in the catalog,
      // a TODO comment is placed. If a relevant output element were present, 
      // we would assert its visibility or text content (e.g., toContainText('$')).
      // Example: await expect(billCalculatorPage.combinedPriceDisplayLocator).toBeVisible();
      // Example: await expect(billCalculatorPage.combinedPriceDisplayLocator).toHaveText(/\$\d+\.\d{2}/);
    });
  });
});