import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {

  test('should successfully calculate electric bill for July with sample readings', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    const previousRead = '1000';
    const currentRead = '1500';
    const expectedElectricConsumption = '500'; // 1500 - 1000 = 500

    await test.step('Select July as the billing month', async () => {
      await rateCalculatorPage.selectBillingMonth('m07');
      await expect(rateCalculatorPage.getSelectedMonth()).resolves.toBe('m07');
    });

    await test.step('Enter previous meter reading', async () => {
      await rateCalculatorPage.enterPreviousMeterRead(previousRead);
      await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe(previousRead);
    });

    await test.step('Enter current meter reading', async () => {
      await rateCalculatorPage.enterCurrentMeterRead(currentRead);
      await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe(currentRead);
    });

    await test.step('Select Electric service type', async () => {
      await rateCalculatorPage.selectServiceTypeElectric();
    });

    await test.step('Verify Estimated Gas use is disabled for Electric service', async () => {
      await expect(rateCalculatorPage.isEstimatedGasUseDisabled()).resolves.toBe(true);
    });

    await test.step('Click Calculate button', async () => {
      await rateCalculatorPage.clickCalculateButton();
    });

    await test.step('Verify estimated electric use', async () => {
      const actualElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(actualElectricUse).toBe(expectedElectricConsumption);
    });

    await test.step('Verify estimated gas use remains 0 or unchanged', async () => {
      const actualGasUse = await rateCalculatorPage.getEstimatedGasUse();
      expect(actualGasUse).toBe('0');
    });
  });

  test('should reset all fields when reset button is clicked', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Fill some data into the form', async () => {
      await rateCalculatorPage.selectBillingMonth('m12');
      await rateCalculatorPage.enterPreviousMeterRead('500');
      await rateCalculatorPage.enterCurrentMeterRead('750');
      await rateCalculatorPage.selectServiceTypeElectricAndGas();

      await expect(rateCalculatorPage.getSelectedMonth()).resolves.toBe('m12');
      await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('500');
      await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('750');
    });

    await test.step('Click the Reset button', async () => {
      await rateCalculatorPage.clickResetButton();
    });

    await test.step('Verify all fields are reset to their default values', async () => {
      await expect(rateCalculatorPage.getSelectedMonth()).resolves.toBe('m06');
      await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('0');
      await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('0');
      await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
      await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0');
    });
  });
});
