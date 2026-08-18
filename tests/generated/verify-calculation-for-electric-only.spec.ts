import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Electric Only Service Calculation', () => {
    let rateCalculatorPage: RateCalculatorPage;

    test.beforeEach(async ({ page }) => {
        rateCalculatorPage = new RateCalculatorPage(page);
        // Assuming a base URL is configured in playwright.config.ts
        // Navigate to the Rate Calculator page
        await page.goto('/rate-calculator'); // Placeholder URL, adjust as needed
    });

    test('Verify calculation for Electric only service type', async () => {
        // Step 1: Select 'Electric only' service type.
        await test.step('Select "Electric only" service type', async () => {
            await rateCalculatorPage.selectElectricOnlyServiceType();

            // Expected Result: Electric input field is active.
            await expect(rateCalculatorPage.getEstimatedElectricUseInput(), 'Expected Estimated Electric use input to be enabled').toBeEnabled();
            // Also verify that Gas input field remains disabled as per its initial state and 'Electric only' selection
            await expect(rateCalculatorPage.getEstimatedGasUseInput(), 'Expected Estimated Gas use input to be disabled').toBeDisabled();
        });

        // Step 2: Enter a valid numeric value in the Estimated Electric use field.
        await test.step('Enter a valid numeric value in the Estimated Electric use (kWh) field', async () => {
            const electricUseValue = '500';
            await rateCalculatorPage.enterEstimatedElectricUse(electricUseValue);

            // Expected Result: Value is accepted.
            await expect(rateCalculatorPage.getEstimatedElectricUseInput(), 'Expected Estimated Electric use input to have the entered value').toHaveValue(electricUseValue);
        });

        // Step 3: Click the 'Calculate' button.
        await test.step('Click the "Calculate" button', async () => {
            await rateCalculatorPage.clickCalculateButton();

            // Expected Result: The calculated price is displayed to the user.
            // TODO: Assertion for calculated price display requires a specific locator.
            // The provided Locator Catalog does not contain an element for the calculated price display.
            // Cannot assert the display of the calculated price without a specific locator from the catalog.
        });
    });
});