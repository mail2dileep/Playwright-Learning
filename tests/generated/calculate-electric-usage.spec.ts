import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality - Electric Service', () => {

    let rateCalculatorPage: RateCalculatorPage;

    test.beforeEach(async ({ page }) => {
        rateCalculatorPage = new RateCalculatorPage(page);
        // Assume a base URL is configured in playwright.config.ts
        // The navigateTo() method will append '/rate-calculator' to it.
        await rateCalculatorPage.navigateTo();
    });

    test('should calculate estimated electric usage correctly for Electric service type', async () => {
        // Step 1: Select billing month (October - value 'm10')
        await rateCalculatorPage.selectBillingMonth('m10'); 

        // Step 2: Enter previous meter read
        await rateCalculatorPage.enterPreviousRead('1000');

        // Step 3: Enter current meter read
        await rateCalculatorPage.enterCurrentRead('1500');

        // Step 4: Select Electric service type
        await rateCalculatorPage.selectServiceTypeElectric();

        // Step 5: Click Calculate
        await rateCalculatorPage.clickCalculate();

        // Step 6: Verify estimated electric use (1500 - 1000 = 500 kWh)
        const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
        expect(estimatedElectricUse).toBe('500');

        // Step 7: Verify estimated gas use is disabled and shows '0' as Electric service is selected
        expect(await rateCalculatorPage.isEstimatedGasUseDisabled()).toBe(true);
        const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
        expect(estimatedGasUse).toBe('0');
    });
});
