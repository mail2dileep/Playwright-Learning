import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage';

test.describe('Calculator Reset Functionality', () => {
  let calculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new RateCalculatorPage(page);
    // Assuming the application is hosted at a base URL configured in playwright.config.ts
    // If not, explicitly navigate to the calculator page:
    // await page.goto('/calculator'); // Replace with actual URL if known
  });

  test('should clear all inputs and results when the reset button is clicked', async ({ page }) => {
    // Step 1: Enter values in the calculator and click Calculate.
    // Input Data: Electric: 100, Gas: 50
    // Expected Result: Price is displayed.

    // First, select Electric and Gas service type to enable gas input
    await calculatorPage.selectServiceType('electric-gas');
    await expect(calculatorPage.isEstimatedGasUseDisabled()).toBeFalsy();

    // Fill inputs for calculation
    await calculatorPage.enterPreviousRead('0');
    await calculatorPage.enterCurrentRead('100'); // This implies 100 kWh electric use
    await calculatorPage.enterEstimatedGasUse('50'); // Direct input for gas use

    // Click Calculate
    await calculatorPage.calculateBill();

    // Verify results are displayed (assuming estimated fields show calculated values or are populated)
    // Since there's no explicit 'price display' locator, we assert that input/output fields reflect non-default values.
    await expect(calculatorPage.getPreviousReadValue()).toBe('0');
    await expect(calculatorPage.getCurrentReadValue()).toBe('100');
    await expect(calculatorPage.getEstimatedElectricUseValue()).not.toBe('0');
    await expect(calculatorPage.getEstimatedGasUseValue()).not.toBe('0');
    // Additional check for positive values if expected
    await expect(parseInt(await calculatorPage.getEstimatedElectricUseValue())).toBeGreaterThan(0);
    await expect(parseInt(await calculatorPage.getEstimatedGasUseValue())).toBeGreaterThan(0);

    // Step 2: Click the Reset button.
    // Input Data: Click 'Reset'
    // Expected Result: All input fields are cleared and the calculated price display is removed.
    await calculatorPage.resetCalculator();

    // Verify all input fields are cleared (reverted to default '0' values)
    await expect(calculatorPage.getPreviousReadValue()).toBe('0');
    await expect(calculatorPage.getCurrentReadValue()).toBe('0');
    await expect(calculatorPage.getEstimatedElectricUseValue()).toBe('0');
    await expect(calculatorPage.getEstimatedGasUseValue()).toBe('0');
  });
});