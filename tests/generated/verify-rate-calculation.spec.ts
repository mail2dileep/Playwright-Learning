import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../pages/RateCalculatorPage";

test.describe('Rate Calculator Functionality', () => {
  let calculatorPage: RateCalculatorPage;

  // Before each test, instantiate the Page Object and navigate to the page
  test.beforeEach(async ({ page }) => {
    calculatorPage = new RateCalculatorPage(page);
    // Assuming a base URL is configured in playwright.config.ts,
    // so we only need the path. Otherwise, provide the full URL.
    await calculatorPage.navigate('/calculator'); // Example path
  });

  test('should accurately calculate electric usage and verify gas field state', async () => {
    // Step 1: Select a month (e.g., December)
    await calculatorPage.selectMonth('m12');

    // Step 2: Enter previous meter read
    await calculatorPage.enterPreviousRead('1000');

    // Step 3: Enter current meter read
    await calculatorPage.enterCurrentRead('1500');

    // Step 4: Select Electric service type
    await calculatorPage.selectServiceType('Electric');

    // Step 5: Click Calculate
    await calculatorPage.clickCalculate();

    // Step 6: Verify the estimated electric use (Expected: 1500 - 1000 = 500)
    const estimatedElectricUse = await calculatorPage.getEstimatedElectricUseValue();
    expect(estimatedElectricUse).toBe('500'); // Assuming the calculator subtracts current from previous

    // Step 7: Verify that the Estimated Gas use (Ccf) field is disabled
    const isGasDisabled = await calculatorPage.isEstimatedGasUseDisabled();
    expect(isGasDisabled).toBe(true);

    // Step 8: Click Reset and verify previous read returns to default (0)
    await calculatorPage.clickReset();
    const previousReadAfterReset = await calculatorPage.getPreviousReadValue();
    expect(previousReadAfterReset).toBe('0');
  });

  test('should enable gas field when Electric and Gas service is selected', async () => {
    // Select Electric and Gas service type
    await calculatorPage.selectServiceType('ElectricAndGas');

    // Verify that the Estimated Gas use (Ccf) field is now enabled
    const isGasDisabled = await calculatorPage.isEstimatedGasUseDisabled();
    expect(isGasDisabled).toBe(false); // Expect it to be enabled
  });
});
