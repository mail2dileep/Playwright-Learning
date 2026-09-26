import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative path to page object

test.describe('Rate Calculator Functionality', () => {
  const BASE_URL = 'https://www.example.com/rate-calculator'; // Placeholder URL for the application

  test('should calculate estimated electric bill correctly', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the Rate Calculator page', async () => {
      await rateCalculatorPage.navigateTo(BASE_URL);
    });

    await test.step('Select July for the month', async () => {
      await rateCalculatorPage.selectMonth('m07');
      await expect(rateCalculatorPage.monthDropdown).toHaveValue('m07');
    });

    await test.step('Enter previous meter read as 1000', async () => {
      await rateCalculatorPage.enterPreviousMeterRead('1000');
      await expect(rateCalculatorPage.previousReadInput).toHaveValue('1000');
    });

    await test.step('Enter current meter read as 1500', async () => {
      await rateCalculatorPage.enterCurrentMeterRead('1500');
      await expect(rateCalculatorPage.currentReadInput).toHaveValue('1500');
    });

    await test.step('Select Electric service type', async () => {
      await rateCalculatorPage.selectServiceType('electric');
      await expect(rateCalculatorPage.electricServiceRadio).toBeChecked();
      await expect(rateCalculatorPage.electricAndGasServiceRadio).not.toBeChecked();
    });

    await test.step('Verify Estimated Gas use input is disabled', async () => {
      await expect(rateCalculatorPage.estimatedGasUseInput).toBeDisabled();
    });

    await test.step('Click Calculate button', async () => {
      await rateCalculatorPage.clickCalculate();
    });

    await test.step('Verify estimated electric use is updated (placeholder assertion)', async () => {
      // Assuming a calculation happens (1500 - 1000 = 500 kWh). 
      // The actual expected value would depend on the application's business logic.
      await expect(rateCalculatorPage.estimatedElectricUseInput).toHaveValue('500'); 
    });
  });

  test('should reset the form fields to default values', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the Rate Calculator page and fill some data', async () => {
      await rateCalculatorPage.navigateTo(BASE_URL);
      await rateCalculatorPage.selectMonth('m03'); // Select March
      await rateCalculatorPage.enterPreviousMeterRead('500');
      await rateCalculatorPage.enterCurrentMeterRead('700');
      await rateCalculatorPage.selectServiceType('electricAndGas');

      // Verify data is filled before reset
      await expect(rateCalculatorPage.monthDropdown).toHaveValue('m03');
      await expect(rateCalculatorPage.previousReadInput).toHaveValue('500');
      await expect(rateCalculatorPage.currentReadInput).toHaveValue('700');
      await expect(rateCalculatorPage.electricAndGasServiceRadio).toBeChecked();
    });

    await test.step('Click Reset button', async () => {
      await rateCalculatorPage.clickReset();
    });

    await test.step('Verify fields are reset to default values', async () => {
      // According to catalog, default month is 'm06' (June) and inputs are '0'
      await expect(rateCalculatorPage.monthDropdown).toHaveValue('m06');
      await expect(rateCalculatorPage.previousReadInput).toHaveValue('0');
      await expect(rateCalculatorPage.currentReadInput).toHaveValue('0');
      // Default service type (assuming 'electric' is the initial checked state based on 'currentValue: E' for id 'e')
      await expect(rateCalculatorPage.electricServiceRadio).toBeChecked();
      await expect(rateCalculatorPage.electricAndGasServiceRadio).not.toBeChecked();
      await expect(rateCalculatorPage.estimatedElectricUseInput).toHaveValue('0');
      await expect(rateCalculatorPage.estimatedGasUseInput).toHaveValue('0'); 
    });
  });
});