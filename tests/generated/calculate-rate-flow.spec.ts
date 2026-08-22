import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Module Functionality', () => {
  const CALCULATOR_URL = 'http://localhost:3000/rate-calculator'; // Placeholder URL

  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.goto(CALCULATOR_URL);
  });

  test('should accurately calculate electric usage when only electric service is selected', async () => {
    await rateCalculatorPage.selectBillingMonth('m07'); // Select July
    await rateCalculatorPage.setPreviousMeterRead('1000');
    await rateCalculatorPage.setCurrentMeterRead('1250');
    await rateCalculatorPage.chooseElectricService();

    // Verify that Estimated Gas use field is disabled when only electric service is chosen
    await expect(await rateCalculatorPage.isEstimatedGasUsageFieldDisabled()).toBe(true);

    await rateCalculatorPage.triggerCalculation();

    // Assert the calculated electric usage
    await expect(await rateCalculatorPage.getEstimatedElectricUsage()).toBe('250'); // 1250 - 1000 = 250
    // Assert the gas usage remains 0 as per its initial currentValue and disabled state
    await expect(await rateCalculatorPage.getEstimatedGasUsage()).toBe('0');
  });

  test('should reset the calculator fields to their initial state', async () => {
    await rateCalculatorPage.selectBillingMonth('m06'); // Select June
    await rateCalculatorPage.setPreviousMeterRead('500');
    await rateCalculatorPage.setCurrentMeterRead('700');
    await rateCalculatorPage.chooseElectricAndGasService(); // Enable gas field for this scenario
    await rateCalculatorPage.triggerCalculation();

    // Verify fields are populated after calculation (assuming some logic for gas, though catalog shows 0)
    await expect(await rateCalculatorPage.getEstimatedElectricUsage()).toBe('200'); // 700 - 500 = 200
    await expect(await rateCalculatorPage.getEstimatedGasUsage()).toBe('0'); // As per catalog's currentValue for gas input
    await expect(await rateCalculatorPage.isEstimatedGasUsageFieldDisabled()).toBe(false); // Should be enabled after choosing EG service

    await rateCalculatorPage.resetCalculator();

    // Verify fields are reset to initial values (0 or default selected month)
    await expect(await rateCalculatorPage.getEstimatedElectricUsage()).toBe('0');
    await expect(await rateCalculatorPage.getEstimatedGasUsage()).toBe('0');
    // After reset, the gas field should revert to its initial disabled state.
    await expect(await rateCalculatorPage.isEstimatedGasUsageFieldDisabled()).toBe(true);
    // The month dropdown defaults to 'm06' (June) as per the catalog's currentValue, but we don't assert that here to keep tests concise.
  });
});
