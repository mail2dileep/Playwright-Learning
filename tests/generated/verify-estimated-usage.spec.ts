import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming a base URL is configured in playwright.config.ts
    // For demonstration, navigate to a placeholder URL
    await rateCalculatorPage.navigate('https://www.example.com/rate-calculator');
  });

  test('should correctly calculate estimated electric usage', async () => {
    // Step 1: Select "October" as the month. (value "m10" from catalog)
    await rateCalculatorPage.selectMonth('m10');

    // Step 2: Enter "1000" into the "Previous Read" field.
    await rateCalculatorPage.enterPreviousRead('1000');

    // Step 3: Enter "1500" into the "Current Read" field.
    await rateCalculatorPage.enterCurrentRead('1500');

    // Step 4: Select "Electric" as the service type.
    await rateCalculatorPage.selectElectricService();

    // Step 5: Click the "Calculate" button.
    await rateCalculatorPage.clickCalculate();

    // Step 6: Verify that "Estimated Electric use (kWh)" displays "500".
    const estimatedElectricUsage = await rateCalculatorPage.getEstimatedElectricUsage();
    await expect(estimatedElectricUsage).toBe('500');

    // Step 7: Verify that "Estimated Gas use (Ccf)" displays "0" and is disabled.
    const estimatedGasUsage = await rateCalculatorPage.getEstimatedGasUsage();
    await expect(estimatedGasUsage).toBe('0');
    await expect(await rateCalculatorPage.isEstimatedGasUsageDisabled()).toBe(true);
  });

  test('should reset form fields upon clicking Reset button', async () => {
    await rateCalculatorPage.selectMonth('m07'); // Select July
    await rateCalculatorPage.enterPreviousRead('500');
    await rateCalculatorPage.enterCurrentRead('600');
    await rateCalculatorPage.selectElectricAndGasService();
    await rateCalculatorPage.clickCalculate(); // Simulate a calculation

    // Verify fields are populated before reset (assuming calculation '600' - '500' = '100')
    await expect(await rateCalculatorPage.getEstimatedElectricUsage()).toBe('100');
    // Gas usage should remain '0' as it's disabled and no gas-specific input was provided.
    await expect(await rateCalculatorPage.getEstimatedGasUsage()).toBe('0');

    await rateCalculatorPage.clickReset();

    // Verify fields are reset to their initial state
    await expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06'); // Default month is 'm06' (June) from catalog currentValue
    await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    await expect(await rateCalculatorPage.getEstimatedElectricUsage()).toBe('0');
    await expect(await rateCalculatorPage.getEstimatedGasUsage()).toBe('0');
    await expect(await rateCalculatorPage.isEstimatedGasUsageDisabled()).toBe(true); // Should be disabled initially
  });

});