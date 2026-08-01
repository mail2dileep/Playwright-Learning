import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Validate Authoring - Pricing Adjustment', () => {
  const AEM_AUTHOR_URL = '/rate-calculator-component-authoring'; // Placeholder for AEM component authoring URL

  test('should allow authors to adjust electric fuel pricing and acknowledge gas fuel state', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Open the Rate Calculator component in AEM authoring mode.
    // Input Data: AEM Author Environment
    await rateCalculatorPage.navigateTo(AEM_AUTHOR_URL);

    // Expected Result: Component properties/dialog is accessible.
    await expect(rateCalculatorPage.isElectricFuelPricingInputVisible()).resolves.toBe(true);
    await expect(rateCalculatorPage.isCalculateButtonVisible()).resolves.toBe(true);
    console.log('Step 1: Rate Calculator component is accessible.');

    // Step 2: Modify the 'Electric fuel' and 'Gas fuel' pricing values and save.
    // Input Data: Electric fuel: 0.15, Gas fuel: 0.08
    const electricFuelValue = '0.15';
    const gasFuelValue = '0.08'; // This value is intended for a disabled field, per catalog.

    await rateCalculatorPage.enterElectricFuelPricing(electricFuelValue);
    console.log(`Step 2: Entered Electric fuel pricing: ${electricFuelValue}`);

    // As per the locator catalog, 'Estimated Gas use (Ccf):' is disabled. 
    // We cannot interact with a disabled field as an input.
    // We will assert its disabled state to reflect the UI's current capability.
    await expect(rateCalculatorPage.isGasFuelPricingInputDisabled()).resolves.toBe(true);
    console.log('Step 2: Confirmed Gas fuel pricing input is disabled as per application state.');
    // If the test objective requires modifying the Gas fuel, this highlights a discrepancy 
    // between requirements and application UI capabilities/locator catalog data.

    await rateCalculatorPage.clickCalculate(); // Simulate saving changes
    console.log('Step 2: Clicked Calculate to save changes.');

    // Expected Result: Changes are saved successfully and reflected in the frontend calculation logic.
    // Verifying the input field itself reflects the change. 
    // Full 'reflection in frontend calculation logic' would require an output field locator, which is not provided.
    await expect(rateCalculatorPage.getElectricFuelPricingValue()).resolves.toBe(electricFuelValue);
    console.log('Step 2: Verified Electric fuel pricing change is reflected in the input field.');
  });
});