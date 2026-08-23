import { test, expect, Page } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary

test.describe('Rate Calculator Functionality', () => {
  const TEST_PAGE_URL = '/rate-calculator'; // Placeholder URL, replace with actual application URL

  test.beforeEach(async ({ page }) => {
    // Navigate to the calculator page before each test
    await page.goto(TEST_PAGE_URL);
  });

  test('should calculate estimated electric usage correctly for electric service type', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    // Step 1: Select a month
    await calculatorPage.selectMonth('m07'); // Select July
    await expect(calculatorPage.getMonthDropdown()).toHaveValue('m07');

    // Step 2: Enter previous and current meter reads
    await calculatorPage.enterPreviousRead('1000');
    await expect(calculatorPage.getPreviousReadInput()).toHaveValue('1000');

    await calculatorPage.enterCurrentRead('1500');
    await expect(calculatorPage.getCurrentReadInput()).toHaveValue('1500');

    // Step 3: Select 'Electric' service type
    await calculatorPage.selectServiceTypeElectric();
    await expect(calculatorPage.getServiceTypeElectricRadio()).toBeChecked();

    // Step 4: Click Calculate
    await calculatorPage.calculateBill();

    // Step 5: Verify the estimated electric use and that gas use is disabled
    // Assuming the calculation results in current - previous = 1500 - 1000 = 500 kWh
    await expect(calculatorPage.getEstimatedElectricUse()).toHaveValue('500');
    await expect(calculatorPage.getEstimatedGasUse()).toBeDisabled();
    await expect(calculatorPage.getServiceTypeElectricGasRadio()).not.toBeChecked();
  });

  test('should reset the calculator fields', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    // Perform some actions to populate fields
    await calculatorPage.selectMonth('m03'); // Select March
    await calculatorPage.enterPreviousRead('200');
    await calculatorPage.enterCurrentRead('350');
    await calculatorPage.selectServiceTypeElectricAndGas();

    // Assert fields are populated
    await expect(calculatorPage.getMonthDropdown()).toHaveValue('m03');
    await expect(calculatorPage.getPreviousReadInput()).toHaveValue('200');
    await expect(calculatorPage.getCurrentReadInput()).toHaveValue('350');
    await expect(calculatorPage.getServiceTypeElectricGasRadio()).toBeChecked();

    // Click Reset button
    await calculatorPage.resetCalculator();

    // Assert fields are reset to their default values (empty or initial '0')
    // The catalog shows default currentValues for inputs as '0' and month as 'm06'
    await expect(calculatorPage.getMonthDropdown()).toHaveValue('m06'); // Default value 'm06' (June)
    await expect(calculatorPage.getPreviousReadInput()).toHaveValue('0');
    await expect(calculatorPage.getCurrentReadInput()).toHaveValue('0');
    await expect(calculatorPage.getEstimatedElectricUse()).toHaveValue('0');
    await expect(calculatorPage.getEstimatedGasUse()).toHaveValue('0');
    // Radio buttons typically revert to an unchecked state or a default selection if available.
    // Assuming 'e' is the default/initial checked state for service type, or none if reset clears selection.
    // For this example, let's assume clearing results in 'e' being selected by default based on current app behavior or initial load.
    // If neither is checked, the assertion needs to check `not.toBeChecked()` for both or based on specific app reset behavior.
    // As per catalog, 'e' has currentValue 'E', 'eg' has 'EG'. No default checked state specified for radios directly.
    // Assuming a reset might default to Electric, or clear both.
    // For strict interpretation: catalog says current value 'E' for id 'e', so after reset it might default there.
    // Let's assume after reset, the app might revert to the initial state, where 'e' (Electric) might be the default if not explicitly selected.
    // However, a 'reset' often means all fields are cleared or set to their *initial* empty/default state.
    // If 'e' is initially selected on page load, then after reset, it might be re-selected.
    // For robustness, we check if the selected service type is not 'Electric and Gas'.
    await expect(calculatorPage.getServiceTypeElectricGasRadio()).not.toBeChecked();
  });

});
