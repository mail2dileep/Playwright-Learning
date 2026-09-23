import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
    let rateCalculatorPage: RateCalculatorPage;

    test.beforeEach(async ({ page }) => {
        rateCalculatorPage = new RateCalculatorPage(page);
        // Assuming a base URL is configured in playwright.config.ts or passed via environment variables
        // For this example, we use a placeholder URL.
        await rateCalculatorPage.navigate('http://www.example.com/rate-calculator'); 
    });

    test('should calculate electric usage correctly and verify reset functionality', async () => {
        // Step 1: Select "July" for the month
        await rateCalculatorPage.selectMonth('m07');

        // Step 2: Enter "1000" for "Previous Read"
        await rateCalculatorPage.enterPreviousRead('1000');

        // Step 3: Enter "1200" for "Current Read"
        await rateCalculatorPage.enterCurrentRead('1200');

        // Step 4: Select "Electric" service type
        await rateCalculatorPage.selectServiceTypeElectric();
        await expect(await rateCalculatorPage.isElectricServiceTypeSelected()).toBe(true);
        await expect(await rateCalculatorPage.isElectricGasServiceTypeSelected()).toBe(false);

        // Step 5: Click "Calculate"
        await rateCalculatorPage.clickCalculate();

        // Step 6: Verify "Estimated Electric use (kWh):" is "200"
        const electricUse = await rateCalculatorPage.getEstimatedElectricUse();
        expect(electricUse).toBe('200');

        // Step 7: Verify "Estimated Gas use (Ccf):" remains "0" and is disabled
        const gasUse = await rateCalculatorPage.getEstimatedGasUse();
        expect(gasUse).toBe('0');
        await expect(rateCalculatorPage.isEstimatedGasUseInputDisabled()).resolves.toBe(true);

        // Step 8: Click "Reset"
        await rateCalculatorPage.clickReset();

        // Step 9: Verify all input fields are reset to their initial values
        expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
        expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
        expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06'); // Initial value from catalog
        expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
        expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
    });

    test('should allow selection of Electric/Gas service type and verify state', async () => {
        // Select Electric/Gas service type
        await rateCalculatorPage.selectServiceTypeElectricGas();
        
        // Verify that Electric/Gas is selected and Electric is not selected
        await expect(await rateCalculatorPage.isElectricGasServiceTypeSelected()).toBe(true);
        await expect(await rateCalculatorPage.isElectricServiceTypeSelected()).toBe(false);

        // Optionally, perform calculations with this service type
        await rateCalculatorPage.selectMonth('m10');
        await rateCalculatorPage.enterPreviousRead('500');
        await rateCalculatorPage.enterCurrentRead('700');
        await rateCalculatorPage.clickCalculate();

        // Verify electric usage is calculated (assuming 'eg' service type still calculates electric)
        expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('200');
        
        // And gas usage is still 0 and disabled, as per locator catalog, it is disabled.
        expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
        await expect(rateCalculatorPage.isEstimatedGasUseInputDisabled()).resolves.toBe(true);
    });
});