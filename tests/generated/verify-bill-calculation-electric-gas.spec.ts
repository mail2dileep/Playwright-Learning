import { test, expect } from "@playwright/test";
import { BillCalculatorPage } from "../pages/BillCalculatorPage";

test.describe('Bill Calculation Functionality', () => {
  test('Verify Bill Calculation for Electric and Gas', async ({ page }) => {
    // Assuming the test starts on the calculator page, navigate if necessary
    // await page.goto('/calculator'); // Example navigation

    const billCalculatorPage = new BillCalculatorPage(page);

    // Step 1: Select 'Electric and Gas' service type.
    await test.step("Select 'Electric and Gas' service type", async () => {
      await billCalculatorPage.selectServiceType('Electric and Gas');

      // Expected Result: Input fields for both Electric and Gas are available.
      // For Electric, check visibility of previous and current read fields.
      await expect(billCalculatorPage.getPreviousElectricReadField()).toBeVisible();
      await expect(billCalculatorPage.getCurrentElectricReadField()).toBeVisible();
      
      // For Gas, the catalog only provides 'Estimated Gas use (Ccf):' which is an output field and disabled.
      // We will assert its visibility as it should be part of the 'available' fields for display.
      await expect(billCalculatorPage.getEstimatedGasUseField()).toBeVisible();
      // Note: The 'Estimated Gas use (Ccf):' field is disabled per locator catalog,
      // so we cannot assert .toBeEnabled() for it.
    });

    // Step 2: Enter valid numeric values in 'Electric Meter Read' and 'Gas Meter Read' fields.
    await test.step("Enter valid numeric values in meter read fields", async () => {
      // Enter values for Electric Meter Read fields.
      await billCalculatorPage.enterElectricMeterReads('1200', '1700');

      // TODO: Locator for 'Gas Meter Read' input field not found in catalog. Cannot enter value for Gas.
      // The catalog only provides 'Estimated Gas use (Ccf):' which is a disabled output field, not an input.

      // Expected Result: Values are accepted in the input fields.
      await expect(billCalculatorPage.getPreviousElectricReadField()).toHaveValue('1200');
      await expect(billCalculatorPage.getCurrentElectricReadField()).toHaveValue('1700');
      // Cannot assert for Gas Meter Read input value due to missing locator.
    });

    // Step 3: Click on the 'Calculate' button.
    await test.step("Click on the 'Calculate' button", async () => {
      await billCalculatorPage.clickCalculateButton();

      // Expected Result: The calculated price is displayed to the user.
      // Assert that the estimated use fields display a calculated value (i.e., not the default '0').
      await expect(billCalculatorPage.getEstimatedElectricUseField()).not.toHaveValue('0');
      await expect(billCalculatorPage.getEstimatedGasUseField()).not.toHaveValue('0');
    });
  });
});
