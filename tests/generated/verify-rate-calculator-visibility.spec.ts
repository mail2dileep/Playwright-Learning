import { test, expect } from '@playwright/test';
import { EnergyCostCalculatorPage } from '../../pages/EnergyCostCalculatorPage'; // Adjust path as needed based on framework structure

test.describe('MTX-4506: Rate Calculator Visibility and Initial State', () => {
  const ENERGY_COST_CALCULATOR_URL = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test('should display rate calculator section and its elements correctly upon page load', async ({ page }) => {
    const energyCalculatorPage = new EnergyCostCalculatorPage(page);

    // Step 1: Navigate to the Energy Cost Calculator URL.
    await energyCalculatorPage.navigate(ENERGY_COST_CALCULATOR_URL);

    // Expected Result: The page loads successfully and the Rate Calculator section is visible.
    await expect(page).toHaveURL(ENERGY_COST_CALCULATOR_URL, { timeout: 10000 });
    await expect(energyCalculatorPage.isRateCalculatorSectionVisible()).resolves.toBe(true);

    // Step 2: Check for the presence of Service Type selection, Meter Read fields, Calculate button, and Reset button.
    // Expected Result: All UI elements are present and in their default state.

    // Service Type selection (Radio buttons)
    await expect(energyCalculatorPage.getElectricityServiceTypeRadio()).toBeVisible();
    await expect(energyCalculatorPage.getElectricityServiceTypeRadio()).toBeEnabled();
    await expect(energyCalculatorPage.getElectricityServiceTypeRadio()).toBeChecked(); // Based on currentValue: "E"
    await expect(energyCalculatorPage.getElectricityServiceTypeRadio()).toHaveAccessibleName('e'); // Accessible name for the radio button

    await expect(energyCalculatorPage.getElectricityGasServiceTypeRadio()).toBeVisible();
    await expect(energyCalculatorPage.getElectricityGasServiceTypeRadio()).toBeEnabled();
    await expect(energyCalculatorPage.getElectricityGasServiceTypeRadio()).not.toBeChecked(); // 'E' is default, so 'EG' should not be checked
    await expect(energyCalculatorPage.getElectricityGasServiceTypeRadio()).toHaveAccessibleName('eg'); // Accessible name for the radio button

    // Meter Read fields (Previous and Current Read, and Estimated Electric/Gas use)
    await expect(energyCalculatorPage.getPreviousReadInput()).toBeVisible();
    await expect(energyCalculatorPage.getPreviousReadInput()).toBeEnabled();
    await expect(energyCalculatorPage.getPreviousReadInput()).toHaveValue('0'); // Based on currentValue: "0"
    await expect(energyCalculatorPage.getPreviousReadInput()).toHaveAccessibleName('Enter Previous Read:');

    await expect(energyCalculatorPage.getCurrentReadInput()).toBeVisible();
    await expect(energyCalculatorPage.getCurrentReadInput()).toBeEnabled();
    await expect(energyCalculatorPage.getCurrentReadInput()).toHaveValue('0'); // Based on currentValue: "0"
    await expect(energyCalculatorPage.getCurrentReadInput()).toHaveAccessibleName('Enter Current Read:');

    await expect(energyCalculatorPage.getEstimatedElectricUseInput()).toBeVisible();
    await expect(energyCalculatorPage.getEstimatedElectricUseInput()).toBeEnabled();
    await expect(energyCalculatorPage.getEstimatedElectricUseInput()).toHaveValue('0'); // Based on currentValue: "0"
    await expect(energyCalculatorPage.getEstimatedElectricUseInput()).toHaveAccessibleName('Estimated Electric use (kWh):');

    // The Estimated Gas use field is disabled by default as per the locator catalog
    await expect(energyCalculatorPage.getEstimatedGasUseInput()).toBeVisible();
    await expect(energyCalculatorPage.getEstimatedGasUseInput()).toBeDisabled(); // Important: verify disabled state
    await expect(energyCalculatorPage.getEstimatedGasUseInput()).toHaveValue('0'); // Still has a default value
    await expect(energyCalculatorPage.getEstimatedGasUseInput()).toHaveAccessibleName('Estimated Gas use (Ccf):');

    // Month Dropdown
    await expect(energyCalculatorPage.getMonthDropdown()).toBeVisible();
    await expect(energyCalculatorPage.getMonthDropdown()).toBeEnabled();
    await expect(energyCalculatorPage.getMonthDropdown()).toHaveValue('m06'); // Based on currentValue: "m06" (June)
    await expect(energyCalculatorPage.getMonthDropdown()).toHaveAccessibleName('Month');

    // Calculate button
    await expect(energyCalculatorPage.getCalculateButton()).toBeVisible();
    await expect(energyCalculatorPage.getCalculateButton()).toBeEnabled();
    await expect(energyCalculatorPage.getCalculateButton()).toHaveText('Calculate');

    // Reset button
    await expect(energyCalculatorPage.getResetButton()).toBeVisible();
    await expect(energyCalculatorPage.getResetButton()).toBeEnabled();
    await expect(energyCalculatorPage.getResetButton()).toHaveText('Reset');

    // Optional: Check visibility/enablement of other buttons
    await expect(energyCalculatorPage.getHowToReadYourBillButton()).toBeVisible();
    await expect(energyCalculatorPage.getHowToReadYourBillButton()).toBeEnabled();
    await expect(energyCalculatorPage.getHowToFindUsageButton()).toBeVisible();
    await expect(energyCalculatorPage.getHowToFindUsageButton()).toBeEnabled();
  });
});
