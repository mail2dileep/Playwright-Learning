import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path based on project structure

test.describe('Rate Calculator Functionality', () => {
    let rateCalculatorPage: RateCalculatorPage;
    const baseURL = 'http://localhost:3000/rate-calculator'; // Placeholder URL for testing

    test.beforeEach(async ({ page }) => {
        rateCalculatorPage = new RateCalculatorPage(page);
        await rateCalculatorPage.navigate(baseURL);
    });

    test('should successfully calculate rates for Electric and Gas service', async () => {
        // Step 1: Select a month (e.g., July - m07)
        await rateCalculatorPage.selectMonth('m07');

        // Step 2: Enter previous read value
        await rateCalculatorPage.enterPreviousRead('1000');

        // Step 3: Enter current read value
        await rateCalculatorPage.enterCurrentRead('1500');

        // Step 4: Select Electric and Gas service
        await rateCalculatorPage.selectElectricAndGasService();

        // Step 5: Click Calculate
        await rateCalculatorPage.clickCalculate();

        // Step 6: Verify Estimated Electric use
        // Assuming calculation: Current Read - Previous Read = 1500 - 1000 = 500 kWh
        await expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('500');

        // Step 7: Verify Estimated Gas use is enabled and has a value
        await expect(await rateCalculatorPage.isEstimatedGasUseEnabled()).toBe(true);
        // Assuming a default or calculated gas usage (e.g., '10' for 500 kWh electric, if a flat value)
        await expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('10');
    });

    test('should reset form fields to initial state when Reset button is clicked', async () => {
        // Step 1: Populate some fields to change initial state
        await rateCalculatorPage.selectMonth('m08');
        await rateCalculatorPage.enterPreviousRead('2000');
        await rateCalculatorPage.enterCurrentRead('2100');
        await rateCalculatorPage.selectElectricService(); // Change service type

        // Step 2: Click the Reset button
        await rateCalculatorPage.clickReset();

        // Step 3: Verify fields are reset to their assumed initial default values
        // Initial month is 'm06' based on currentValue in catalog
        await expect(await rateCalculatorPage.getMonthValue()).toBe('m06');
        // Initial previous and current reads are '0'
        await expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
        await expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0'); // Should be '0' and likely disabled again
        await expect(await rateCalculatorPage.isEstimatedGasUseEnabled()).toBe(false); // Gas should be disabled again after reset
    });
});
