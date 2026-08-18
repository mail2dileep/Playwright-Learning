import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Pricing Value Adjustments for Rate Calculator', () => {
  let rateCalculatorPage: RateCalculatorPage;
  // A placeholder URL. In a real enterprise framework, this would come from a config.
  const BASE_URL = 'http://localhost:3000/rate-calculator'; 

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Step 1 Action: Open the Rate Calculator component dialog.
    // Assuming navigation to the component's specific URL fulfils this.
    await rateCalculatorPage.navigateTo(BASE_URL);

    // Step 1 Expected Result: Dialog opens with pricing fields.
    // Verify a key element is visible to confirm the page/dialog is loaded.
    await expect(rateCalculatorPage.page.getByLabel('Month')).toBeVisible();
    await expect(rateCalculatorPage.page.getByLabel('Estimated Electric use (kWh):')).toBeVisible();
  });

  test('MTX-4278 - Verify authoring can adjust electric fuel pricing values and calculate', async () => {
    const electricFuelValue = '0.15';
    const gasFuelValue = '0.08'; // Intended value for 'Gas fuel', but the field is disabled.

    // Step 2 Action: Update the 'Electric fuel' and 'Gas fuel' pricing values.
    // Input Data: 0.15, 0.08

    // Update 'Electric fuel' (mapped to Estimated Electric use (kWh))
    await rateCalculatorPage.enterEstimatedElectricUse(electricFuelValue);

    // Step 2 Expected Result: Values are updated.
    await expect(rateCalculatorPage.getEstimatedElectricUseValue()).toEqual(electricFuelValue);

    // Regarding 'Gas fuel': The 'Estimated Gas use (Ccf)' field is explicitly marked as disabled in the Locator Catalog.
    // According to the rules: "Do not interact with disabled elements unless a prior step explicitly enables them."
    // Since there's no step to enable this field, we cannot fulfill the "Update 'Gas fuel' pricing values" requirement.
    // We will assert its disabled state to confirm this limitation.
    await expect(rateCalculatorPage.page.getByLabel('Estimated Gas use (Ccf):')).toBeDisabled();
    // If the 'Gas fuel' value *could* be updated, the following line would be used:
    // await rateCalculatorPage.enterEstimatedGasUse(gasFuelValue);

    // Step 3 Action: Save the dialog and perform a calculation on the page.
    await rateCalculatorPage.clickCalculate();

    // Step 3 Expected Result: The calculation uses the newly updated pricing values.
    // As per the Locator Catalog, there is no explicit output field to verify the calculation result.
    // We can only confirm that the input field value persists after calculation and that the action
    // completed without error.
    await expect(rateCalculatorPage.getEstimatedElectricUseValue()).toEqual(electricFuelValue);
    // TODO: A dedicated output locator is required to fully verify the calculation result based on new pricing.
    // For example, if there was a `page.getByTestId('total-bill-amount')`, we would assert its text.
  });
});
