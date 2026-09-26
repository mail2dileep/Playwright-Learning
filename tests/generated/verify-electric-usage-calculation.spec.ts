import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import

test.describe('Rate Calculator Functionality', () => {
  const BASE_URL = 'https://example.com/rate-calculator'; // Placeholder URL

  test('should calculate electric usage correctly for Electric Only service', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the rate calculator page', async () => {
      await rateCalculatorPage.navigateTo(BASE_URL);
      await expect(rateCalculatorPage.estimatedElectricUseInput).toBeVisible();
    });

    await test.step('Select "June" from the month dropdown', async () => {
      await rateCalculatorPage.selectMonth('m06'); // 'm06' is the value for June
    });

    await test.step('Enter previous meter read as "1000"', async () => {
      await rateCalculatorPage.enterPreviousRead('1000');
    });

    await test.step('Enter current meter read as "1200"', async () => {
      await rateCalculatorPage.enterCurrentRead('1200');
    });

    await test.step('Select "Electric Only" service', async () => {
      await rateCalculatorPage.selectElectricOnlyService();
    });

    await test.step('Click "Calculate"', async () => {
      await rateCalculatorPage.clickCalculate();
    });

    await test.step('Verify "Estimated Electric use (kWh)" is "200"', async () => {
      await expect(rateCalculatorPage.estimatedElectricUseInput).toHaveValue('200');
    });

    await test.step('Verify "Estimated Gas use (Ccf)" is disabled', async () => {
      await expect(rateCalculatorPage.isEstimatedGasUseDisabled()).resolves.toBe(true);
      await expect(rateCalculatorPage.estimatedGasUseInput).toHaveValue('0');
    });
  });

  test('should calculate electric usage correctly for Electric and Gas service', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the rate calculator page', async () => {
      await rateCalculatorPage.navigateTo(BASE_URL);
      await expect(rateCalculatorPage.estimatedElectricUseInput).toBeVisible();
    });

    await test.step('Select "September" from the month dropdown', async () => {
      await rateCalculatorPage.selectMonth('m09'); // 'm09' is the value for September
    });

    await test.step('Enter previous meter read as "500"', async () => {
      await rateCalculatorPage.enterPreviousRead('500');
    });

    await test.step('Enter current meter read as "800"', async () => {
      await rateCalculatorPage.enterCurrentRead('800');
    });

    await test.step('Select "Electric and Gas" service', async () => {
      await rateCalculatorPage.selectElectricAndGasService();
    });

    await test.step('Click "Calculate"', async () => {
      await rateCalculatorPage.clickCalculate();
    });

    await test.step('Verify "Estimated Electric use (kWh)" is "300"', async () => {
      await expect(rateCalculatorPage.estimatedElectricUseInput).toHaveValue('300');
    });

    await test.step('Verify "Estimated Gas use (Ccf)" is still disabled', async () => {
      await expect(rateCalculatorPage.isEstimatedGasUseDisabled()).resolves.toBe(true);
      await expect(rateCalculatorPage.estimatedGasUseInput).toHaveValue('0');
    });
  });

  test('should reset inputs when "Reset" button is clicked', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the rate calculator page', async () => {
      await rateCalculatorPage.navigateTo(BASE_URL);
      await expect(rateCalculatorPage.estimatedElectricUseInput).toBeVisible();
    });

    await test.step('Enter some values into the fields', async () => {
      await rateCalculatorPage.selectMonth('m07');
      await rateCalculatorPage.enterPreviousRead('500');
      await rateCalculatorPage.enterCurrentRead('600');
      await rateCalculatorPage.selectElectricAndGasService();
    });

    await test.step('Click "Reset"', async () => {
      await rateCalculatorPage.clickReset();
    });

    await test.step('Verify inputs are reset to initial values', async () => {
      await expect(rateCalculatorPage.monthDropdown).toHaveValue('m06'); // Default month is 'm06' (June) per catalog currentValue
      await expect(rateCalculatorPage.previousReadInput).toHaveValue('0');
      await expect(rateCalculatorPage.currentReadInput).toHaveValue('0');
      await expect(rateCalculatorPage.estimatedElectricUseInput).toHaveValue('0');
      await expect(rateCalculatorPage.isEstimatedGasUseDisabled()).resolves.toBe(true);
      await expect(rateCalculatorPage.estimatedGasUseInput).toHaveValue('0');
      await expect(rateCalculatorPage.electricOnlyRadio).toBeChecked(); // Assuming 'Electric Only' is the default radio selection
    });
  });
});
