import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator - Electric Bill Functionality', () => {
    const TEST_URL = 'http://localhost:3000/rate-calculator'; // Placeholder URL

    test('should calculate electric bill correctly for specified reads in July', async ({ page }) => {
        const rateCalculatorPage = new RateCalculatorPage(page);

        // Step 1: Navigate to the Rate Calculator page
        await rateCalculatorPage.navigateTo(TEST_URL);

        // Step 2: Select 'July' as the billing month (value 'm07' from catalog)
        await rateCalculatorPage.selectMonth('m07');

        // Step 3: Enter previous meter read
        await rateCalculatorPage.enterPreviousRead('1000');

        // Step 4: Enter current meter read
        await rateCalculatorPage.enterCurrentRead('1500');

        // Step 5: Select 'Electric' service type
        await rateCalculatorPage.selectElectricService();

        // Step 6: Click 'Calculate' button
        await rateCalculatorPage.clickCalculate();

        // Step 7: Verify estimated electric use (1500 - 1000 = 500)
        const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
        await expect(estimatedElectricUse).toBe('500');

        // Step 8: Verify estimated gas use is disabled and 0 as only electric was selected
        const isGasUseDisabled = await rateCalculatorPage.isEstimatedGasUseDisabled();
        expect(isGasUseDisabled).toBe(true); // Estimated Gas Use (Ccf) field is disabled
        const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
        await expect(estimatedGasUse).toBe('0');
    });

    test('should reset all form fields to default values', async ({ page }) => {
        const rateCalculatorPage = new RateCalculatorPage(page);

        await rateCalculatorPage.navigateTo(TEST_URL);
        
        // Populate fields with non-default values to ensure reset works
        await rateCalculatorPage.selectMonth('m07'); // Select July, default is June (m06)
        await rateCalculatorPage.enterPreviousRead('123'); // Default is '0'
        await rateCalculatorPage.enterCurrentRead('456');   // Default is '0'
        await rateCalculatorPage.selectElectricAndGasService(); // Default is likely 'Electric' or none

        // Click 'Reset' button
        await rateCalculatorPage.clickReset();

        // Verify fields are reset to their default currentValues from the catalog
        const selectedMonth = await rateCalculatorPage.getSelectedMonthValue();
        await expect(selectedMonth).toBe('m06'); // Default month is June

        const previousReadValue = await rateCalculatorPage.getPreviousReadValue();
        await expect(previousReadValue).toBe('0'); // Default value for Previous Read

        const currentReadValue = await rateCalculatorPage.getCurrentReadValue();
        await expect(currentReadValue).toBe('0');   // Default value for Current Read

        const estimatedElectricUseValue = await rateCalculatorPage.getEstimatedElectricUse();
        await expect(estimatedElectricUseValue).toBe('0'); // Default value for Estimated Electric use

        const estimatedGasUseValue = await rateCalculatorPage.getEstimatedGasUse();
        await expect(estimatedGasUseValue).toBe('0');      // Default value for Estimated Gas use

        const isElectricServiceChecked = await rateCalculatorPage.isElectricServiceSelected();
        await expect(isElectricServiceChecked).toBe(false); // Assuming reset clears radio selection

        const isElectricAndGasServiceChecked = await rateCalculatorPage.isElectricAndGasServiceSelected();
        await expect(isElectricAndGasServiceChecked).toBe(false); // Assuming reset clears radio selection
    });
});