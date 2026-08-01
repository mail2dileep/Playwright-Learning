import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('MTX-4278: Validate Electric Only Service Type Calculation', () => {

    test('should allow electric only service type calculation', async ({ page }) => {
        const rateCalculatorPage = new RateCalculatorPage(page);

        // Navigate to the calculator page (assuming base URL is configured or provided).
        // For this exercise, we assume the page is already loaded or navigation is handled elsewhere (e.g., global setup).
        // await page.goto('/calculator'); // Example: Uncomment and adjust if navigation is needed here.

        // Step 1: Select 'Electric only' service type.
        // Action: Select 'Electric only' from the Service Type dropdown.
        // (Using radio button as per available locators for 'servicetype' group).
        await rateCalculatorPage.selectServiceTypeElectricOnly();

        // Expected Result: Electric Meter Read field is enabled; Gas Meter Read field is disabled or hidden.
        await expect(await rateCalculatorPage.isEstimatedElectricUseInputEnabled()).toBe(true);
        await expect(await rateCalculatorPage.isEstimatedGasUseInputDisabled()).toBe(true);

        // Step 2: Enter a valid numeric value in the Electric Meter Read field.
        // Input Data: Electric Meter Read: 500
        const electricUsageValue = '500';
        await rateCalculatorPage.enterEstimatedElectricUsage(electricUsageValue);

        // Expected Result: Value is accepted in the field.
        await expect(await rateCalculatorPage.getEstimatedElectricUsageValue()).toBe(electricUsageValue);

        // Step 3: Click the 'Calculate' button.
        // Input Data: Click action
        await rateCalculatorPage.clickCalculateButton();

        // Expected Result: The calculated price for electric service is displayed to the user.
        // TODO: Locator for 'calculated price' is not available in the provided catalog.
        // A specific locator is required to verify the display of the calculated price.
        // For now, we assume the calculation completes successfully without specific price validation.
        console.log('Calculation action performed. Verification of \"calculated price\" skipped due to missing locator in catalog.');
    });
});
