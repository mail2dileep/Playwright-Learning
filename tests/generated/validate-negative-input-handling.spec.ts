import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Negative Input Handling for Rate Calculator', () => {
  test('should validate non-numeric input in electric read and negative input in gas read (MTX-4433)', async ({ page }) => {
    // Assume navigation to the page is handled by a global setup or beforeEach hook,
    // or can be added explicitly here if needed: await page.goto('/your-calculator-url');
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Enter non-numeric characters into the Electric Meter Read field.
    await test.step('Enter non-numeric characters into the Electric Meter Read field', async () => {
      await rateCalculatorPage.enterPreviousElectricRead('ABC');
      // Expected Result: System prevents entry or displays a validation error message.
      // Assuming the field either prevents non-numeric input or clears it, verify it does not contain 'ABC'.
      await expect(rateCalculatorPage.getPreviousElectricReadValue()).not.toContain('ABC');
      // Additionally, if the field is expected to be empty or '0' after invalid input:
      // await expect(rateCalculatorPage.getPreviousElectricReadValue()).toBe('');
      // await expect(rateCalculatorPage.getPreviousElectricReadValue()).toBe('0');
    });

    // Before Step 2, ensure the Gas field is enabled by selecting 'Electric & Gas' service type.
    await test.step('Select Electric & Gas service type to enable gas input field', async () => {
      await rateCalculatorPage.selectElectricAndGasServiceType();
      // It's good practice to add an assertion here to ensure the field is indeed enabled
      await expect(rateCalculatorPage.estimatedGasUseOutput).toBeEnabled();
    });

    // Step 2: Enter a negative value into the Gas Meter Read field.
    await test.step('Attempt to enter a negative value into the Estimated Gas use (Ccf) field', async () => {
      await rateCalculatorPage.enterEstimatedGasUse('-10');
      // Expected Result: System displays a validation error indicating only positive values are allowed.
      // Assuming the field either rejects the negative value or defaults to a valid (e.g., positive or zero) value.
      await expect(rateCalculatorPage.getEstimatedGasUseValue()).not.toContain('-');
      await expect(rateCalculatorPage.getEstimatedGasUseValue()).toBe('0'); // Common behavior for number inputs with negative input
    });

    // Optionally, click calculate and assert no error messages appear if not explicitly defined by a locator in catalog
    // await rateCalculatorPage.clickCalculate();
    // await expect(page.locator('.error-message-for-gas-read')).not.toBeVisible(); // If such a locator existed
  });
});