import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import

test.describe('Rate Calculator Functionality', () => {

    const BASE_URL = 'https://www.example.com/calculator'; // Placeholder URL

    test('should calculate electric usage correctly for Electric service', async ({ page }) => {
        const rateCalculatorPage = new RateCalculatorPage(page);

        // Step 1: Navigate to the Rate Calculator page
        await rateCalculatorPage.navigate(BASE_URL);

        // Step 2: Select a month (e.g., July - value 'm07')
        await rateCalculatorPage.selectMonth('m07');

        // Step 3: Enter previous meter read
        await rateCalculatorPage.enterPreviousRead('100');

        // Step 4: Enter current meter read
        await rateCalculatorPage.enterCurrentRead('200');

        // Step 5: Select Electric service type
        await rateCalculatorPage.selectElectricService();

        // Step 6: Click the Calculate button
        await rateCalculatorPage.clickCalculate();

        // Step 7: Verify the estimated electric use
        const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
        expect(estimatedElectricUse).toBe('100'); // Expected: Current Read - Previous Read

        // Step 8: Verify estimated gas use is disabled
        const isGasUseDisabled = await rateCalculatorPage.isEstimatedGasUseDisabled();
        expect(isGasUseDisabled).toBe(true);
    });

    test('should reset the form fields', async ({ page }) => {
        const rateCalculatorPage = new RateCalculatorPage(page);

        // Step 1: Navigate to the Rate Calculator page
        await rateCalculatorPage.navigate(BASE_URL);

        // Step 2: Fill some fields
        await rateCalculatorPage.selectMonth('m08'); // August
        await rateCalculatorPage.enterPreviousRead('50');
        await rateCalculatorPage.enterCurrentRead('150');
        await rateCalculatorPage.selectElectricService(); // Select Electric service type
        await rateCalculatorPage.clickCalculate(); // Calculate to populate the estimated field

        // Step 3: Click the Reset button
        await rateCalculatorPage.clickReset();

        // Step 4: Verify fields are reset (assuming default values)
        // Default month is 'm06' (June) as per catalog, default current/previous read is '0'
        await expect(rateCalculatorPage.monthDropdown).toHaveValue('m06'); // Verify dropdown reset to default
        await expect(rateCalculatorPage.previousReadInput).toHaveValue('0');
        await expect(rateCalculatorPage.currentReadInput).toHaveValue('0');
        await expect(rateCalculatorPage.estimatedElectricUseInput).toHaveValue('0');
        // Check if Electric service radio is still selected or default (assuming default is Electric)
        await expect(rateCalculatorPage.electricServiceRadio).toBeChecked();
    });

});