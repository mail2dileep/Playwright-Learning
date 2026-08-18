import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage';

test.describe('Service Type Selection', () => {
    test('Verify Electric and Gas service type selection displays both meter read fields', async ({ page }) => {
        const calculatorPage = new CalculatorPage(page);

        // Assuming a navigation step to the calculator page is needed,
        // but not provided in the requirements or locators.
        // For demonstration, let's assume the test starts on the page.
        // await page.goto('/calculator-page-url'); // Placeholder: Replace with actual URL if known

        // Step 1: Select 'Electric and Gas' from the Service Type dropdown (radio button)
        await calculatorPage.selectServiceTypeElectricAndGas();

        // Expected Result: Both Electric Meter Read and Gas Meter Read fields are displayed.
        await expect(calculatorPage.getPreviousElectricMeterReadField()).toBeVisible();
        await expect(calculatorPage.getCurrentElectricMeterReadField()).toBeVisible();
        await expect(calculatorPage.getEstimatedGasUseField()).toBeVisible();
    });
});