import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative path assuming framework structure

test.describe('Rate Calculator Functionality Verification', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Placeholder URL for the rate calculator application
    await rateCalculatorPage.navigateTo('https://example.com/rate-calculator'); 
  });

  test('should calculate estimated electric use correctly for electric service type', async () => {
    // Given a user wants to calculate electric use
    await rateCalculatorPage.selectMonth('m06'); // June
    await rateCalculatorPage.enterPreviousRead('1000');
    await rateCalculatorPage.enterCurrentRead('1100');
    await rateCalculatorPage.selectElectricServiceType();

    // When the user clicks calculate
    await rateCalculatorPage.clickCalculate();

    // Then the estimated electric use should be correct and gas use should be zero
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('100'); // Assuming calculation: Current Read - Previous Read = 1100 - 1000 = 100 kWh

    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).toBe('0'); // Gas use should be 0 for Electric only service
  });

  test('should calculate estimated electric and gas use correctly for electric and gas service type', async () => {
    // Given a user wants to calculate electric and gas use
    await rateCalculatorPage.selectMonth('m07'); // July
    await rateCalculatorPage.enterPreviousRead('2000');
    await rateCalculatorPage.enterCurrentRead('2300');
    await rateCalculatorPage.selectElectricAndGasServiceType();

    // When the user clicks calculate
    await rateCalculatorPage.clickCalculate();

    // Then the estimated electric and gas use should be correct
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('300'); // Assuming calculation: Current Read - Previous Read = 2300 - 2000 = 300 kWh

    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).not.toBe('0'); // Assuming application calculates a non-zero gas usage
    // Placeholder for expected gas consumption based on assumed application logic
    expect(estimatedGasUse).toBe('50'); // Example value, replace with actual expected value
  });

  test('should reset all form fields to their default states', async () => {
    // Given some fields are populated and a calculation has been made
    await rateCalculatorPage.selectMonth('m08'); // August
    await rateCalculatorPage.enterPreviousRead('500');
    await rateCalculatorPage.enterCurrentRead('600');
    await rateCalculatorPage.selectElectricServiceType();
    await rateCalculatorPage.clickCalculate();

    // When the user clicks the reset button
    await rateCalculatorPage.clickReset();

    // Then all fields should revert to their initial default values
    const currentMonth = await rateCalculatorPage.getSelectedMonth();
    expect(currentMonth).toBe('m06'); // Default month is June (m06) as per catalog currentValue

    const previousReadValue = await rateCalculatorPage.page.getByLabel('Enter Previous Read:').inputValue();
    expect(previousReadValue).toBe('0'); // Default value '0' as per catalog currentValue

    const currentReadValue = await rateCalculatorPage.page.getByLabel('Enter Current Read:').inputValue();
    expect(currentReadValue).toBe('0'); // Default value '0' as per catalog currentValue

    const estimatedElectricUseValue = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUseValue).toBe('0'); // Default value '0' as per catalog currentValue

    const estimatedGasUseValue = await rateCalculatorPage.getEstimatedGasUse();
    expect(estimatedGasUseValue).toBe('0'); // Default value '0' as per catalog currentValue (even if disabled)
  });
});