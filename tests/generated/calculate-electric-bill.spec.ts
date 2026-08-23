import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative path to the Page Object

test.describe('Rate Calculator Functionality', () => {
  let calculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new RateCalculatorPage(page);
    await calculatorPage.goto();
    await calculatorPage.waitForPageLoad(); // Ensure the page is loaded before starting tests
  });

  test('should accurately calculate estimated electric use for Electric service', async () => {
    await test.step('Select October as the billing month', async () => {
      await calculatorPage.selectBillingMonth('m10'); // 'm10' is the value for October
      await expect(await calculatorPage.getSelectedMonthValue()).toBe('m10');
    });

    await test.step('Enter previous meter read as 1000', async () => {
      await calculatorPage.enterPreviousRead('1000');
      await expect(await calculatorPage.getPreviousReadValue()).toBe('1000');
    });

    await test.step('Enter current meter read as 1250', async () => {
      await calculatorPage.enterCurrentRead('1250');
      await expect(await calculatorPage.getCurrentReadValue()).toBe('1250');
    });

    await test.step('Select Electric only service type', async () => {
      await calculatorPage.selectServiceType('electric');
      await expect(await calculatorPage.isElectricServiceSelected()).toBe(true);
      await expect(await calculatorPage.isElectricGasServiceSelected()).toBe(false);
      // Verify that the gas consumption input remains disabled for electric only service
      await expect(await calculatorPage.isEstimatedGasUseInputDisabled()).toBe(true);
    });

    await test.step('Click the Calculate button', async () => {
      await calculatorPage.clickCalculate();
    });

    await test.step('Verify estimated electric use is 250 kWh', async () => {
      const estimatedUse = await calculatorPage.getEstimatedElectricUse();
      await expect(estimatedUse).toBe('250');
    });
  });

  test('should reset all fields to default values', async () => {
    await test.step('Pre-fill some fields to test the reset functionality', async () => {
      await calculatorPage.selectBillingMonth('m03'); // Select March
      await calculatorPage.enterPreviousRead('500');
      await calculatorPage.enterCurrentRead('700');
      await calculatorPage.selectServiceType('electric_gas');

      // Assert initial state before reset
      await expect(await calculatorPage.getSelectedMonthValue()).toBe('m03');
      await expect(await calculatorPage.getPreviousReadValue()).toBe('500');
      await expect(await calculatorPage.getCurrentReadValue()).toBe('700');
      await expect(await calculatorPage.isElectricGasServiceSelected()).toBe(true);
    });

    await test.step('Click the Reset button', async () => {
      await calculatorPage.clickReset();
    });

    await test.step('Verify all fields are reset to their default values', async () => {
      // Assuming default values: Month 'm06' (June), Reads '0', Service type 'electric'
      await expect(await calculatorPage.getSelectedMonthValue()).toBe('m06');
      await expect(await calculatorPage.getPreviousReadValue()).toBe('0');
      await expect(await calculatorPage.getCurrentReadValue()).toBe('0');
      await expect(await calculatorPage.getEstimatedElectricUse()).toBe('0'); // Estimated use should be 0 after reset
      await expect(await calculatorPage.isElectricServiceSelected()).toBe(true); // Assuming Electric is the default selected radio
      await expect(await calculatorPage.isEstimatedGasUseInputDisabled()).toBe(true); // Gas input should still be disabled
    });
  });
});
