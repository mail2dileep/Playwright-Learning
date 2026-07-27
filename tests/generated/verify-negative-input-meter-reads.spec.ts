import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage'; // Relative import

test.describe('Negative Input Validation for Meter Reads', () => {

  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    // Navigate to the page where the calculator is located.
    // For demonstration purposes, assuming the base URL is configured in playwright.config.ts
    // and the calculator is accessible, e.g., at the root path or after a specific navigation.
    // await page.goto('/calculator'); // Uncomment and modify if initial navigation is needed.
  });

  test('should prevent non-numeric input in Electric Meter Read and verify disabled Gas Meter Read behavior', async () => {
    // Step 1: Enter alphabetic characters in the Electric Meter Read field.
    // Input Data: Electric Meter Read: 'abc'
    // Expected Result: System prevents entry or displays a validation error.
    await test.step('Attempt to enter non-numeric value in Electric Meter Read', async () => {
      // Assuming 'Enter Previous Read:' is the target for 'Electric Meter Read field'.
      // Catalog shows 'currentValue: "0"', so clearing it first is good practice.
      await calculatorPage.enterPreviousMeterRead(''); 
      await calculatorPage.enterPreviousMeterRead('abc');
      const previousReadValue = await calculatorPage.getPreviousMeterReadValue();

      // Assert that the system prevented 'abc' from being entered.
      // Client-side validation typically strips non-numeric characters, reverts to a default,
      // or clears the input. We assert it's not the invalid string 'abc'.
      await expect(previousReadValue).not.toBe('abc');
      // If the field defaults to '0' on invalid input, assert that.
      await expect(previousReadValue).toBe('0'); 

      // TODO: If a specific error message locator was available in the catalog,
      // we would assert its visibility and content here.
      // For example: await expect(calculatorPage.getElectricMeterReadError()).toBeVisible();
    });

    // Step 2: Enter a negative value in the Gas Meter Read field.
    // Input Data: Gas Meter Read: -10
    // Expected Result: System displays a validation error indicating only positive numbers are allowed.
    await test.step('Verify Gas Meter Read field is disabled and cannot accept negative input', async () => {
      // The 'Estimated Gas use (Ccf):' field is marked as disabled in the Locator Catalog (disabled: true).
      // Strict rule: 'Do not interact with disabled elements unless a prior step explicitly enables them.'
      // As no enabling step is provided, we strictly verify its disabled state.
      await expect(calculatorPage.isEstimatedGasUseInputDisabled()).toBeTruthy();

      // Given the field is disabled, the 'Action: Enter a negative value in the Gas Meter Read field'
      // cannot be performed as input will not be accepted by the application.
      // Therefore, the expected validation error for 'only positive numbers' cannot be triggered 
      // by direct input into this field.

      // Assert that the value in the disabled field is not '-10', as no input was accepted.
      const gasUseValue = await calculatorPage.getEstimatedGasUseValue();
      await expect(gasUseValue).not.toBe('-10');
      // Based on the catalog 'currentValue: "0"' and it being disabled, it's expected to retain '0'.
      await expect(gasUseValue).toBe('0'); 

      // TODO: The expected result 'System displays a validation error...' cannot be fully verified 
      // because the field is disabled and does not accept input to trigger such a validation.
      // If the field were enabled, a locator for a validation message would be needed here.
    });
  });
});
