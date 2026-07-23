import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Reset Functionality', () => {
  // Navigate to the Rate Calculator page before each test for a clean state.
  // Assumes 'baseURL' is configured in playwright.config.ts, or provide a full URL.
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator'); // Adjust to the actual path of the rate calculator
  });

  test('Verify Reset button clears all inputs and results', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Enter values and perform a calculation
    // Input Data: Service Type: Electric and Gas, Electric: 300, Gas: 50
    // To achieve Electric: 300, we'll set previous read to 0 and current read to 300.
    // For Gas: 50, we assume the system calculates this when 'Electric and Gas' is selected and calculation is performed,
    // as there is no direct input field for gas usage.
    await test.step('Enter values and perform a calculation', async () => {
      await rateCalculatorPage.selectServiceType('ElectricAndGas');
      await rateCalculatorPage.enterPreviousRead('0');
      await rateCalculatorPage.enterCurrentRead('300');
      await rateCalculatorPage.clickCalculateButton();

      // Expected Result: Calculation result is displayed.
      // Verifying the estimated usage values after calculation.
      await expect(await rateCalculatorPage.getEstimatedElectricUse(), 'Expected Estimated Electric use to be 300 kWh').toBe('300');
      await expect(await rateCalculatorPage.getEstimatedGasUse(), 'Expected Estimated Gas use to be 50 Ccf').toBe('50');
    });

    // Step 2: Click the Reset button
    await test.step('Click the Reset button', async () => {
      await rateCalculatorPage.clickResetButton();

      // Expected Result: All input fields are cleared, dropdown returns to default,
      // and the displayed price is removed.
      await expect(await rateCalculatorPage.getPreviousReadValue(), 'Expected Previous Read input to reset to default (0)').toBe('0');
      await expect(await rateCalculatorPage.getCurrentReadValue(), 'Expected Current Read input to reset to default (0)').toBe('0');
      // The 'Month' dropdown's default currentValue from the catalog is 'm06' (June).
      await expect(await rateCalculatorPage.getMonthSelectedValue(), 'Expected Month dropdown to reset to default (June)').toBe('m06');
      await expect(await rateCalculatorPage.getEstimatedElectricUse(), 'Expected Estimated Electric use output to reset to default (0)').toBe('0');
      await expect(await rateCalculatorPage.getEstimatedGasUse(), 'Expected Estimated Gas use output to reset to default (0)').toBe('0');

      // Verify that the default service type ('Electric') is selected after reset.
      await expect(await rateCalculatorPage.isElectricServiceTypeSelected(), 'Expected Electric service type radio button to be selected after reset').toBe(true);
      await expect(await rateCalculatorPage.isElectricAndGasServiceTypeSelected(), 'Expected Electric and Gas service type radio button not to be selected after reset').toBe(false);
    });
  });
});
