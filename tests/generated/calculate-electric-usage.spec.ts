import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming the application is hosted locally or a base URL is configured
    await page.goto('/rate-calculator'); // Placeholder URL, replace with actual app URL if known
  });

  test('should calculate electric usage correctly for a given month and meter reads', async () => {
    const billingMonth = 'July';
    const previousRead = '1000';
    const currentRead = '1200';
    const expectedElectricUsage = '200';

    await rateCalculatorPage.calculateElectricUsage(billingMonth, previousRead, currentRead);

    // Assertions
    const actualElectricUsage = await rateCalculatorPage.getEstimatedElectricUsage();
    await expect(actualElectricUsage).toEqual(expectedElectricUsage);
    await expect(await rateCalculatorPage.isGasUsageFieldDisabled()).toBeTruthy();
  });

  test('should reset the form fields', async () => {
    // Fill some data first
    await rateCalculatorPage.selectBillingMonth('August');
    await rateCalculatorPage.enterPreviousMeterRead('500');
    await rateCalculatorPage.enterCurrentMeterRead('600');
    await rateCalculatorPage.selectElectricGasServiceType();
    await rateCalculatorPage.clickCalculate(); // Simulate a calculation

    await expect(await rateCalculatorPage.getEstimatedElectricUsage()).not.toEqual('0'); // Ensure it's not default

    await rateCalculatorPage.clickReset();

    // Verify fields are reset to default values (0 for inputs, or initial select state)
    await expect(await rateCalculatorPage.getEstimatedElectricUsage()).toEqual('0');
    await expect(await rateCalculatorPage.getEstimatedGasUsage()).toEqual('0');
    await expect(await rateCalculatorPage.getPreviousMeterRead()).toEqual('0');
    await expect(await rateCalculatorPage.getCurrentMeterRead()).toEqual('0');
    await expect(await rateCalculatorPage.getSelectedMonthValue()).toEqual('m06'); // Initial default 'm06' (June) based on catalog currentValue
    await expect(await rateCalculatorPage.isElectricServiceTypeSelected()).toBeTruthy(); // Assuming Electric is default selected after reset
  });
});