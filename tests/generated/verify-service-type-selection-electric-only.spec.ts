import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Verify Service Type Selection - Electric Only', () => {

    test('should enable electric fields and disable gas fields when "Electric only" is selected', async ({ page }) => {
        const rateCalculatorPage = new RateCalculatorPage(page);

        // Navigate to the Rate Calculator page if not already there.
        // For this exercise, we assume the base URL is configured and the page is loaded.
        // await page.goto('/rate-calculator'); // Example navigation

        // Step 1: Select 'Electric only' from the Service type options.
        // Input Data: Service Type: Electric only
        await rateCalculatorPage.selectServiceTypeElectricOnly();

        // Expected Result: Electric Meter Read field is enabled; Gas Meter Read field is disabled or hidden.
        await expect(await rateCalculatorPage.isCurrentMeterReadInputEnabled()).toBe(true);
        await expect(await rateCalculatorPage.isEstimatedGasUseInputEnabled()).toBe(false);

        // Step 2: Enter a value in the Electric Meter Read field.
        // Input Data: Electric Meter Read: 500
        await rateCalculatorPage.enterCurrentMeterRead('500');

        // Expected Result: Value is accepted in the field.
        await expect(rateCalculatorPage.getCurrentMeterReadInputLocator()).toHaveValue('500');

        // Step 3: Click the Calculate button.
        // Input Data: Click 'Calculate'
        await rateCalculatorPage.clickCalculateButton();

        // Expected Result: The calculated price for electric service is displayed.
        // TODO: Assert calculated price is displayed. Locator for the calculated price display element
        // was not found in the provided Locator Catalog. Add specific assertion once locator is available.
        // Example: await expect(rateCalculatorPage.getCalculatedPriceDisplayElement()).toBeVisible();
        // Example: await expect(rateCalculatorPage.getCalculatedPriceText()).toContain('123.45');
    });
});
