import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigateTo();
  });

  test('MTX-4433: Verify Reset Functionality clears inputs and results', async () => {
    // Step 1: Enter values into the meter read fields and click 'Calculate'.
    // Input Data: Electric: 100, Gas: 50
    // For 50 units of electric usage, Previous Read = 100, Current Read = 150
    await rateCalculatorPage.enterPreviousRead('100');
    await rateCalculatorPage.enterCurrentRead('150');
    await rateCalculatorPage.selectElectricGasService(); // Select EG to potentially enable gas calculation if the UI logic allows.
    await rateCalculatorPage.clickCalculate();

    // Expected Result for Step 1: Price is displayed.
    // This implies that Estimated Electric use (kWh) should be non-zero.
    const electricUseAfterCalc = await rateCalculatorPage.getEstimatedElectricUse();
    expect(electricUseAfterCalc).toBe('50'); // 150 - 100 = 50

    // Optional: Verify gas usage if it's expected to calculate despite initial disabled state.
    // Based on locator catalog, Estimated Gas use is disabled. Assuming it stays '0' or remains disabled.
    const gasUseAfterCalc = await rateCalculatorPage.getEstimatedGasUse();
    expect(gasUseAfterCalc).toBe('0'); // As it's disabled and no direct gas input, expect 0.
    expect(await rateCalculatorPage.isEstimatedGasUseEnabled()).toBeFalsy();


    // Step 2: Click on the 'Reset' button.
    // Input Data: Click Reset
    await rateCalculatorPage.clickReset();

    // Expected Result for Step 2: All input fields are cleared and the calculated price display is removed.
    // Check if input fields are cleared (reset to '0' or default)
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');

    // Check if calculated results are cleared (reset to '0')
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');

    // Check if dropdown reverts to default (m06 for June)
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06');

    // The state of radio buttons after reset is not explicitly defined in requirements.
    // Assuming they might revert to an unselected state or a default if one exists.
    // No specific assertion added for radio buttons without clearer instructions on their default state.
  });
});
