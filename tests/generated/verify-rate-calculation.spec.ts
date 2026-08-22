import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality Verification', () => {
  const TEST_URL = 'http://localhost:3000/rate-calculator'; // Placeholder URL for the calculator page

  test('should successfully calculate electric usage when only electric service is selected', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the Rate Calculator page', async () => {
      await rateCalculatorPage.navigateTo(TEST_URL);
      await expect(page).toHaveURL(TEST_URL);
      await expect(rateCalculatorPage.calculateButtonLocator).toBeVisible();
    });

    await test.step('Select "October" as the month', async () => {
      await rateCalculatorPage.selectMonth('m10'); // Using value 'm10' for October from locator options
      await expect(rateCalculatorPage.getSelectedMonthValue()).resolves.toBe('m10');
    });

    await test.step('Enter previous and current meter readings', async () => {
      await rateCalculatorPage.enterPreviousRead('100');
      await expect(rateCalculatorPage.getPreviousReadInputValue()).resolves.toBe('100');
      await rateCalculatorPage.enterCurrentRead('250');
      await expect(rateCalculatorPage.getCurrentReadInputValue()).resolves.toBe('250');
    });

    await test.step('Select "Electric" service type', async () => {
      await rateCalculatorPage.selectElectricServiceType();
      await expect(rateCalculatorPage.electricServiceRadioLocator).toBeChecked();
      await expect(rateCalculatorPage.electricAndGasServiceRadioLocator).not.toBeChecked();
      await expect(rateCalculatorPage.estimatedGasUseInputLocator).toBeDisabled();
    });

    await test.step('Click "Calculate" button', async () => {
      await rateCalculatorPage.clickCalculate();
      // Add a wait for the calculation to process, e.g., waiting for an element to change state
      // For this example, we'll proceed assuming calculation is instant or handled by the next assertion's retry.
    });

    await test.step('Verify estimated electric usage and gas usage', async () => {
      // Assuming the calculation is (Current Read - Previous Read)
      await expect(rateCalculatorPage.getEstimatedElectricUseValue()).resolves.toBe('150');
      await expect(rateCalculatorPage.getEstimatedGasUseValue()).resolves.toBe('0'); // Gas should be 0 and disabled if only electric is selected
      await expect(rateCalculatorPage.estimatedGasUseInputLocator).toBeDisabled();
    });
  });

  test('should reset form fields to default values when "Reset" button is clicked', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the Rate Calculator page and fill some fields', async () => {
      await rateCalculatorPage.navigateTo(TEST_URL);
      await expect(rateCalculatorPage.calculateButtonLocator).toBeVisible();
      await rateCalculatorPage.selectMonth('m12'); // Select December
      await rateCalculatorPage.enterPreviousRead('50');
      await rateCalculatorPage.enterCurrentRead('150');
      await rateCalculatorPage.selectElectricAndGasServiceType();

      await expect(rateCalculatorPage.getSelectedMonthValue()).resolves.toBe('m12');
      await expect(rateCalculatorPage.getPreviousReadInputValue()).resolves.toBe('50');
      await expect(rateCalculatorPage.getCurrentReadInputValue()).resolves.toBe('150');
      await expect(rateCalculatorPage.electricAndGasServiceRadioLocator).toBeChecked();
    });

    await test.step('Click "Reset" button', async () => {
      await rateCalculatorPage.clickReset();
    });

    await test.step('Verify all fields are reset to their default values', async () => {
      // Default values as per Locator Catalog: month 'm06', reads '0', electric service 'e' checked.
      await expect(rateCalculatorPage.getSelectedMonthValue()).resolves.toBe('m06');
      await expect(rateCalculatorPage.getPreviousReadInputValue()).resolves.toBe('0');
      await expect(rateCalculatorPage.getCurrentReadInputValue()).resolves.toBe('0');
      await expect(rateCalculatorPage.getEstimatedElectricUseValue()).resolves.toBe('0');
      await expect(rateCalculatorPage.getEstimatedGasUseValue()).resolves.toBe('0');
      await expect(rateCalculatorPage.electricServiceRadioLocator).toBeChecked(); // Assuming 'e' is the default selected service type
      await expect(rateCalculatorPage.electricAndGasServiceRadioLocator).not.toBeChecked();
    });
  });
});
