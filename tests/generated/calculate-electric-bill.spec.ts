import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import for project structure

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;
  const baseUrl = 'http://localhost:3000'; // Placeholder URL. Configure in playwright.config.ts or adjust as needed.

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigateTo(baseUrl);
  });

  test('should successfully calculate electric bill for a given month and meter reads', async () => {
    // Initial State Assertions
    await expect(rateCalculatorPage.getEstimatedElectricUseLocator()).toHaveValue('0');
    await expect(rateCalculatorPage.getEstimatedGasUseLocator()).toHaveValue('0');
    await expect(rateCalculatorPage.getEstimatedGasUseLocator()).toBeDisabled();
    // Based on the 'currentValue' in the catalog, 'E' (Electric) is the default checked option
    await expect(rateCalculatorPage.getElectricServiceTypeRadioLocator()).toBeChecked();
    await expect(rateCalculatorPage.getElectricAndGasServiceTypeRadioLocator()).not.toBeChecked();

    // Step 1: Select a specific month (July: 'm07')
    await rateCalculatorPage.selectMonth('m07');
    await expect(rateCalculatorPage.getMonthDropdownLocator()).toHaveValue('m07');

    // Step 2: Enter previous and current meter reads
    await rateCalculatorPage.enterPreviousRead('100');
    await expect(rateCalculatorPage.getPreviousReadInputLocator()).toHaveValue('100');

    await rateCalculatorPage.enterCurrentRead('250');
    await expect(rateCalculatorPage.getCurrentReadInputLocator()).toHaveValue('250');

    // Step 3: Ensure Electric service type is selected (it's default, but explicit action for robustness)
    await rateCalculatorPage.selectElectricServiceType(); 
    await expect(rateCalculatorPage.getElectricServiceTypeRadioLocator()).toBeChecked();
    await expect(rateCalculatorPage.getElectricAndGasServiceTypeRadioLocator()).not.toBeChecked();

    // Step 4: Click the Calculate button
    await rateCalculatorPage.clickCalculate();

    // Step 5: Verify estimated electric use is updated and is a positive value
    // The exact calculation logic is unknown, so we assert it's no longer the initial '0'
    const estimatedElectricUseValue = await rateCalculatorPage.getEstimatedElectricUseLocator().inputValue();
    expect(estimatedElectricUseValue).not.toBe('0');
    expect(parseInt(estimatedElectricUseValue)).toBeGreaterThan(0); // Assuming it's a numeric positive value

    // Step 6: Verify estimated gas use remains '0' and disabled as only electric service was selected
    await expect(rateCalculatorPage.getEstimatedGasUseLocator()).toHaveValue('0');
    await expect(rateCalculatorPage.getEstimatedGasUseLocator()).toBeDisabled();
  });

  test('should reset all form fields to default values', async () => {
    // Fill in some test data to ensure the reset functionality works correctly
    await rateCalculatorPage.selectMonth('m10'); // October
    await rateCalculatorPage.enterPreviousRead('50');
    await rateCalculatorPage.enterCurrentRead('150');
    await rateCalculatorPage.selectElectricAndGasServiceType(); // Select EG to ensure it resets to E

    // Verify fields are populated before reset, including selecting EG
    await expect(rateCalculatorPage.getMonthDropdownLocator()).toHaveValue('m10');
    await expect(rateCalculatorPage.getPreviousReadInputLocator()).toHaveValue('50');
    await expect(rateCalculatorPage.getCurrentReadInputLocator()).toHaveValue('150');
    await expect(rateCalculatorPage.getElectricAndGasServiceTypeRadioLocator()).toBeChecked();
    // Values for estimated use are 0 before calculation
    await expect(rateCalculatorPage.getEstimatedElectricUseLocator()).toHaveValue('0');
    await expect(rateCalculatorPage.getEstimatedGasUseLocator()).toHaveValue('0');

    // Click Calculate to get non-zero estimated values (if applicable) before reset
    await rateCalculatorPage.clickCalculate();
    // Assert that the electric use is updated to a non-zero value after calculation
    const electricUseAfterCalc = await rateCalculatorPage.getEstimatedElectricUseLocator().inputValue();
    expect(parseInt(electricUseAfterCalc)).toBeGreaterThan(0);
    // Gas use should also be updated since EG was selected
    const gasUseAfterCalc = await rateCalculatorPage.getEstimatedGasUseLocator().inputValue();
    expect(parseInt(gasUseAfterCalc)).toBeGreaterThan(0);

    // Action: Click Reset
    await rateCalculatorPage.clickReset();

    // Assertions: Verify fields are reset to their default initial values
    await expect(rateCalculatorPage.getMonthDropdownLocator()).toHaveValue('m06'); // Default is 'm06' (June) from catalog
    await expect(rateCalculatorPage.getPreviousReadInputLocator()).toHaveValue('0'); // Default is '0'
    await expect(rateCalculatorPage.getCurrentReadInputLocator()).toHaveValue('0'); // Default is '0'
    await expect(rateCalculatorPage.getEstimatedElectricUseLocator()).toHaveValue('0'); // Reset to '0'
    await expect(rateCalculatorPage.getEstimatedGasUseLocator()).toHaveValue('0'); // Reset to '0' (and remains disabled if only Electric is default)
    await expect(rateCalculatorPage.getEstimatedGasUseLocator()).toBeDisabled(); // Gas use should return to disabled state
    await expect(rateCalculatorPage.getElectricServiceTypeRadioLocator()).toBeChecked(); // Default 'E' should be checked
    await expect(rateCalculatorPage.getElectricAndGasServiceTypeRadioLocator()).not.toBeChecked(); // EG should be unchecked
  });
});