import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage'; // Adjust path as necessary

test.describe('Calculator Functionality', () => {

    let calculatorPage: CalculatorPage;

    test.beforeEach(async ({ page }) => {
        calculatorPage = new CalculatorPage(page);
        // Assuming the test starts on the calculator page or navigates there via baseURL
        // If not, add page.goto('URL_TO_CALCULATOR_PAGE'); here. Example:
        await page.goto('/calculator');
    });

    test('Validate Calculation for Electric and Gas Service', async ({ page }) => {
        // Step 1: Select 'Electric and Gas' from the Service Type dropdown (radio button)
        await test.step('Select Electric and Gas service type', async () => {
            await calculatorPage.selectElectricAndGasServiceType();
            // Expected Result: Both Electric Meter Read and Gas Meter Read fields are enabled.
            // Based on locators, 'Estimated Gas use (Ccf):' field is initially disabled.
            // We verify it becomes enabled upon selecting 'Electric and Gas' service type.
            await expect(await calculatorPage.isEstimatedGasUseFieldEnabled()).toBe(true, 'Expected Estimated Gas use field to be enabled.');
            // The 'Estimated Electric use (kWh):' field is typically always enabled, so no explicit check needed here.
        });

        // Step 2: Enter valid values in both meter read fields
        await test.step('Enter valid values in both estimated usage fields', async () => {
            await calculatorPage.enterEstimatedElectricUse('450'); // 'Electric Meter Read: 450'
            await calculatorPage.enterEstimatedGasUse('120');    // 'Gas Meter Read: 120'
            // Expected Result: Values are accepted in both fields.
            await expect(calculatorPage.getEstimatedElectricUseValue()).toEqual('450');
            await expect(calculatorPage.getEstimatedGasUseValue()).toEqual('120');
        });

        // Step 3: Click the Calculate button
        await test.step('Click the Calculate button', async () => {
            await calculatorPage.clickCalculateButton();
            // Expected Result: The combined calculated price for both services is displayed.
            // TODO: Assertion for combined calculated price is missing as no specific locator was provided
            // in the catalog for the calculation result display. A more robust assertion would check a specific
            // element displaying the total price, or other relevant output values.
        });
    });
});