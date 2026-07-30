import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed based on your project structure

test.describe('Authoring - Pricing Adjustment Verification', () => {
  // Placeholder URL for the frontend calculator where pricing adjustments are reflected.
  // In a real scenario, this would be a specific URL from your application.
  const frontendCalculatorUrl = 'https://example.com/rate-calculator'; 

  test('should reflect pricing adjustments in frontend calculations', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Log into AEM and navigate to the Rate Calculator component properties.
    // TODO: Automate AEM login and navigation (e.g., using an AEM-specific Page Object).
    // Locators for AEM CMS components are not available in the provided catalog.
    // For this test execution, we assume the authoring changes have already been applied in the CMS prior to this test run.

    // Step 2: Modify the 'Electric fuel' and 'Gas fuel' pricing values and save.
    // Input Data: Electric fuel: 0.15, Gas fuel: 0.08
    // TODO: Automate modification of 'Electric fuel' and 'Gas fuel' pricing values in AEM CMS.
    // Locators for these specific pricing adjustment fields within an AEM CMS context are not available in the provided catalog.
    // We proceed with the assumption that these backend pricing parameters are now effectively set to 0.15 for Electric and 0.08 for Gas
    // and will influence the frontend calculator's output.

    // Navigate to the frontend Rate Calculator to verify the effects of the assumed authoring changes.
    await rateCalculatorPage.navigateTo(frontendCalculatorUrl);

    // --- Scenario 1: Verify Electric-only calculation after assumed pricing adjustment ---
    await test.step('Verify Electric-only calculation reflects adjusted pricing', async () => {
      const previousRead = '100';
      const currentRead = '200';
      const electricUsage = parseInt(currentRead) - parseInt(previousRead); // Calculated usage: 100 kWh
      const electricFuelPrice = 0.15; // From test step input data
      
      // Assuming the 'Estimated Electric use (kWh)' field displays the calculated cost (Usage * Price).
      const expectedElectricResult = (electricUsage * electricFuelPrice).toFixed(2); // Expected: 100 * 0.15 = 15.00

      await rateCalculatorPage.selectMonth('m06'); // Select June
      await rateCalculatorPage.enterPreviousRead(previousRead);
      await rateCalculatorPage.enterCurrentRead(currentRead);
      await rateCalculatorPage.selectElectricServiceType();
      await rateCalculatorPage.clickCalculateButton();

      // Expected Result: Changes are saved successfully and reflected in the frontend calculation logic.
      // Assert that the 'Estimated Electric use (kWh)' field now displays the calculated value reflecting the adjusted pricing.
      await expect(rateCalculatorPage.getEstimatedElectricUseValue()).resolves.toBe(expectedElectricResult);
      
      // For electric-only service, gas consumption should be 0 and its field should remain disabled.
      await expect(rateCalculatorPage.getEstimatedGasUseValue()).resolves.toBe('0');
      await expect(rateCalculatorPage.isEstimatedGasUseFieldEnabled()).resolves.toBeFalsy();
    });

    // --- Scenario 2: Verify Electric and Gas calculation after assumed pricing adjustment ---
    await test.step('Verify Electric and Gas calculation reflects adjusted pricing', async () => {
      // Reset the form for a new calculation scenario
      await rateCalculatorPage.clickResetButton();

      const previousReadEG = '200';
      const currentReadEG = '400';
      const electricUsageEG = parseInt(currentReadEG) - parseInt(previousReadEG); // Calculated usage: 200 kWh
      const gasUsageEG = parseInt(currentReadEG) - parseInt(previousReadEG);     // Assuming gas usage calculation is similar: 200 Ccf
      const electricFuelPriceEG = 0.15; // From test step input data
      const gasFuelPriceEG = 0.08;   // From test step input data
      
      // Assuming 'Estimated Electric use (kWh)' and 'Estimated Gas use (Ccf)' display calculated costs.
      const expectedElectricResultEG = (electricUsageEG * electricFuelPriceEG).toFixed(2); // Expected: 200 * 0.15 = 30.00
      const expectedGasResultEG = (gasUsageEG * gasFuelPriceEG).toFixed(2);       // Expected: 200 * 0.08 = 16.00

      await rateCalculatorPage.selectMonth('m07'); // Select July
      await rateCalculatorPage.enterPreviousRead(previousReadEG);
      await rateCalculatorPage.enterCurrentRead(currentReadEG);
      await rateCalculatorPage.selectElectricAndGasServiceType();
      await rateCalculatorPage.clickCalculateButton();

      // Assertions for both electric and gas consumption reflecting the adjusted pricing.
      await expect(rateCalculatorPage.getEstimatedElectricUseValue()).resolves.toBe(expectedElectricResultEG);
      await expect(rateCalculatorPage.getEstimatedGasUseValue()).resolves.toBe(expectedGasResultEG);
      
      // For electric and gas service, the gas field should now be enabled.
      await expect(rateCalculatorPage.isEstimatedGasUseFieldEnabled()).resolves.toBeTruthy();
    });
  });
});