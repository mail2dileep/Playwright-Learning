import { test, expect, Page } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Initial State Verification', () => {
  const targetUrl = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test('should display all default fields and buttons correctly', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    // Step 1: Navigate to the CPS Energy Cost Calculator page.
    await calculatorPage.navigateToCalculatorPage(targetUrl);

    // Expected Result 1: Page loads and the Rate Calculator section is visible.
    // We assert visibility of a key element within the calculator section.
    await expect(calculatorPage.getMonthDropdownLocator()).toBeVisible();

    // Step 2: Check for default fields and buttons.

    // Expected Result 2: Service type dropdown, Meter Read fields, Calculate button, and Reset button are present.
    // Assert visibility of all required elements.
    await expect(calculatorPage.getMonthDropdownLocator()).toBeVisible();
    await expect(calculatorPage.getPreviousMeterReadInputLocator()).toBeVisible();
    await expect(calculatorPage.getCurrentMeterReadInputLocator()).toBeVisible();
    await expect(calculatorPage.getEstimatedElectricUseInputLocator()).toBeVisible();
    await expect(calculatorPage.getEstimatedGasUseInputLocator()).toBeVisible();
    await expect(calculatorPage.getElectricServiceRadioLocator()).toBeVisible();
    await expect(calculatorPage.getElectricGasServiceRadioLocator()).toBeVisible();
    await expect(calculatorPage.getCalculateButtonLocator()).toBeVisible();
    await expect(calculatorPage.getResetButtonLocator()).toBeVisible();

    // Additionally, assert default values and states where applicable from the catalog.
    await expect(calculatorPage.getMonthDropdownLocator()).toHaveValue('m06');
    await expect(calculatorPage.getPreviousMeterReadInputLocator()).toHaveValue('0');
    await expect(calculatorPage.getCurrentMeterReadInputLocator()).toHaveValue('0');
    await expect(calculatorPage.getEstimatedElectricUseInputLocator()).toHaveValue('0');

    // The 'Estimated Gas use (Ccf)' field is disabled by default per catalog.
    await expect(calculatorPage.getEstimatedGasUseInputLocator()).toBeDisabled();
    await expect(calculatorPage.getEstimatedGasUseInputLocator()).toHaveValue('0');

    // For radio buttons, we only assert visibility as the default 'checked' state is not explicitly defined in the catalog for 'radioGroup'.
    // If a specific radio button was explicitly marked as 'checked: true' or a default selection was described, we would add that assertion.
  });
});