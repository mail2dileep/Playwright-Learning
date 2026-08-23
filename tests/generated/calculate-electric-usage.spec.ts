import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming the base URL is configured in playwright.config.ts
    // And the calculator is accessible at the root path '/'
    await rateCalculatorPage.navigate('/');
  });

  test('should accurately calculate estimated electric use for electric-only service', async () => {
    const previousRead = '1000';
    const currentRead = '1500';
    const expectedElectricUse = '500'; // 1500 - 1000

    await rateCalculatorPage.selectMonth('m10'); // Select October
    await rateCalculatorPage.enterPreviousRead(previousRead);
    await rateCalculatorPage.enterCurrentRead(currentRead);
    await rateCalculatorPage.selectElectricService(); // Choose electric service
    await rateCalculatorPage.clickCalculate();

    // Assertions in the test layer
    const actualElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(actualElectricUse).toBe(expectedElectricUse);

    const actualGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(actualGasUse).toBe('0'); // Gas use should be 0 for electric-only service

    const isGasUseDisabled = await rateCalculatorPage.isEstimatedGasUseDisabled();
    expect(isGasUseDisabled).toBe(true); // Gas use field should remain disabled
  });

  test('should reset all fields when reset button is clicked', async () => {
    // Fill with some data
    await rateCalculatorPage.selectMonth('m03'); // Select March
    await rateCalculatorPage.enterPreviousRead('200');
    await rateCalculatorPage.enterCurrentRead('300');
    await rateCalculatorPage.selectElectricAndGasService();
    await rateCalculatorPage.clickCalculate(); // To get non-zero estimated values

    // Verify inputs are not default before reset (after calculation)
    expect(await rateCalculatorPage.getEstimatedElectricUse()).not.toBe('0');
    expect(await rateCalculatorPage.getEstimatedGasUse()).not.toBe('0');
    
    await rateCalculatorPage.clickReset();

    // Verify fields are reset to default values
    // Default month is 'm06' (June) based on current value in catalog for gMonth1
    // Default reads are '0' based on current value in catalog for eMeterRead and eMeterNewRead
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06');
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
  });
});