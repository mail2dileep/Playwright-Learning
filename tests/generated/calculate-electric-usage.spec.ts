import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Electric Usage Calculator Functionality', () => {
  const calculatorPageUrl = 'https://example.com/calculator'; // Placeholder URL

  test('should correctly calculate electric usage for a given month and meter reads', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the rate calculator page', async () => {
      await calculatorPage.navigate(calculatorPageUrl);
      // A simple check to ensure navigation was successful by checking a common element
      await expect(calculatorPage.getEstimatedElectricUseLocator()).toBeVisible();
    });

    await test.step('Select July from the month dropdown', async () => {
      await calculatorPage.selectMonth('m07');
      await expect(calculatorPage.getSelectedMonthValue()).resolves.toBe('m07');
    });

    await test.step('Enter Previous Read as 100', async () => {
      await calculatorPage.enterPreviousRead('100');
      await expect(calculatorPage.getPreviousReadValue()).resolves.toBe('100');
    });

    await test.step('Enter Current Read as 200', async () => {
      await calculatorPage.enterCurrentRead('200');
      await expect(calculatorPage.getCurrentReadValue()).resolves.toBe('200');
    });

    await test.step('Select Electric service type', async () => {
      await calculatorPage.selectElectricService();
      // No direct locator for checking 'checked' state from catalog. Assuming successful interaction.
    });

    await test.step('Click Calculate button', async () => {
      await calculatorPage.clickCalculate();
    });

    await test.step('Verify Estimated Electric use (kWh) is 100', async () => {
      await expect(calculatorPage.getEstimatedElectricUseLocator()).toHaveValue('100');
    });

    await test.step('Verify Estimated Gas use (Ccf) field is disabled', async () => {
      await expect(calculatorPage.getEstimatedGasUseLocator()).toBeDisabled();
    });
  });

  test('should reset the form fields when Reset button is clicked', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the rate calculator page', async () => {
      await calculatorPage.navigate(calculatorPageUrl);
      await expect(calculatorPage.getEstimatedElectricUseLocator()).toBeVisible();
    });

    await test.step('Fill some fields', async () => {
      await calculatorPage.selectMonth('m08'); // August
      await calculatorPage.enterPreviousRead('50');
      await calculatorPage.enterCurrentRead('150');
      await calculatorPage.selectElectricAndGasService();
      await expect(calculatorPage.getCurrentReadValue()).resolves.toBe('150'); // Verify field is filled
    });

    await test.step('Click Reset button', async () => {
      await calculatorPage.clickReset();
    });

    await test.step('Verify fields are reset to default values', async () => {
      // The catalog indicates 'm06' (June) as currentValue for month and '0' for meter reads
      await expect(calculatorPage.getSelectedMonthValue()).resolves.toBe('m06');
      await expect(calculatorPage.getPreviousReadValue()).resolves.toBe('0');
      await expect(calculatorPage.getCurrentReadValue()).resolves.toBe('0');
    });
  });
});
