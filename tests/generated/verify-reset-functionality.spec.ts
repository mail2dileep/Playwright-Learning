import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed

test.describe('Rate Calculator Functionality', () => {
  let calculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new RateCalculatorPage(page);
    // In a real scenario, navigation to the page would occur here.
    // For this exercise, we assume the page is already navigated to
    // or handled by a global setup. Example:
    // await page.goto('https://example.com/rate-calculator');
  });

  test('Verify Reset Functionality', async ({ page }) => {
    // Step 1: Enter values and perform a calculation.
    const electricInput = '300';
    const gasInput = '150';
    const previousReadInput = '1000';
    const currentReadInput = '1300';
    const selectedMonth = 'm07'; // July

    // Populate all fields to ensure a comprehensive reset test
    await calculatorPage.selectMonth(selectedMonth);
    await calculatorPage.enterPreviousRead(previousReadInput);
    await calculatorPage.enterCurrentRead(currentReadInput);
    await calculatorPage.enterValuesAndCalculate(electricInput, gasInput);

    // Assert values are correctly entered (pre-reset state)
    await expect(calculatorPage.getEstimatedElectricUseValue()).resolves.toBe(electricInput);
    await expect(calculatorPage.getEstimatedGasUseValue()).resolves.toBe(gasInput);
    await expect(calculatorPage.getPreviousReadValue()).resolves.toBe(previousReadInput);
    await expect(calculatorPage.getCurrentReadValue()).resolves.toBe(currentReadInput);
    await expect(calculatorPage.getSelectedMonthValue()).resolves.toBe(selectedMonth);
    await expect(calculatorPage.isElectricGasServiceSelected()).resolves.toBe(true); // Should be true after enterValuesAndCalculate

    // Step 2: Click the 'Reset' button.
    await calculatorPage.clickReset();

    // Expected Result for Step 2: All input fields are cleared and the result is removed.
    // Assert that all fields have reverted to their default initial values.
    await expect(calculatorPage.getEstimatedElectricUseValue()).resolves.toBe('0');
    await expect(calculatorPage.getEstimatedGasUseValue()).resolves.toBe('0');
    await expect(calculatorPage.getPreviousReadValue()).resolves.toBe('0');
    await expect(calculatorPage.getCurrentReadValue()).resolves.toBe('0');
    await expect(calculatorPage.getSelectedMonthValue()).resolves.toBe('m06'); // Default month is 'm06' (June)
    await expect(calculatorPage.isElectricServiceSelected()).resolves.toBe(true); // Default service type should be 'Electric'
    await expect(calculatorPage.isElectricGasServiceSelected()).resolves.toBe(false);
  });
});