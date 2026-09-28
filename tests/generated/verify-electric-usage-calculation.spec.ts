import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator - Electric Usage Calculation', () => {
  const BASE_URL = 'http://localhost:3000/rate-calculator'; // Placeholder for the application URL

  test('should correctly calculate estimated electric usage based on meter reads', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Navigate to the calculator page
    await test.step('Navigate to the rate calculator page', async () => {
      await rateCalculatorPage.navigate(BASE_URL);
      await expect(page).toHaveTitle(/Rate Calculator/);
      await expect(page).toHaveURL(/.*rate-calculator/); // Verify URL contains a specific path
    });

    // Step 2: Select a month from the dropdown
    const targetMonthValue = 'm08'; // Represents 'August' from the catalog options
    await test.step('Select August from the month dropdown', async () => {
      await rateCalculatorPage.selectMonth(targetMonthValue);
      await expect(rateCalculatorPage.getMonthSelectedValue()).toEqual(targetMonthValue);
    });

    // Step 3: Enter a previous meter read
    const previousRead = '100';
    await test.step('Enter previous meter read as 100', async () => {
      await rateCalculatorPage.enterPreviousRead(previousRead);
      await expect(rateCalculatorPage.getPreviousReadValue()).toEqual(previousRead);
    });

    // Step 4: Enter a current meter read
    const currentRead = '250';
    await test.step('Enter current meter read as 250', async () => {
      await rateCalculatorPage.enterCurrentRead(currentRead);
      await expect(rateCalculatorPage.getCurrentReadValue()).toEqual(currentRead);
    });

    // Step 5: Select "Electric" service type
    await test.step('Select "Electric" service type', async () => {
      await rateCalculatorPage.selectElectricService();
      await expect(rateCalculatorPage.isElectricServiceOptionSelected()).toBeTruthy();
    });

    // Step 6: Click the "Calculate" button and verify the result
    const expectedElectricUsage = '150'; // Calculation: 250 (current) - 100 (previous) = 150
    await test.step('Click Calculate and verify estimated electric usage', async () => {
      await rateCalculatorPage.clickCalculate();
      const actualElectricUsage = await rateCalculatorPage.getEstimatedElectricUse();
      await expect(actualElectricUsage).toEqual(expectedElectricUsage);
    });
  });
});