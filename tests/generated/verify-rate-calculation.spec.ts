import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import for Page Object

test.describe('Rate Calculator Functionality', () => {
  const baseURL = 'http://example.com/rate-calculator'; // Placeholder URL, replace with your application's actual URL

  test.beforeEach(async ({ page }) => {
    // Instantiate the Page Object and navigate to the base URL before each test
    const calculatorPage = new RateCalculatorPage(page);
    await calculatorPage.navigateTo(baseURL);
    // Assert that navigation was successful
    await expect(page).toHaveURL(baseURL);
  });

  test('should calculate electric usage correctly for a given month and reads', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    // Step 1: Select 'October' from the Month dropdown (value 'm10')
    await calculatorPage.selectMonth('m10');
    await expect(calculatorPage.monthDropdown).toHaveValue('m10'); // Keep assertions in the test layer

    // Step 2: Enter '1000' into the 'Enter Previous Read:' field
    await calculatorPage.enterPreviousRead('1000');
    await expect(calculatorPage.previousReadInput).toHaveValue('1000');

    // Step 3: Enter '1500' into the 'Enter Current Read:' field
    await calculatorPage.enterCurrentRead('1500');
    await expect(calculatorPage.currentReadInput).toHaveValue('1500');

    // Step 4: Ensure 'Electric' service type is selected (explicit for clarity, often default)
    await calculatorPage.selectElectricService();
    await expect(calculatorPage.electricServiceRadio).toBeChecked();

    // Step 5: Click the 'Calculate' button to perform the calculation
    await calculatorPage.clickCalculate();

    // Expected Result: 'Estimated Electric use (kWh):' should display '500' (1500 - 1000)
    await expect(calculatorPage.estimatedElectricUseInput).toBeVisible();
    await expect(calculatorPage.getEstimatedElectricUseValue()).resolves.toBe('500');

    // Expected Result: 'Estimated Gas use (Ccf):' should be disabled and display its default value '0'
    await expect(calculatorPage.estimatedGasUseInput).toBeDisabled();
    await expect(calculatorPage.getEstimatedGasUseValue()).resolves.toBe('0');
  });

  test('should reset the form fields to their initial state', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    // Action: Fill various fields with values to prepare for a reset operation
    await calculatorPage.selectMonth('m07');
    await calculatorPage.enterPreviousRead('200');
    await calculatorPage.enterCurrentRead('300');
    // Select Electric & Gas service to ensure it resets back to default (Electric)
    await calculatorPage.selectElectricAndGasService();

    // Verification: Assert that fields are currently filled/selected as expected before reset
    await expect(calculatorPage.monthDropdown).toHaveValue('m07');
    await expect(calculatorPage.previousReadInput).toHaveValue('200');
    await expect(calculatorPage.currentReadInput).toHaveValue('300');
    await expect(calculatorPage.electricGasServiceRadio).toBeChecked();

    // Action: Click the 'Reset' button
    await calculatorPage.clickReset();

    // Expected Result: Fields should revert to their default values as observed in the locator catalog
    await expect(calculatorPage.monthDropdown).toHaveValue('m06'); // Default 'June'
    await expect(calculatorPage.previousReadInput).toHaveValue('0'); // Default '0'
    await expect(calculatorPage.currentReadInput).toHaveValue('0'); // Default '0'
    await expect(calculatorPage.estimatedElectricUseInput).toHaveValue('0'); // Default '0'
    await expect(calculatorPage.electricServiceRadio).toBeChecked(); // Assuming 'Electric' is the default service type after reset
    await expect(calculatorPage.estimatedGasUseInput).toBeDisabled(); // Gas use should also be disabled again
  });

  test('should enable Estimated Gas use when Electric & Gas service is selected', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    // Verification: Initially, 'Estimated Gas use (Ccf):' input field should be disabled
    await expect(calculatorPage.estimatedGasUseInput).toBeDisabled();

    // Action: Select 'Electric & Gas' service type
    await calculatorPage.selectElectricAndGasService();
    await expect(calculatorPage.electricGasServiceRadio).toBeChecked();

    // Action: Click 'Calculate' to potentially trigger the enabling logic for Gas consumption
    // (Assuming UI logic dictates calculation must be performed to enable the field)
    await calculatorPage.clickCalculate();

    // Expected Result: 'Estimated Gas use (Ccf):' input field should become enabled
    await expect(calculatorPage.estimatedGasUseInput).toBeEnabled();
  });
}