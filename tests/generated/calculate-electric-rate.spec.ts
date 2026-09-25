import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  const CALCULATOR_PATH = '/rate-calculator'; // Example path, adjust as per application URL structure

  test.beforeEach(async ({ page }) => {
    // Navigate to the calculator page before each test
    await page.goto(CALCULATOR_PATH);
    await page.waitForLoadState('domcontentloaded'); // Ensure page is fully loaded
  });

  test('should calculate electric usage correctly for Electric service type', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Verify initial state and select July month', async () => {
      // The catalog indicates 'm06' (June) as the default currentValue for the month dropdown.
      await expect(rateCalculatorPage.getSelectedMonthValue()).resolves.toBe('m06');
      await rateCalculatorPage.selectMonth('m07');
      await expect(rateCalculatorPage.getSelectedMonthValue()).resolves.toBe('m07');
    });

    await test.step('Enter previous and current meter reads', async () => {
      await rateCalculatorPage.enterPreviousRead('1000');
      await rateCalculatorPage.enterCurrentRead('1500');
      await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('1000');
      await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('1500');
    });

    await test.step('Select Electric service type and verify Gas field disabled', async () => {
      await rateCalculatorPage.selectServiceType('electric');
      // The 'Estimated Gas use' field is initially disabled. Selecting 'electric' should keep it disabled.
      await expect(rateCalculatorPage.isGasConsumptionFieldEnabled()).resolves.toBeFalsy();
    });

    await test.step('Click Calculate and verify estimated electric use', async () => {
      await rateCalculatorPage.clickCalculate();
      // Assuming the calculation for 1500 - 1000 = 500 kWh.
      // A real application would require specific test data and expected outcomes.
      await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('500');
      await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0'); // Should remain 0 if gas is disabled
    });

    await test.step('Reset fields and verify their default values', async () => {
      await rateCalculatorPage.clickReset();
      // Catalog indicates '0' as currentValue for meter reads and 'm06' for month.
      await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('0');
      await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('0');
      await expect(rateCalculatorPage.getSelectedMonthValue()).resolves.toBe('m06'); // Resets to default June
      await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0');
    });
  });

  test('should enable gas consumption field when Electric and Gas service type is selected', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Select Electric and Gas service type', async () => {
      await rateCalculatorPage.selectServiceType('electricAndGas');
      // Add a small wait to allow for any client-side JavaScript to update the DOM state (e.g., enabling the field).
      // In a robust framework, this might be replaced by an explicit waitForCondition on the element itself.
      await page.waitForTimeout(100); 
      await expect(rateCalculatorPage.isGasConsumptionFieldEnabled()).resolves.toBeTruthy();
    });

    // Further test steps could include entering gas reads, clicking calculate, and verifying results.
  });
});
