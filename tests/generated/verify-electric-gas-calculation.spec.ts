import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage'; // Adjust path as necessary

test.describe('Electric and Gas Calculation Functionality', () => {
  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    // Assuming a base URL is configured in playwright.config.ts
    // Or navigate directly if URL is dynamic/not configured globally
    await calculatorPage.navigateTo('/calculator'); // Placeholder URL, update as needed
  });

  test('MTX-4278: Verify Electric and Gas Calculation', async ({ page }) => {
    const previousElectricRead = '400';
    const currentElectricRead = '200'; // This seems illogical if current is less than previous, but following provided input.

    // Step 1: Select 'Electric and Gas' from the Service type dropdown.
    // Input Data: Service Type: Electric and Gas
    await test.step('Step 1: Select Electric and Gas service type', async () => {
      await calculatorPage.selectElectricAndGasService();

      // Expected Result: Both Electric and Gas Meter Read fields are available.
      await expect(await calculatorPage.isPreviousElectricReadFieldVisible()).toBe(true, 'Previous Electric Read field should be visible.');
      await expect(await calculatorPage.isPreviousElectricReadFieldEnabled()).toBe(true, 'Previous Electric Read field should be enabled.');
      await expect(await calculatorPage.isCurrentElectricReadFieldVisible()).toBe(true, 'Current Electric Read field should be visible.');
      await expect(await calculatorPage.isCurrentElectricReadFieldEnabled()).toBe(true, 'Current Electric Read field should be enabled.');

      // The 'Estimated Gas use (Ccf):' field (gasconsumption) is cataloged as disabled and likely an output field.
      // We can only assert its visibility, not its enabled state for input based on the provided catalog.
      // There is no dedicated 'Gas Meter Read' input field in the catalog.
      await expect(await calculatorPage.isEstimatedGasUseFieldVisible()).toBe(true, 'Estimated Gas Use field should be visible.');
    });

    // Step 2: Enter values in 'Electric Meter Read' and 'Gas Meter Read' fields.
    // Input Data: Electric: 400, Gas: 200
    await test.step('Step 2: Enter values in Electric Meter Read fields', async () => {
      await calculatorPage.enterPreviousElectricRead(previousElectricRead);
      await calculatorPage.enterCurrentElectricRead(currentElectricRead);

      // TODO: Locator for 'Gas Meter Read' input field for entering values is not found in the catalog.
      // The 'Estimated Gas use (Ccf):' field is cataloged as disabled and an output field.

      // Expected Result: Values are accepted in both fields.
      await expect(await calculatorPage.getPreviousElectricReadValue()).toBe(previousElectricRead, 'Previous Electric Read value should be accepted.');
      await expect(await calculatorPage.getCurrentElectricReadValue()).toBe(currentElectricRead, 'Current Electric Read value should be accepted.');
    });

    // Step 3: Click the 'Calculate' button.
    // Input Data: N/A
    await test.step('Step 3: Click the Calculate button', async () => {
      await calculatorPage.clickCalculateButton();

      // Expected Result: The combined calculated price is displayed.
      // The catalog does not provide a specific locator for 'combined calculated price'.
      // Asserting visibility of related output fields for electric and gas usage.
      await expect(await calculatorPage.isEstimatedElectricUseFieldVisible()).toBe(true, 'Estimated Electric Use field should be visible after calculation.');
      await expect(await calculatorPage.isEstimatedGasUseFieldVisible()).toBe(true, 'Estimated Gas Use field should be visible after calculation.');
      // TODO: Specific locator for 'combined calculated price' is missing from the catalog.
    });
  });
});