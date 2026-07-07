import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage';

test.describe('Service Calculator Functionality', () => {
  const ELECTRIC_READ_VALUE = '450';
  const GAS_USE_VALUE = '120';

  test('Validate Calculation for Electric and Gas Service', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    // Assume navigation to the calculator page is handled globally or prior to this test.
    // For example: await page.goto('/your-calculator-url');
    // For demonstration, we'll proceed assuming the page is loaded.

    // Step 1: Select 'Electric and Gas' from the Service type dropdown (radio button).
    await test.step("Select 'Electric and Gas' service type", async () => {
      await calculatorPage.selectElectricAndGasServiceType();
      // Expected Result: Both 'Electric Meter Read' and 'Gas Meter Read' fields are enabled.
      // 'Enter Current Read:' is enabled by default (checked in locator catalog: disabled=false).
      // 'Estimated Gas use (Ccf):' is disabled by default (checked in locator catalog: disabled=true),
      // so we verify it becomes enabled after selecting 'Electric and Gas' service.
      await expect(await calculatorPage.isGasEstimatedUseFieldEnabled()).toBe(true);
    });

    // Step 2: Enter valid numeric values in both meter read fields.
    await test.step('Enter electric and gas meter read values', async () => {
      await calculatorPage.enterElectricCurrentRead(ELECTRIC_READ_VALUE);
      await calculatorPage.enterGasEstimatedUse(GAS_USE_VALUE);
      // Expected Result: Values are accepted in both fields.
      await expect(await calculatorPage.getElectricCurrentReadValue()).toEqual(ELECTRIC_READ_VALUE);
      await expect(await calculatorPage.getGasEstimatedUseValue()).toEqual(GAS_USE_VALUE);
    });

    // Step 3: Click on the 'Calculate' button.
    await test.step('Click on the Calculate button', async () => {
      await calculatorPage.clickCalculateButton();
      // Expected Result: The combined calculated price for both services is displayed.
      // TODO: No locator found in catalog for the combined calculated price display.
      // A specific assertion for the displayed price would go here once a locator is available.
      // Example: await expect(calculatorPage.getCalculatedPrice()).toContain('$123.45');
    });
  });
});