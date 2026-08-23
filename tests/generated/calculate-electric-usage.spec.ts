import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed based on your project structure

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming the application is hosted at this URL or configured in playwright.config.ts base URL
    await rateCalculatorPage.navigateTo('https://www.example.com/rate-calculator');
  });

  test('should calculate estimated electric usage correctly', async () => {
    // Step 1: Select 'March' as the month (value 'm03')
    await rateCalculatorPage.selectMonth('m03');

    // Step 2: Enter '1000' for Previous Read
    await rateCalculatorPage.enterPreviousMeterRead('1000');

    // Step 3: Enter '1500' for Current Read
    await rateCalculatorPage.enterCurrentMeterRead('1500');

    // Step 4: Select 'Electric' service type
    await rateCalculatorPage.selectServiceType('Electric');

    // Step 5: Click 'Calculate'
    await rateCalculatorPage.clickCalculateButton();

    // Step 6: Verify 'Estimated Electric use (kWh):' shows '500'
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUseValue();
    expect(estimatedElectricUse).toBe('500');

    // Step 7: Verify 'Estimated Gas use (Ccf):' is disabled and shows '0'
    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUseValue();
    expect(estimatedGasUse).toBe('0');
    const isGasUseDisabled = await rateCalculatorPage.isEstimatedGasUseInputDisabled();
    expect(isGasUseDisabled).toBeTruthy();
  });

  test('should reset form fields to initial state', async () => {
    // Fill some fields first
    await rateCalculatorPage.selectMonth('m05'); // Select May
    await rateCalculatorPage.enterPreviousMeterRead('200');
    await rateCalculatorPage.enterCurrentMeterRead('300');
    await rateCalculatorPage.selectServiceType('ElectricAndGas'); // Select EG

    // Click Reset
    await rateCalculatorPage.clickResetButton();

    // Verify fields are reset to initial states
    // Initial month is 'm06' (June) based on currentValue from locator catalog
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06');
    // Initial reads are '0'
    expect(await rateCalculatorPage.getPreviousMeterReadValue()).toBe('0');
    expect(await rateCalculatorPage.getCurrentMeterReadValue()).toBe('0');
    // Estimated use fields should also be '0'
    expect(await rateCalculatorPage.getEstimatedElectricUseValue()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedGasUseValue()).toBe('0');
    // Service type should reset to default 'E' (Electric) based on current value 'E' for radio with id 'e'
    expect(await rateCalculatorPage.isElectricServiceChecked()).toBeTruthy();
    expect(await rateCalculatorPage.isElectricAndGasServiceChecked()).toBeFalsy();
  });
});
