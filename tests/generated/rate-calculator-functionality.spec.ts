import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    // Navigate to the application page. Placeholder URL.
    await page.goto('https://www.example.com/rate-calculator');
    rateCalculatorPage = new RateCalculatorPage(page);
  });

  test('should calculate electric bill for a given month and meter reads', async () => {
    const previousRead = '1000';
    const currentRead = '1100';
    const expectedElectricUse = '100'; // Assuming a simple calculation (1100-1000)

    // Action: Select a specific month
    await rateCalculatorPage.selectMonth('m07'); // July

    // Action: Enter a previous meter read
    await rateCalculatorPage.enterPreviousRead(previousRead);

    // Action: Enter a current meter read
    await rateCalculatorPage.enterCurrentRead(currentRead);

    // Action: Select Electric service type
    await rateCalculatorPage.selectServiceType('Electric');

    // Action: Click the Calculate button
    await rateCalculatorPage.clickCalculateButton();

    // Assertion: Verify the estimated electric use
    const actualElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(actualElectricUse).toBe(expectedElectricUse);

    // Assertion: Verify estimated gas use input is disabled and has default value
    expect(await rateCalculatorPage.isEstimatedGasUseInputDisabled()).toBe(true);
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
  });

  test('should calculate electric and gas bill for a given month and meter reads', async () => {
    const previousRead = '500';
    const currentRead = '700';
    const expectedElectricUse = '200'; // Assuming (700-500)
    const expectedGasUse = '50'; // Placeholder, actual value would come from business logic or test data

    // Action: Select a specific month
    await rateCalculatorPage.selectMonth('m08'); // August

    // Action: Enter a previous meter read
    await rateCalculatorPage.enterPreviousRead(previousRead);

    // Action: Enter a current meter read
    await rateCalculatorPage.enterCurrentRead(currentRead);

    // Action: Select Electric and Gas service type
    await rateCalculatorPage.selectServiceType('ElectricAndGas');

    // Action: Click the Calculate button
    await rateCalculatorPage.clickCalculateButton();

    // Assertion: Verify the estimated electric use
    const actualElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(actualElectricUse).toBe(expectedElectricUse);

    // Assertion: Verify estimated gas use input is enabled and has a value
    expect(await rateCalculatorPage.isEstimatedGasUseInputDisabled()).toBe(false);
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe(expectedGasUse);
  });

  test('should reset all fields when reset button is clicked', async () => {
    // Populate some fields first
    await rateCalculatorPage.selectMonth('m10'); // October
    await rateCalculatorPage.enterPreviousRead('2000');
    await rateCalculatorPage.enterCurrentRead('2500');
    await rateCalculatorPage.selectServiceType('ElectricAndGas');

    // Click reset
    await rateCalculatorPage.clickResetButton();

    // Verify fields are reset to initial default values
    // Assuming 'm06' (June) is the default selected month based on 'currentValue' in catalog.
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06');
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    // Assuming the default service type after reset is 'Electric', which disables gas input.
    expect(await rateCalculatorPage.isEstimatedGasUseInputDisabled()).toBe(true);
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
  });
});
