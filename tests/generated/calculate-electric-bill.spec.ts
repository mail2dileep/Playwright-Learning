import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import

test.describe('Rate Calculator Functionality', () => {

  test('should calculate estimated electric usage correctly', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Navigate to the calculator page
    await rateCalculatorPage.navigateTo(); // Using PO method

    // Step 2: Select 'July' from the month dropdown (value 'm07')
    await rateCalculatorPage.selectMonth('m07');

    // Step 3: Enter previous meter read
    await rateCalculatorPage.enterPreviousMeterRead('1000');

    // Step 4: Enter current meter read
    await rateCalculatorPage.enterCurrentMeterRead('1500');

    // Step 5: Select 'Electric' service type
    await rateCalculatorPage.selectElectricServiceType();

    // Step 6: Click 'Calculate' button
    await rateCalculatorPage.clickCalculate();

    // Step 7: Verify estimated electric use
    // Expected calculation: 1500 - 1000 = 500
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('500');

    // Step 8: Verify estimated gas use is disabled
    const isGasUseDisabled = await rateCalculatorPage.isEstimatedGasUseDisabled();
    expect(isGasUseDisabled).toBe(true);

    // Additional verifications
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m07');
    expect(await rateCalculatorPage.getPreviousMeterReadValue()).toBe('1000');
    expect(await rateCalculatorPage.getCurrentMeterReadValue()).toBe('1500');
    expect(await rateCalculatorPage.isElectricServiceTypeSelected()).toBe(true);
    expect(await rateCalculatorPage.isElectricAndGasServiceTypeSelected()).toBe(false);
  });

  test('should reset form fields to their initial state', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await rateCalculatorPage.navigateTo();

    // Fill fields with non-default values
    await rateCalculatorPage.selectMonth('m12'); // December
    await rateCalculatorPage.enterPreviousMeterRead('2000');
    await rateCalculatorPage.enterCurrentMeterRead('2500');
    await rateCalculatorPage.selectElectricAndGasServiceType();

    // Verify fields have the set values
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m12');
    expect(await rateCalculatorPage.getPreviousMeterReadValue()).toBe('2000');
    expect(await rateCalculatorPage.getCurrentMeterReadValue()).toBe('2500');
    expect(await rateCalculatorPage.isElectricAndGasServiceTypeSelected()).toBe(true);

    // Click Reset
    await rateCalculatorPage.clickReset();

    // After reset, fields should revert to initial states.
    // Month dropdown's initial value is 'm06' (June) as per locator catalog.
    // Input fields' initial value is '0'.
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06');
    expect(await rateCalculatorPage.getPreviousMeterReadValue()).toBe('0');
    expect(await rateCalculatorPage.getCurrentMeterReadValue()).toBe('0');
    expect(await rateCalculatorPage.isElectricServiceTypeSelected()).toBe(true); // Assuming 'Electric' is the default selection after reset
    expect(await rateCalculatorPage.isElectricAndGasServiceTypeSelected()).toBe(false); // Make sure Electric & Gas is NOT selected
  });
});
