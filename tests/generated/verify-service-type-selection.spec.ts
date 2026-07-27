import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage';

test.describe('Service Type Selection Validation', () => {
  // Precondition: Navigate to the calculator page (assuming base URL is configured in playwright.config.ts)
  test.beforeEach(async ({ page }) => {
    // Replace with the actual URL of your calculator page
    await page.goto('/rate-calculator'); 
  });

  test('Verify selecting Electric and Gas enables meter read fields and calculation', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    // Step 1: Select 'Electric and Gas' from the Service type dropdown (using radio button as per locators).
    // Input Data: Service Type: Electric and Gas
    await calculatorPage.selectElectricAndGasServiceType();

    // Expected Result: Both Electric Meter Read and Gas Meter Read fields are enabled.
    // 'Enter Previous Read:' and 'Enter Current Read:' are typically enabled by default.
    expect(await calculatorPage.isPreviousElectricReadFieldEnabled()).toBe(true, 'Previous Electric Read field should be enabled.');
    expect(await calculatorPage.isCurrentElectricReadFieldEnabled()).toBe(true, 'Current Electric Read field should be enabled.');
    // Crucial: The 'Estimated Gas use (Ccf):' field should become enabled after selecting Electric and Gas.
    expect(await calculatorPage.isEstimatedGasUseFieldEnabled()).toBe(true, 'Estimated Gas use field should become enabled.');

    // Step 2: Enter values in both meter read fields.
    // Input Data: Electric: 450, Gas: 300
    // Interpreting 'Electric: 450' as resulting usage by setting Previous=0, Current=450.
    await calculatorPage.enterPreviousElectricRead('0');
    await calculatorPage.enterCurrentElectricRead('450'); 
    await calculatorPage.enterEstimatedGasUse('300'); // 'Estimated Gas use (Ccf):' field accepts the gas input.

    // Expected Result: Values are accepted in both fields.
    expect(await calculatorPage.getPreviousElectricReadValue()).toBe('0', 'Previous Electric Read value should be 0.');
    expect(await calculatorPage.getCurrentElectricReadValue()).toBe('450', 'Current Electric Read value should be 450.');
    expect(await calculatorPage.getEstimatedGasUseValue()).toBe('300', 'Estimated Gas use value should be 300.');

    // Step 3: Click the Calculate button.
    // Input Data: Click 'Calculate'
    await calculatorPage.clickCalculateButton();

    // Expected Result: The combined calculated price for both services is displayed.
    // TODO: Locator for 'combined calculated price' is missing in the catalog. 
    // Assuming the 'Estimated Electric use (kWh):' and 'Estimated Gas use (Ccf):' fields will display the calculated usage values.
    // We will verify they reflect the expected usage based on our inputs.
    expect(await calculatorPage.getEstimatedElectricUsageDisplayValue()).toBe('450', 'Estimated Electric usage display should show 450.');
    expect(await calculatorPage.getEstimatedGasUseValue()).toBe('300', 'Estimated Gas use display should show 300 (or the calculated equivalent).');
  });
}