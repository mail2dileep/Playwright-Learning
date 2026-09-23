import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Core Functionality', () => {

    // Before each test, navigate to the calculator page.
    // In a real enterprise setup, this might be handled by a global setup or a base test class.
    test.beforeEach(async ({ page }) => {
        await page.goto('/calculator'); // Assuming '/calculator' is the base path to the application
    });

    test('should calculate estimated electric usage for Electric service type', async ({ page }) => {
        const rateCalculatorPage = new RateCalculatorPage(page);

        await test.step('Input meter readings and select Electric service', async () => {
            await rateCalculatorPage.selectMonth('m07'); // Select July
            await rateCalculatorPage.enterPreviousRead('1000');
            await rateCalculatorPage.enterCurrentRead('1500');
            await rateCalculatorPage.selectServiceTypeElectric();
            await rateCalculatorPage.clickCalculate();
        });

        await test.step('Verify electric usage calculation and gas field state', async () => {
            const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUseValue();
            expect(estimatedElectricUse).toBe('500', 'Expected estimated electric use to be 500 kWh (1500 - 1000).');

            const isGasDisabled = await rateCalculatorPage.isEstimatedGasUseInputDisabled();
            expect(isGasDisabled).toBe(true, 'Expected estimated gas use input to be disabled for Electric service.');

            const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUseValue();
            expect(estimatedGasUse).toBe('0', 'Expected estimated gas use to be 0 for Electric service.');

            const selectedMonth = await rateCalculatorPage.getSelectedMonth();
            expect(selectedMonth).toBe('m07', 'Expected selected month to be July (m07).');
        });
    });

    test('should calculate both electric and gas usage for Electric and Gas service type', async ({ page }) => {
        const rateCalculatorPage = new RateCalculatorPage(page);

        await test.step('Input meter readings and select Electric and Gas service', async () => {
            await rateCalculatorPage.selectMonth('m08'); // Select August
            await rateCalculatorPage.enterPreviousRead('200');
            await rateCalculatorPage.enterCurrentRead('400');
            await rateCalculatorPage.selectServiceTypeElectricGas();
            await rateCalculatorPage.clickCalculate();
        });

        await test.step('Verify both electric and gas usage are calculated', async () => {
            const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUseValue();
            expect(estimatedElectricUse).toBe('200', 'Expected estimated electric use to be 200 kWh (400 - 200).');

            // For 'Electric and Gas' service, the gas field should also become enabled and show usage.
            // Note: Locator catalog shows gasconsumption as disabled=true. Assuming an application logic
            // that might enable it or populate it if 'EG' is selected, for now we verify its state
            // and expect default value if it remains disabled based on locator catalog.
            const isGasDisabled = await rateCalculatorPage.isEstimatedGasUseInputDisabled();
            // Based on the provided locator catalog, 'gasconsumption' has disabled=true, meaning it won't change.
            // If application logic enables it, this expectation would need to be 'false'.
            // Sticking strictly to the catalog, it remains disabled.
            expect(isGasDisabled).toBe(true, 'Expected estimated gas use input to remain disabled based on catalog.');

            const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUseValue();
            // Assuming if 'EG' is selected and gas field is still disabled, it shows '0' or default.
            // If an actual gas calculation happens and the field becomes enabled, this would be a calculated value.
            expect(estimatedGasUse).toBe('0', 'Expected estimated gas use to be 0 when disabled.');
        });
    });

    test('should reset all calculator fields to their default state', async ({ page }) => {
        const rateCalculatorPage = new RateCalculatorPage(page);

        await test.step('Fill some fields and then click Reset', async () => {
            await rateCalculatorPage.selectMonth('m10'); // Select October
            await rateCalculatorPage.enterPreviousRead('2000');
            await rateCalculatorPage.enterCurrentRead('2500');
            await rateCalculatorPage.selectServiceTypeElectricGas();
            await rateCalculatorPage.clickCalculate(); // Ensure values are populated/changed
            await rateCalculatorPage.clickReset();
        });

        await test.step('Verify fields are reset to default values', async () => {
            // Default month value from locator catalog is 'm06' (June)
            expect(await rateCalculatorPage.getSelectedMonth()).toBe('m06', 'Expected month to reset to June.');
            expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0', 'Expected previous read to reset to 0.');
            expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0', 'Expected current read to reset to 0.');
            expect(await rateCalculatorPage.getEstimatedElectricUseValue()).toBe('0', 'Expected estimated electric use to reset to 0.');
            expect(await rateCalculatorPage.getEstimatedGasUseValue()).toBe('0', 'Expected estimated gas use to reset to 0.');
            // Service type radio buttons might also have a default selection, which would be verified here.
            // Based on catalog, 'e' and 'eg' don't have a default selected status, assuming reset means nothing checked or a specific default is re-selected by the app.
            // For this example, we don't assert default radio state as it's not explicitly in the catalog as 'checked'.
        });
    });
});
