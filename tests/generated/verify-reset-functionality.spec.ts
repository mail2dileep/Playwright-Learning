import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import

test.describe('MTX-4433: Rate Calculator Reset Functionality', () => {
  let calculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    // Navigate to the Rate Calculator page.
    // Assuming the base URL is configured in playwright.config.ts
    // For a specific URL, use: await page.goto('/your-rate-calculator-path');
    await page.goto('/'); // Adjust this to the actual path if needed
    calculatorPage = new RateCalculatorPage(page);
  });

  test('should clear inputs and results on reset', async () => {
    // Step 1: Enter values and perform a calculation.
    // Input Data: Electric: 300, Gas: 50
    // Based on available inputs, we'll set previous=0, current=300 for electric,
    // and select Electric & Gas service. Gas usage field is disabled.
    await calculatorPage.selectServiceType('ElectricAndGas');
    await calculatorPage.enterPreviousMeterRead('0');
    await calculatorPage.enterCurrentMeterRead('300');
    await calculatorPage.performCalculation();

    // Expected Result: Calculation result is displayed.
    // Verify electric usage is 300 (0 to 300 read)
    await expect(calculatorPage.getEstimatedElectricUseValue()).toBe('300');
    // Verify gas usage (likely 0 as it's disabled and no direct input)
    await expect(calculatorPage.getEstimatedGasUseValue()).toBe('0');
    // Verify inputs are not cleared yet
    await expect(calculatorPage.getPreviousMeterReadValue()).toBe('0');
    await expect(calculatorPage.getCurrentMeterReadValue()).toBe('300');

    // Step 2: Click the Reset button.
    // Input Data: Click 'Reset'
    await calculatorPage.clickReset();

    // Expected Result: All input fields are cleared and the result display is removed or reset to zero.
    // Verify input fields are reset to their default '0' values
    await expect(calculatorPage.getPreviousMeterReadValue()).toBe('0');
    await expect(calculatorPage.getCurrentMeterReadValue()).toBe('0');

    // Verify estimated usage displays are reset to '0'
    await expect(calculatorPage.getEstimatedElectricUseValue()).toBe('0');
    await expect(calculatorPage.getEstimatedGasUseValue()).toBe('0');
  });
});