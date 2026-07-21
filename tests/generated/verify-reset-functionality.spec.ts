import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;
  const testUrl = 'https://example.com/rate-calculator'; // Placeholder URL, update as needed

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigateTo(testUrl);
    await expect(page).toHaveTitle(/Rate Calculator/);
  });

  test('Verify Reset Functionality clears all inputs and results - MTX-4506', async () => {
    // Step 1: Enter values into the meter read fields and perform a calculation.
    // Input Data: Electric: 300, Gas: 100
    // Based on the available locators, we'll input meter reads that result in desired usage.
    // We assume 'EG' service means a single set of meter reads applies to both electric and gas consumption fields.
    await rateCalculatorPage.selectServiceType('EG');
    await rateCalculatorPage.enterPreviousRead('0');
    await rateCalculatorPage.enterCurrentRead('300'); // This implies 300 units usage for both electric and gas if 'EG' is selected
    await rateCalculatorPage.selectMonth('m10'); // Select a different month (October) to ensure reset returns to default

    await rateCalculatorPage.clickCalculateButton();

    // Expected Result: Calculation result is displayed.
    // Assert that the estimated usage fields are populated as per the input.
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('300');
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('300'); // Verifying assumption: shared input leads to same usage if 'EG' is selected

    // Step 2: Click on the 'Reset' button.
    await rateCalculatorPage.clickResetButton();

    // Expected Result: All input fields are cleared, dropdowns return to default, and the calculated price is removed.
    // Verify inputs are cleared/reset
    await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('0');
    await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('0');

    // Verify dropdown returns to its default state (June - m06, based on locator catalog's 'currentValue')
    await expect(rateCalculatorPage.getSelectedMonthValue()).resolves.toBe('m06');

    // Verify estimated usage outputs are cleared/reset to '0'
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0');
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');

    // Verify service type radio button returns to its default state (Electric only - 'E', based on locator catalog's 'currentValue')
    await expect(rateCalculatorPage.isElectricServiceSelected()).resolves.toBe(true);
  });
});