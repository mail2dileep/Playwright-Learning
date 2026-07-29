import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage';

test.describe('Rate Calculator Reset Functionality', () => {
  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    // Assuming the base URL for the application is configured in playwright.config.ts,
    // otherwise provide the full URL here.
    await calculatorPage.navigate('/calculator'); // Placeholder URL for the calculator page
  });

  test('Verify Reset button clears all inputs and results', async () => {
    // Step 1: Enter values into the meter read fields and perform a calculation.
    // Input Data: Electric: 450, Gas: 150
    // We will set previous and current reads to achieve an electric consumption of 450.
    // To ensure potential gas calculation, we select 'Electric & Gas' service.
    await calculatorPage.selectServiceType('Electric & Gas');
    await calculatorPage.enterMeterReads('100', '550'); // Example: (550 Current - 100 Previous) = 450 kWh consumption
    await calculatorPage.calculateUsage();

    // Expected Result: Calculation result is displayed.
    // Assert that the estimated electric usage is no longer '0' (its initial default state).
    // The exact value '450' is an assumption for a simple calculation, but the primary check is that a calculation occurred.
    await expect(calculatorPage.getEstimatedElectricUsage()).resolves.not.toBe('0');

    // Step 2: Click the 'Reset' button.
    // Input Data: Click action
    await calculatorPage.resetCalculator();

    // Expected Result: All input fields are cleared and the calculated price display is removed.
    // Verify that meter read input fields are reset to their default '0' values.
    await expect(calculatorPage.getPreviousReadValue()).resolves.toBe('0');
    await expect(calculatorPage.getCurrentReadValue()).resolves.toBe('0');

    // Verify that estimated usage display fields are reset to '0'.
    await expect(calculatorPage.getEstimatedElectricUsage()).resolves.toBe('0');
    await expect(calculatorPage.getEstimatedGasUsage()).resolves.toBe('0'); // Gas field should also revert/stay '0'

    // Verify that the 'Month' dropdown is reset to its default value 'm06' (June).
    await expect(calculatorPage.getSelectedMonth()).resolves.toBe('m06');

    // Verify that the default service type radio button ('Electric' - id 'e') is checked after reset.
    await expect(calculatorPage.electricServiceRadio).toBeChecked();
  });
}