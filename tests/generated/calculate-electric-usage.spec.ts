import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import

test.describe('Rate Calculator Functionality', () => {

  let calculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new RateCalculatorPage(page);
    await calculatorPage.navigateTo(); // Navigate to the calculator page
  });

  test('should calculate estimated electric usage correctly', async () => {
    // Step 1: Select a billing month (October - 'm10')
    await calculatorPage.selectBillingMonth('m10');

    // Step 2: Enter a previous meter read
    await calculatorPage.enterPreviousMeterRead('1000');

    // Step 3: Enter a current meter read
    await calculatorPage.enterCurrentMeterRead('1250');

    // Step 4: Select Electric service type
    await calculatorPage.selectElectricServiceType();

    // Step 5: Click the Calculate button
    await calculatorPage.clickCalculateButton();

    // Step 6: Verify the Estimated Electric use (kWh)
    const estimatedElectricUse = await calculatorPage.getEstimatedElectricUse();
    await expect(estimatedElectricUse).toBe('250'); // (1250 - 1000) = 250

    // Step 7: Verify Estimated Gas use (Ccf) is disabled and shows 0
    const estimatedGasUse = await calculatorPage.getEstimatedGasUse();
    await expect(estimatedGasUse).toBe('0');
    await expect(await calculatorPage.isEstimatedGasUseFieldDisabled()).toBe(true);
  });

  test('should reset form fields to their default state', async () => {
    // Enter some arbitrary values to be reset
    await calculatorPage.selectBillingMonth('m07'); // July
    await calculatorPage.enterPreviousMeterRead('500');
    await calculatorPage.enterCurrentMeterRead('700');
    await calculatorPage.selectElectricGasServiceType();

    // Click the Reset button
    await calculatorPage.clickResetButton();

    // Verify fields are reset to their initial/default values
    await expect(await calculatorPage.getEstimatedElectricUse()).toBe('0');
    await expect(await calculatorPage.getEstimatedGasUse()).toBe('0');
    // Based on locator catalog, default month is 'm06', meter reads are '0'
    await expect(await calculatorPage.getSelectedBillingMonthValue()).toBe('m06'); 
    await expect(await calculatorPage.getPreviousMeterReadValue()).toBe('0'); 
    await expect(await calculatorPage.getCurrentMeterReadValue()).toBe('0'); 
  });
});