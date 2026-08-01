import { test, expect } from '@playwright/test';
import { EnergyCostCalculatorPage } from '../../pages/EnergyCostCalculatorPage';

test.describe('Energy Cost Calculator Page Functionality', () => {
  const calculatorUrl = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test('Validate Rate Calculator Visibility and Initial State (MTX-4433)', async ({ page }) => {
    const energyCostCalculatorPage = new EnergyCostCalculatorPage(page);

    await test.step('Step 1: Navigate to the Energy Cost Calculator page.', async () => {
      await energyCostCalculatorPage.navigate(calculatorUrl);
      // Expected Result: Rate calculator section is visible on the page.
      await expect(await energyCostCalculatorPage.isCalculatorSectionVisible()).toBeVisible();
    });

    await test.step('Step 2: Observe the default service type and available fields.', async () => {
      // Expected Result: Service type dropdown is present; Electric and Gas fields are displayed based on default selection.

      // Verify Month dropdown is present and has default value
      await expect(await energyCostCalculatorPage.getMonthDropdownLocator()).toBeVisible();
      await expect(await energyCostCalculatorPage.getSelectedMonth()).toEqual('m06'); // Default is 'm06' (June)

      // Verify Previous Read field is present and has default value
      await expect(await energyCostCalculatorPage.getPreviousReadInputLocator()).toBeVisible();
      await expect(await energyCostCalculatorPage.getPreviousReadValue()).toEqual('0');

      // Verify Current Read field is present and has default value
      await expect(await energyCostCalculatorPage.getCurrentReadInputLocator()).toBeVisible();
      await expect(await energyCostCalculatorPage.getCurrentReadValue()).toEqual('0');

      // Verify Estimated Electric use field is present and has default value
      await expect(await energyCostCalculatorPage.getEstimatedElectricUseInputLocator()).toBeVisible();
      await expect(await energyCostCalculatorPage.getEstimatedElectricUse()).toEqual('0');

      // Verify Estimated Gas use field is present, disabled, and has default value
      await expect(await energyCostCalculatorPage.getEstimatedGasUseFieldLocator()).toBeVisible();
      await expect(await energyCostCalculatorPage.getEstimatedGasUseFieldLocator()).toBeDisabled(); // Locator catalog says disabled: true
      await expect(await energyCostCalculatorPage.getEstimatedGasUse()).toEqual('0');

      // Verify default service type selection (Electric 'E' radio button)
      await expect(await energyCostCalculatorPage.isElectricServiceTypeSelected()).toBe(true);
      await expect(await energyCostCalculatorPage.isElectricAndGasServiceTypeSelected()).toBe(false);
    });
  });
}