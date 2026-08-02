import { test, expect } from '@playwright/test';
import { EnergyCostCalculatorPage } from '../../pages/EnergyCostCalculatorPage'; // Adjust path as per your project structure

test.describe('Verify Rate Calculator Visibility and Initial State', () => {
    const ENERGY_CALCULATOR_URL = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

    test('Should display rate calculator and initial fields', async ({ page }) => {
        const calculatorPage = new EnergyCostCalculatorPage(page);

        // Step 1: Navigate to the Energy Cost Calculator page.
        // Input Data: URL: https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html
        // Expected Result: Rate calculator section is visible on the page.
        await test.step('Navigate to Energy Cost Calculator page and verify visibility', async () => {
            await calculatorPage.navigate(ENERGY_CALCULATOR_URL);
            await expect(calculatorPage.rateCalculatorContainer, 'Rate calculator section should be visible').toBeVisible();
        });

        // Step 2: Check for the presence of Service Type dropdown, Meter Read fields, and action buttons.
        // Input Data: N/A
        // Expected Result: Service Type dropdown, Electric/Gas Meter Read fields, Calculate button, and Reset button are all present.
        await test.step('Verify presence of key calculator fields and buttons', async () => {
            // Verify Service Type dropdown (Month dropdown as per catalog analysis)
            await expect(calculatorPage.monthDropdown, 'Month dropdown for service type should be visible').toBeVisible();

            // Verify Meter Read fields ('Enter Previous Read' and 'Enter Current Read')
            await expect(calculatorPage.previousReadInputField, 'Previous Read input field should be visible').toBeVisible();
            await expect(calculatorPage.currentReadInputField, 'Current Read input field should be visible').toBeVisible();

            // Verify Service Type radio buttons (Electric and Electric/Gas options)
            await expect(calculatorPage.electricServiceTypeRadio, 'Electric Service Type radio button should be visible').toBeVisible();
            await expect(calculatorPage.electricGasServiceTypeRadio, 'Electric/Gas Service Type radio button should be visible').toBeVisible();

            // Verify Action buttons
            await expect(calculatorPage.calculateButton, 'Calculate button should be visible').toBeVisible();
            await expect(calculatorPage.resetButton, 'Reset button should be visible').toBeVisible();
        });
    });
});