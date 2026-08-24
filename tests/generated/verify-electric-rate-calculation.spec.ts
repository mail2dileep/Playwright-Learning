import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  const BASE_URL = 'https://www.example.com/rate-calculator'; // Placeholder URL, replace with actual URL

  test('should calculate electric bill correctly for electric service', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the Rate Calculator page', async () => {
      await rateCalculatorPage.navigateTo(BASE_URL);
      await expect(page).toHaveTitle(/Rate Calculator/); // Example assertion for page title
    });

    await test.step('Select July as the billing month', async () => {
      await rateCalculatorPage.selectMonth('m07');
      expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m07');
    });

    await test.step('Enter previous and current meter readings', async () => {
      await rateCalculatorPage.enterPreviousRead('1000');
      await rateCalculatorPage.enterCurrentRead('1500');
      expect(await rateCalculatorPage.getPreviousReadValue()).toBe('1000');
      expect(await rateCalculatorPage.getCurrentReadValue()).toBe('1500');
    });

    await test.step('Select Electric service type', async () => {
      await rateCalculatorPage.selectElectricService();
      await expect(rateCalculatorPage['electricServiceRadioButton']).toBeChecked(); // Direct locator access for assertion only
    });

    await test.step('Click Calculate button', async () => {
      await rateCalculatorPage.clickCalculate();
      // Add a wait for network requests or specific element visibility if needed post-calculation
    });

    await test.step('Verify estimated electric use and gas use disabled state', async () => {
      const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(estimatedElectricUse).toBe('500'); // Assuming Current - Previous = kWh

      const isGasUseFieldDisabled = await rateCalculatorPage.isEstimatedGasUseDisabled();
      expect(isGasUseFieldDisabled).toBe(true);
      expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0'); // Expect 0 if disabled and not used
    });
  });

  test('should allow resetting the calculator fields to default values', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the Rate Calculator page', async () => {
      await rateCalculatorPage.navigateTo(BASE_URL);
    });

    await test.step('Enter some data into the fields', async () => {
      await rateCalculatorPage.selectMonth('m08'); // August
      await rateCalculatorPage.enterPreviousRead('2000');
      await rateCalculatorPage.enterCurrentRead('2100');
      await rateCalculatorPage.selectElectricGasService(); // Select a different service type

      expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m08');
      expect(await rateCalculatorPage.getPreviousReadValue()).toBe('2000');
      expect(await rateCalculatorPage.getCurrentReadValue()).toBe('2100');
      await expect(rateCalculatorPage['electricGasServiceRadioButton']).toBeChecked();
    });

    await test.step('Click Reset button', async () => {
      await rateCalculatorPage.resetCalculator();
    });

    await test.step('Verify fields are reset to default values', async () => {
      // As per catalog, default month is 'm06' (June) and reads are '0'.
      expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06'); // Verify dropdown resets to default
      expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
      expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
      expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
      expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
      // Assuming 'e' (Electric) is the default selected radio button after reset.
      // The catalog says `currentValue: "E"` for the radio with `id: "e"`, which suggests it's the default.
      await expect(rateCalculatorPage['electricServiceRadioButton']).toBeChecked();
      await expect(rateCalculatorPage['electricGasServiceRadioButton']).not.toBeChecked();
    });
  });
});