import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary

test.describe('Rate Calculator Functionality', () => {
  test('Verify Reset Functionality clears inputs and results', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // TODO: Navigate to the Rate Calculator page URL
    // For example: await page.goto('https://your-app.com/rate-calculator');
    await page.goto('about:blank'); // Placeholder if no URL provided

    // Step 1: Enter values in the meter read fields and click Calculate.
    // Input Data: Electric: 300, Gas: 50
    // Based on the fields, "Enter Previous Read:" and "Enter Current Read:",
    // we'll assume these are the meter readings for a combined electric/gas service.
    // Selecting 'electric-gas' enables the gas calculations.
    await rateCalculatorPage.selectServiceType('electric-gas');
    await rateCalculatorPage.enterMeterReads('50', '300'); // Previous: 50, Current: 300
    await rateCalculatorPage.clickCalculate();

    // Expected Result: Calculation result is displayed.
    // Check that estimated electric and gas use are not zero.
    expect(await rateCalculatorPage.getEstimatedElectricUse()).not.toBe('0');
    expect(await rateCalculatorPage.getEstimatedElectricUse()).not.toBe('');
    expect(await rateCalculatorPage.getEstimatedGasUse()).not.toBe('0');
    expect(await rateCalculatorPage.getEstimatedGasUse()).not.toBe('');

    // Step 2: Click the Reset button.
    // Input Data: Click 'Reset'
    await rateCalculatorPage.clickReset();

    // Expected Result: All input fields are cleared and the displayed price result is removed or reset to zero.
    expect(await rateCalculatorPage.isPreviousReadCleared()).toBe(true);
    expect(await rateCalculatorPage.isCurrentReadCleared()).toBe(true);
    expect(await rateCalculatorPage.isEstimatedElectricUseCleared()).toBe(true);
    expect(await rateCalculatorPage.isEstimatedGasUseCleared()).toBe(true);
  });
});
