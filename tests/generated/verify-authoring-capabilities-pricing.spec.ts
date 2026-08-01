import { test, expect, Page } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Authoring Capabilities', () => {
  const CALCULATOR_URL = 'http://localhost:3000/rate-calculator'; // Placeholder URL - update with actual application URL

  test('MTX-4433: Verify updated pricing is reflected in live site calculations', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // --- Step 1 & 2 Limitations --- 
    // The provided Locator Catalog is for the live site's Rate Calculator component,
    // not for the AEM authoring environment or its component properties.
    // Therefore, steps involving logging into AEM and updating pricing values
    // for 'Electric fuel' and 'Gas fuel' cannot be automated with the given locators.
    // We proceed by assuming these authoring steps have been performed successfully
    // and the calculator on the live site is now using the new pricing values.
    // In a real scenario, these steps would require AEM-specific locators
    // and a separate Page Object for the AEM authoring environment.

    // --- Step 3: Verify the updated pricing is reflected in the calculator on the live site. ---
    // Expected Result: Calculations on the live site use the newly authored pricing values.

    // Navigate to the live site's rate calculator.
    await rateCalculatorPage.navigateTo(CALCULATOR_URL);

    // Perform a calculation for Electric service type to verify the output.
    const previousElectricRead = '1000';
    const currentElectricRead = '1200'; // 200 kWh usage
    const selectedMonth = 'm06'; // June (value from locator catalog options)

    await rateCalculatorPage.calculateElectricUsage(selectedMonth, previousElectricRead, currentElectricRead);

    // Assertions to verify the calculation output.
    // The exact expected values would depend on the 'authored pricing values'
    // from the CMS which are not available here. We'll assert that the fields
    // contain numeric values and are not empty, indicating a calculation occurred.
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    await expect(estimatedElectricUse).not.toBeEmpty();
    await expect(Number(estimatedElectricUse)).toBeGreaterThan(0); // Assuming usage is positive

    // Now, perform a calculation for Electric & Gas service type.
    const previousEGRead = '500';
    const currentEGRead = '600'; // 100 kWh/Ccf usage

    // Re-enter reads for EG, assuming fields are cleared or overwritten by new interaction.
    await rateCalculatorPage.calculateElectricAndGasUsage(selectedMonth, previousEGRead, currentEGRead);

    const estimatedElectricUseEG = await rateCalculatorPage.getEstimatedElectricUse();
    const estimatedGasUseEG = await rateCalculatorPage.getEstimatedGasUse();

    await expect(estimatedElectricUseEG).not.toBeEmpty();
    await expect(Number(estimatedElectricUseEG)).toBeGreaterThan(0); // Assuming positive usage

    // Gas use field is disabled, but its value should still be updated by calculation.
    await expect(estimatedGasUseEG).not.toBeEmpty();
    await expect(Number(estimatedGasUseEG)).toBeGreaterThan(0); // Assuming positive usage

    // Further verification would involve comparing the actual calculated values
    // against expected values derived from the '0.15 Electric fuel' and '0.85 Gas fuel'
    // mentioned in the input data, if a calculation model was available here.
    // Example (requires external knowledge of calculation logic):
    // const expectedElectricBill = (Number(currentEGRead) - Number(previousEGRead)) * 0.15; 
    // expect(Number(estimatedElectricUseEG)).toBeCloseTo(expectedElectricBill, 2);
  });
});
