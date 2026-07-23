import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary

test.describe('Energy Cost Calculator Page Functionality', () => {

    test('Verify Rate Calculator Visibility and Initial State', async ({ page }) => {
        const rateCalculatorPage = new RateCalculatorPage(page);

        // Step 1: Navigate to the Energy Cost Calculator page.
        // Input Data: https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html
        await rateCalculatorPage.navigate('https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html');

        // Expected Result: Rate calculator section is visible on the page.
        // Using the Calculate button as a proxy for the calculator section's visibility.
        await expect(rateCalculatorPage.getCalculateButtonLocator()).toBeVisible();

        // Step 2: Check for the presence of Service Type radio buttons, Meter Read fields, and Calculate/Reset buttons.
        // Expected Result: All UI elements are present as per the design.
        await expect(rateCalculatorPage.getElectricServiceTypeRadioLocator()).toBeVisible();
        await expect(rateCalculatorPage.getElectricAndGasServiceTypeRadioLocator()).toBeVisible();
        await expect(rateCalculatorPage.getMonthDropdownLocator()).toBeVisible();
        await expect(rateCalculatorPage.getPreviousReadInputLocator()).toBeVisible();
        await expect(rateCalculatorPage.getCurrentReadInputLocator()).toBeVisible();
        await expect(rateCalculatorPage.getEstimatedElectricUseInputLocator()).toBeVisible();
        await expect(rateCalculatorPage.getEstimatedGasUseInputLocator()).toBeVisible();
        await expect(rateCalculatorPage.getCalculateButtonLocator()).toBeVisible();
        await expect(rateCalculatorPage.getResetButtonLocator()).toBeVisible();
        
        // Verify the disabled state of Estimated Gas use input as per locator catalog metadata
        await expect(rateCalculatorPage.getEstimatedGasUseInputLocator()).toBeDisabled();
    });
});