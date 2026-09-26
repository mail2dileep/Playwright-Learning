import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {

  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigateTo();
    // Assuming initial state where Electric is default selected or we explicitly select it
    await rateCalculatorPage.selectElectricService();
  });

  test('should calculate estimated electric usage correctly', async () => {
    // Step 1: Select a month (e.g., July)
    await rateCalculatorPage.selectMonth('m07'); // July option value from catalog
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m07');

    // Step 2: Enter Previous Read
    await rateCalculatorPage.enterPreviousRead('1000');
    // Verify input value (assertion in test layer)
    await expect(rateCalculatorPage.previousReadInput).toHaveValue('1000');

    // Step 3: Enter Current Read
    await rateCalculatorPage.enterCurrentRead('1500');
    // Verify input value
    await expect(rateCalculatorPage.currentReadInput).toHaveValue('1500');

    // Step 4: Click Calculate
    await rateCalculatorPage.clickCalculateButton();

    // Expected Result 1: Verify Estimated Electric use is updated
    // For this example, let's assume a simple calculation 1500-1000 = 500
    // In a real application, this would involve knowing the actual calculation logic or fixture data.
    await expect(rateCalculatorPage.estimatedElectricUseInput).toHaveValue('500'); // Assuming calculation happened
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('500');

    // Expected Result 2: Verify Estimated Gas use is disabled and its value
    expect(await rateCalculatorPage.isEstimatedGasUseDisabled()).toBe(true);
    await expect(rateCalculatorPage.estimatedGasUseInput).toHaveValue('0'); // Default value when disabled or not applicable
  });

  test('should reset all fields when reset button is clicked', async () => {
    // Fill some values first
    await rateCalculatorPage.selectMonth('m10'); // October
    await rateCalculatorPage.enterPreviousRead('200');
    await rateCalculatorPage.enterCurrentRead('300');
    await rateCalculatorPage.selectElectricAndGasService(); // Change service type

    // Verify fields are populated
    await expect(rateCalculatorPage.monthDropdown).toHaveValue('m10');
    await expect(rateCalculatorPage.previousReadInput).toHaveValue('200');
    await expect(rateCalculatorPage.currentReadInput).toHaveValue('300');
    await expect(rateCalculatorPage.electricAndGasServiceRadioButton).toBeChecked();

    // Step: Click Reset
    await rateCalculatorPage.clickResetButton();

    // Expected Result: Verify all fields are reset to their initial/default states
    // According to catalog, Month default is 'm06', Previous Read '0', Current Read '0'.
    await expect(rateCalculatorPage.monthDropdown).toHaveValue('m06'); // Default from catalog
    await expect(rateCalculatorPage.previousReadInput).toHaveValue('0'); // Default from catalog
    await expect(rateCalculatorPage.currentReadInput).toHaveValue('0'); // Default from catalog
    await expect(rateCalculatorPage.estimatedElectricUseInput).toHaveValue('0'); // Should be reset
    await expect(rateCalculatorPage.estimatedGasUseInput).toHaveValue('0'); // Should be reset
    await expect(rateCalculatorPage.electricServiceRadioButton).toBeChecked(); // Assuming Electric is the default selected service type on reset
  });
});