import { test, expect } from '@playwright/test';
import { EnergyCostCalculatorPage } from '../pages/EnergyCostCalculatorPage';

test.describe('Energy Cost Calculator Page Verification', () => {
  const energyCostCalculatorUrl = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test('Verify Rate Calculator Visibility and Initial State', async ({ page }) => {
    const calculatorPage = new EnergyCostCalculatorPage(page);

    // Step 1: Navigate to the Energy Cost Calculator page.
    await test.step('Navigate to the Energy Cost Calculator page', async () => {
      await calculatorPage.navigateToCalculatorPage(energyCostCalculatorUrl);
      // Expected Result: Rate calculator section is visible on the page.
      await expect(await calculatorPage.isCalculatorSectionVisible()).toBeTruthy();
    });

    // Step 2: Check for default service type selection and available fields.
    await test.step('Check for default service type selection and available fields', async () => {
      // Expected Result: Service type dropdown is present;
      await expect(await calculatorPage.isMonthDropdownPresent()).toBeTruthy();
      expect(await calculatorPage.getMonthDefaultValue()).toBe('m06'); // June is default value 'm06'

      // Expected Result: Electric and Gas meter read fields are visible based on default selection.
      await expect(await calculatorPage.isPreviousReadFieldPresent()).toBeTruthy();
      expect(await calculatorPage.getPreviousReadDefaultValue()).toBe('0');

      await expect(await calculatorPage.isCurrentReadFieldPresent()).toBeTruthy();
      expect(await calculatorPage.getCurrentReadDefaultValue()).toBe('0');

      await expect(await calculatorPage.isEstimatedElectricUseFieldPresent()).toBeTruthy();
      expect(await calculatorPage.getEstimatedElectricUseDefaultValue()).toBe('0');

      // Verify default service type is 'Electric' (E) and gas consumption field is disabled.
      await expect(await calculatorPage.isElectricServiceTypeSelected()).toBeTruthy();
      await expect(await calculatorPage.isEstimatedGasUseFieldDisabled()).toBeTruthy();
    });
  });
});
