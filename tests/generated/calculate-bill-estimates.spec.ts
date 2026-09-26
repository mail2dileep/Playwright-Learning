import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {

  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming a base URL is configured in playwright.config.ts
    // and the calculator is accessible at '/calculator' relative to the base URL.
    await rateCalculatorPage.navigateTo('/calculator');
    await expect(page).toHaveURL(/.*calculator/);
  });

  test('should calculate estimated electric usage correctly for Electric service', async () => {
    const previousRead = '1000';
    const currentRead = '1250';
    const expectedElectricUsage = (parseInt(currentRead) - parseInt(previousRead)).toString(); // 250 kWh

    await rateCalculatorPage.selectBillingMonth('m07'); // Select July
    await rateCalculatorPage.enterPreviousRead(previousRead);
    await rateCalculatorPage.enterCurrentRead(currentRead);
    await rateCalculatorPage.selectElectricServiceType();
    
    await expect(rateCalculatorPage.isElectricServiceTypeSelected()).toBeTruthy();
    await expect(rateCalculatorPage.isElectricAndGasServiceTypeSelected()).toBeFalsy();
    
    await rateCalculatorPage.clickCalculate();

    // Assertions
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();

    expect(estimatedElectricUse).toBe(expectedElectricUsage);
    expect(estimatedGasUse).toBe('0'); // Expecting '0' as Gas field is disabled and not populated by this service type
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe(previousRead);
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe(currentRead);
    expect(await rateCalculatorPage.getSelectedBillingMonthValue()).toBe('m07');
  });

  test('should calculate estimated electric and gas usage correctly for Electric/Gas service', async () => {
    const previousElectricRead = '2000';
    const currentElectricRead = '2500';
    const expectedElectricUsage = (parseInt(currentElectricRead) - parseInt(previousElectricRead)).toString(); // 500 kWh

    await rateCalculatorPage.selectBillingMonth('m08'); // Select August
    await rateCalculatorPage.enterPreviousRead(previousElectricRead);
    await rateCalculatorPage.enterCurrentRead(currentElectricRead);
    await rateCalculatorPage.selectElectricAndGasServiceType();

    await expect(rateCalculatorPage.isElectricServiceTypeSelected()).toBeFalsy();
    await expect(rateCalculatorPage.isElectricAndGasServiceTypeSelected()).toBeTruthy();
    
    await rateCalculatorPage.clickCalculate();

    // Assertions
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();

    expect(estimatedElectricUse).toBe(expectedElectricUsage);
    // The 'Estimated Gas use' field is disabled. Assuming it shows '0' or a calculated value.
    // Given 'disabled: true' and no specific calculation logic provided, asserting '0' is safest.
    expect(estimatedGasUse).toBe('0'); 

    expect(await rateCalculatorPage.getPreviousReadValue()).toBe(previousElectricRead);
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe(currentElectricRead);
    expect(await rateCalculatorPage.getSelectedBillingMonthValue()).toBe('m08');
  });

  test('should reset form fields upon clicking Reset button', async () => {
    await rateCalculatorPage.selectBillingMonth('m10'); // Select October
    await rateCalculatorPage.enterPreviousRead('500');
    await rateCalculatorPage.enterCurrentRead('600');
    await rateCalculatorPage.selectElectricAndGasServiceType();

    await rateCalculatorPage.clickReset();

    // Assertions for reset state
    // Month dropdown might revert to default (currentValue: "m06" for June from locator catalog).
    expect(await rateCalculatorPage.getSelectedBillingMonthValue()).toBe('m06');
    // Read inputs revert to "0" (currentValue: "0" from locator catalog).
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    // Service type might revert to default. Assuming Electric is default (currentValue: "E" for id=e).
    expect(await rateCalculatorPage.isElectricServiceTypeSelected()).toBeTruthy();
    expect(await rateCalculatorPage.isElectricAndGasServiceTypeSelected()).toBeFalsy();
    // Estimated usage fields should also reset to "0".
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
  });
});
