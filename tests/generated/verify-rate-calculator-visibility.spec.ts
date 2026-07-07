import { test, expect } from '@playwright/test';
import { EnergyCostCalculatorPage } from '../../pages/EnergyCostCalculatorPage'; // Adjust path as needed

test.describe('Energy Cost Calculator Functionality', () => {
  const ENERGY_CALCULATOR_URL = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test('Verify Rate Calculator Visibility and Initial State - MTX-4506', async ({ page }) => {
    const energyCostCalculatorPage = new EnergyCostCalculatorPage(page);

    // Step 1: Navigate to the Energy Cost Calculator URL.
    await energyCostCalculatorPage.navigate(ENERGY_CALCULATOR_URL);

    // Expected Result 1: The page loads successfully and the Rate Calculator section is visible.
    // Assert that the page URL is correct.
    await expect(page).toHaveURL(ENERGY_CALCULATOR_URL);
    // Assert that a prominent element within the Rate Calculator section is visible, implying the section itself is loaded.
    await expect(energyCostCalculatorPage.getCalculateButtonLocator()).toBeVisible();

    // Step 2: Verify the presence of Service Type dropdown, Meter Read fields, Calculate button, and Reset button.

    // Verify the 'Service Type' related elements (Month dropdown and service type radio buttons).
    await expect(energyCostCalculatorPage.getMonthDropdownLocator()).toBeVisible();
    await expect(energyCostCalculatorPage.getElectricServiceTypeRadioLocator()).toBeVisible();
    await expect(energyCostCalculatorPage.getElectricGasServiceTypeRadioLocator()).toBeVisible();

    // Verify the 'Meter Read' fields.
    await expect(energyCostCalculatorPage.getPreviousReadInputLocator()).toBeVisible();
    await expect(energyCostCalculatorPage.getCurrentReadInputLocator()).toBeVisible();

    // Verify the 'Calculate' button.
    await expect(energyCostCalculatorPage.getCalculateButtonLocator()).toBeVisible();

    // Verify the 'Reset' button.
    await expect(energyCostCalculatorPage.getResetButtonLocator()).toBeVisible();

    // Expected Result 2: All specified elements are present and visible to the user.
    // Additionally, verify initial state elements based on the catalog data:
    // 'Electric' service type radio button should be checked by default (currentValue: 'E' for id: 'e').
    await expect(energyCostCalculatorPage.getElectricServiceTypeRadioLocator()).toBeChecked();

    // 'Estimated Electric use (kWh)' field should be enabled (disabled: false).
    await expect(energyCostCalculatorPage.getEstimatedElectricUseInputLocator()).toBeEnabled();

    // 'Estimated Gas use (Ccf)' field should be disabled (disabled: true).
    await expect(energyCostCalculatorPage.getEstimatedGasUseInputLocator()).toBeDisabled();
  });
});