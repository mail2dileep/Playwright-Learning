import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage'; // Relative import

test.describe('Energy Calculator Functionality', () => {
  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    // Assuming the application is hosted at a specific URL for the calculator.
    // In a real enterprise setup, this URL would likely come from a config.
    await calculatorPage.navigateTo('/calculator'); 
  });

  test('should calculate estimated electric use correctly for October', async () => {
    // Step 1: Select a month (e.g., "October")
    // 'm10' is the value for October based on the provided options.
    await calculatorPage.selectBillingMonth('m10');
    await expect(calculatorPage.getSelectedMonthValue()).resolves.toBe('m10');

    // Step 2: Enter previous meter read
    const previousRead = '1000';
    await calculatorPage.enterPreviousMeterRead(previousRead);
    await expect(calculatorPage.getPreviousReadValue()).resolves.toBe(previousRead);

    // Step 3: Enter current meter read
    const currentRead = '1500';
    await calculatorPage.enterCurrentMeterRead(currentRead);
    await expect(calculatorPage.getCurrentReadValue()).resolves.toBe(currentRead);

    // Step 4: Select "Electric" service type
    await calculatorPage.selectElectricServiceType();
    await expect(calculatorPage.isElectricServiceSelected()).resolves.toBe(true);

    // Step 5: Click "Calculate"
    await calculatorPage.clickCalculateButton();

    // Step 6: Verify the estimated electric use is 500 kWh
    const expectedElectricUse = '500'; // Calculation: 1500 - 1000 = 500
    await expect(calculatorPage.getEstimatedElectricUseValue()).resolves.toBe(expectedElectricUse);

    // Verify Gas consumption input is disabled as per initial state
    await expect(calculatorPage.isGasConsumptionInputDisabled()).resolves.toBe(true);
  });

  test('should reset the form inputs to their default states', async () => {
    // Fill some values first to ensure they can be reset
    await calculatorPage.selectBillingMonth('m07'); // July
    await calculatorPage.setMeterReads('200', '300');
    await calculatorPage.selectElectricGasServiceType();
    await calculatorPage.clickCalculateButton(); // To ensure values are present and potentially calculated

    // Verify values before reset (good practice)
    await expect(calculatorPage.getPreviousReadValue()).resolves.toBe('200');
    await expect(calculatorPage.getCurrentReadValue()).resolves.toBe('300');
    await expect(calculatorPage.getEstimatedElectricUseValue()).resolves.toBe('100');
    await expect(calculatorPage.getSelectedMonthValue()).resolves.toBe('m07');
    await expect(calculatorPage.isElectricGasServiceSelected()).resolves.toBe(true);

    // Perform reset action
    await calculatorPage.clickResetButton();

    // Verify inputs are reset to their default values as per Locator Catalog and typical app behavior
    // Previous Read and Current Read default to "0"
    await expect(calculatorPage.getPreviousReadValue()).resolves.toBe('0');
    await expect(calculatorPage.getCurrentReadValue()).resolves.toBe('0');
    await expect(calculatorPage.getEstimatedElectricUseValue()).resolves.toBe('0');

    // Month dropdown default is 'm06' (June) according to currentValue in catalog
    await expect(calculatorPage.getSelectedMonthValue()).resolves.toBe('m06');

    // Service type default. 'e' (Electric) has currentValue 'E', implying it's the default if nothing else is specified.
    await expect(calculatorPage.isElectricServiceSelected()).resolves.toBe(true);
    await expect(calculatorPage.isElectricGasServiceSelected()).resolves.toBe(false);
  });
});