import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
    let rateCalculatorPage: RateCalculatorPage;

    test.beforeEach(async ({ page }) => {
        rateCalculatorPage = new RateCalculatorPage(page);
        // In an enterprise setup, the base URL would typically be configured in playwright.config.ts
        // or passed via environment variables. For this example, we use a placeholder path.
        await page.goto('/rate-calculator'); // Placeholder URL path
    });

    test('should successfully calculate electric bill', async () => {
        // Step 1: Select 'July' as the billing month (value 'm07')
        await rateCalculatorPage.selectBillingMonth('m07');

        // Step 2: Enter '1000' for previous read
        await rateCalculatorPage.enterPreviousRead('1000');

        // Step 3: Enter '1200' for current read
        await rateCalculatorPage.enterCurrentRead('1200');

        // Step 4: Select 'Electric' service type
        await rateCalculatorPage.selectServiceType('Electric');

        // Step 5: Click 'Calculate'
        await rateCalculatorPage.clickCalculate();

        // Step 6: Verify 'Estimated Electric use (kWh):' is '200'
        const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
        expect(estimatedElectricUse).toBe('200');

        // Verify that gas consumption remains '0' as per catalog's current value for disabled field
        const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
        expect(estimatedGasUse).toBe('0');
    });

    test('should reset all form fields to their default state', async () => {
        // Populate some fields to test reset functionality
        await rateCalculatorPage.selectBillingMonth('m12'); // December
        await rateCalculatorPage.enterPreviousRead('500');
        await rateCalculatorPage.enterCurrentRead('600');
        await rateCalculatorPage.selectServiceType('Electric');
        await rateCalculatorPage.clickCalculate(); // Ensure values are set and calculated

        // Action: Click the Reset button
        await rateCalculatorPage.clickReset();

        // Verify all fields are reset to their initial state
        expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
        expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
        expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
        expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
        // As per the Locator Catalog, 'Month' dropdown's currentValue is 'm06' (June)
        expect(await rateCalculatorPage.getMonthDropdownValue()).toBe('m06');
    });
});
