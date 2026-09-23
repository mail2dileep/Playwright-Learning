import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Energy Usage Calculator Functionality', () => {
  const BASE_URL = 'http://localhost:3000/calculator'; // Placeholder URL

  test('should correctly calculate electric and gas usage and reset fields', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    await test.step('1. Navigate to the calculator page', async () => {
      await calculatorPage.navigateTo(BASE_URL);
      await expect(page).toHaveTitle(/Calculator/);
      // Verify initial state of gas usage field (disabled and 0)
      await expect(await calculatorPage.getEstimatedGasUse()).toBe('0');
      await expect(await calculatorPage.isEstimatedGasUseFieldEnabled()).toBeFalsy();
    });

    await test.step('2. Select "Electric & Gas" service type', async () => {
      await calculatorPage.selectElectricAndGasService();
      await expect(await calculatorPage.isElectricAndGasServiceSelected()).toBeTruthy();
      // Verify gas usage field becomes enabled after selecting EG
      await expect(await calculatorPage.isEstimatedGasUseFieldEnabled()).toBeTruthy();
    });

    await test.step('3. Enter "1000" for "Enter Previous Read:"', async () => {
      await calculatorPage.enterPreviousRead('1000');
      await expect(await calculatorPage.getPreviousReadValue()).toBe('1000');
    });

    await test.step('4. Enter "1500" for "Enter Current Read:"', async () => {
      await calculatorPage.enterCurrentRead('1500');
      await expect(await calculatorPage.getCurrentReadValue()).toBe('1500');
    });

    await test.step('5. Select "July" as the billing month', async () => {
      await calculatorPage.selectBillingMonth('m07'); // Use value 'm07' for July
      await expect(await calculatorPage.getSelectedMonth()).toBe('m07');
    });

    await test.step('6. Click the "Calculate" button and verify results', async () => {
      await calculatorPage.clickCalculate();
      // Assuming a simple calculation: Current - Previous for Electric, Gas is an arbitrary value for EG
      await expect(await calculatorPage.getEstimatedElectricUse()).toBe('500');
      await expect(await calculatorPage.getEstimatedGasUse()).toBe('100'); // Assuming an expected value after calculation
    });

    await test.step('7. Click the "Reset" button and verify fields are reset', async () => {
      await calculatorPage.clickReset();
      await expect(await calculatorPage.getPreviousReadValue()).toBe('0');
      await expect(await calculatorPage.getCurrentReadValue()).toBe('0');
      await expect(await calculatorPage.getEstimatedElectricUse()).toBe('0');
      await expect(await calculatorPage.getEstimatedGasUse()).toBe('0');
      // Verify gas usage field becomes disabled again after reset
      await expect(await calculatorPage.isEstimatedGasUseFieldEnabled()).toBeFalsy();
      // Verify service type defaults back to Electric
      await expect(await calculatorPage.isElectricServiceSelected()).toBeTruthy();
    });
  });
});