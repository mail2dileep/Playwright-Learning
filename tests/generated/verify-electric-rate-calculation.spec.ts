import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed based on your project structure

test.describe('Rate Calculator Functionality', () => {
  const BASE_URL = 'http://localhost:3000/rate-calculator'; // Placeholder URL for the application page

  test.beforeEach(async ({ page }) => {
    // Navigate to the Rate Calculator page before each test
    await page.goto(BASE_URL);
  });

  test('should calculate electric rate correctly for a given month and meter reads', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Select July as the month', async () => {
      await rateCalculatorPage.selectMonth('July');
    });

    await test.step('Enter previous meter read as 100', async () => {
      await rateCalculatorPage.enterPreviousRead('100');
    });

    await test.step('Enter current meter read as 250', async () => {
      await rateCalculatorPage.enterCurrentRead('250');
    });

    await test.step('Select Electric service type', async () => {
      await rateCalculatorPage.selectServiceType('Electric');
    });

    await test.step('Click Calculate button', async () => {
      await rateCalculatorPage.clickCalculateButton();
    });

    await test.step('Verify estimated electric use is updated and not zero', async () => {
      const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(estimatedElectricUse).not.toBe('0');
      // Assuming a valid calculation results in a positive numeric value for electric use
      expect(parseFloat(estimatedElectricUse)).toBeGreaterThan(0);
    });

    await test.step('Verify estimated gas use is disabled and remains zero', async () => {
      expect(await rateCalculatorPage.isEstimatedGasUseDisabled()).toBe(true);
      expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
    });

    await test.step('Click Reset button', async () => {
      await rateCalculatorPage.clickResetButton();
    });

    await test.step('Verify all relevant input fields are reset to their default values (e.g., zero)', async () => {
      expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
      expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
      expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
      expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
      // Note: Verifying the month dropdown reset requires a specific getter to retrieve its selected value.
      // For this example, we focus on the visible input fields which have direct getters.
    });
  });
});
