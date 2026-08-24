import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../pages/RateCalculatorPage"; // Adjust path as needed

test.describe('Rate Calculator Functionality', () => {
  const BASE_URL = 'http://example.com/rate-calculator'; // Placeholder URL

  test('should calculate estimated electric usage correctly', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the Rate Calculator page', async () => {
      await calculatorPage.navigate(BASE_URL);
      await expect(page).toHaveTitle(/Rate Calculator/); // Assuming a title pattern
    });

    await test.step('Select July as the month', async () => {
      await calculatorPage.selectMonth('m07'); // 'm07' for July
    });

    await test.step('Enter Previous Read as 1000', async () => {
      await calculatorPage.enterPreviousRead('1000');
    });

    await test.step('Enter Current Read as 1200', async () => {
      await calculatorPage.enterCurrentRead('1200');
    });

    await test.step('Select Electric as service type', async () => {
      await calculatorPage.selectServiceType('Electric');
    });

    await test.step('Click Calculate button', async () => {
      await calculatorPage.calculateConsumption();
    });

    await test.step('Verify Estimated Electric use (kWh) displays 200', async () => {
      const estimatedElectricUse = await calculatorPage.getEstimatedElectricUse();
      expect(estimatedElectricUse).toBe('200');
    });

    await test.step('Verify Estimated Gas use (Ccf) displays 0', async () => {
      const estimatedGasUse = await calculatorPage.getEstimatedGasUse();
      expect(estimatedGasUse).toBe('0');
    });
  });

  test('should reset the calculator fields', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the Rate Calculator page', async () => {
      await calculatorPage.navigate(BASE_URL);
      await expect(page).toHaveTitle(/Rate Calculator/);
    });

    await test.step('Fill in some fields', async () => {
      await calculatorPage.selectMonth('m08'); // August
      await calculatorPage.enterPreviousRead('500');
      await calculatorPage.enterCurrentRead('600');
      await calculatorPage.selectServiceType('ElectricGas');
    });

    await test.step('Click Reset button', async () => {
      await calculatorPage.resetCalculator();
    });

    await test.step('Verify fields are reset to initial values', async () => {
      const initialElectricUse = await calculatorPage.getEstimatedElectricUse();
      const initialGasUse = await calculatorPage.getEstimatedGasUse();

      // Assuming initial values for previous/current read are 0 or empty after reset based on app behavior
      // And default month is typically the first option or specific default
      // For simplicity, checking derived fields only for now.
      expect(initialElectricUse).toBe('0');
      expect(initialGasUse).toBe('0');

      // You might add more specific assertions for dropdown selection or input values if reset brings them to a known state
      // E.g., expect(await calculatorPage.page.getByLabel('Month').inputValue()).toBe('m06');
    });
  });
});
