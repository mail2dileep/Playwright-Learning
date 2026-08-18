import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  const CALCULATOR_PAGE_URL = '/calculator'; // Placeholder URL. Adjust as per actual application route.

  test.beforeEach(async ({ page }) => {
    // Navigate to the calculator page before each test
    await page.goto(CALCULATOR_PAGE_URL);
  });

  test('should clear inputs and results after reset', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Input data for calculation
    const previousReadInput = '1000';
    const currentReadInput = '2000';
    const defaultMonthValue = 'm06'; // Default month from locator catalog

    // Step 1: Enter values and perform a calculation.
    await rateCalculatorPage.performCalculation(previousReadInput, currentReadInput, defaultMonthValue);

    // Expected Result: Calculation result is displayed (i.e., not zero).
    const electricUseValueAfterCalculation = await rateCalculatorPage.getEstimatedElectricUseValue();
    expect(electricUseValueAfterCalculation).not.toBe('0');
    expect(electricUseValueAfterCalculation).not.toBe(''); // Ensure it's not empty

    // Optionally, assert that inputs hold their values before reset
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe(previousReadInput);
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe(currentReadInput);
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe(defaultMonthValue);

    // Step 2: Click the 'Reset' button.
    await rateCalculatorPage.clickReset();

    // Expected Result: All input fields are cleared and the result display is removed.

    // Verify previous read input is reset to '0'
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');

    // Verify current read input is reset to '0'
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');

    // Verify estimated electric use output is reset to '0'
    expect(await rateCalculatorPage.getEstimatedElectricUseValue()).toBe('0');

    // Verify month dropdown is reset to its default value 'm06'
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe(defaultMonthValue);
  });
});
