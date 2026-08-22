import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative path to Page Object

test.describe('Rate Calculator Functionality Verification', () => {

  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigateTo();
  });

  test('should allow user to calculate electric usage and verify fields', async () => {
    // Step 1: Select a month.
    await test.step('Select "March" from the month dropdown', async () => {
      await rateCalculatorPage.selectMonth('m03');
      await expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m03');
    });

    // Step 2: Enter previous and current meter reads.
    await test.step('Enter previous and current meter reads', async () => {
      await rateCalculatorPage.enterPreviousRead('1000');
      await rateCalculatorPage.enterCurrentRead('1500');
      await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('1000');
      await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('1500');
    });

    // Step 3: Select service type (e.g., Electric only).
    await test.step('Select Electric service type', async () => {
      await rateCalculatorPage.selectServiceType('electric');
      await expect(await rateCalculatorPage.isElectricServiceTypeSelected()).toBe(true);
      await expect(await rateCalculatorPage.isEstimatedElectricUseFieldEnabled()).toBe(true);
      // As per locator catalog, Estimated Gas use is initially disabled, should remain disabled after selecting 'electric' only.
      await expect(await rateCalculatorPage.isEstimatedGasUseFieldEnabled()).toBe(false);
    });

    // Step 4: Click Calculate.
    await test.step('Click the Calculate button and verify estimated electric use', async () => {
      await rateCalculatorPage.clickCalculate();
      // Assuming the calculation for (1500 - 1000) results in 500 kWh
      await expect(await rateCalculatorPage.getEstimatedElectricUseValue()).toBe('500');
    });
  });

  test('should reset the calculator fields to their default state', async () => {
    await test.step('Populate some fields to prepare for reset', async () => {
      await rateCalculatorPage.selectMonth('m07'); // July
      await rateCalculatorPage.enterPreviousRead('500');
      await rateCalculatorPage.enterCurrentRead('750');
      await rateCalculatorPage.selectServiceType('electricAndGas');
      await rateCalculatorPage.clickCalculate();
      // Verify fields are populated before reset
      await expect(await rateCalculatorPage.getEstimatedElectricUseValue()).not.toBe('0');
    });

    await test.step('Click the Reset button and verify fields return to default', async () => {
      await rateCalculatorPage.clickReset();
      // Verify fields are reset to their initial default values based on the Locator Catalog
      await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
      await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
      await expect(await rateCalculatorPage.getEstimatedElectricUseValue()).toBe('0');
      await expect(await rateCalculatorPage.getEstimatedGasUseValue()).toBe('0');
      // Default month from catalog is 'm06' (June)
      await expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06');
      // Assuming radio buttons are unselected or reset to a default if applicable, otherwise to false if no default checked state.
      // Since no default checked state is specified in the catalog, we assume they are not selected after reset.
      await expect(await rateCalculatorPage.isElectricServiceTypeSelected()).toBe(false);
      await expect(await rateCalculatorPage.isElectricGasServiceTypeSelected()).toBe(false);
    });
  });
});