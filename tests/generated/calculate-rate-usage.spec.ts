import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary

test.describe('Rate Calculator Functionality', () => {

    let calculatorPage: RateCalculatorPage;

    test.beforeEach(async ({ page }) => {
        calculatorPage = new RateCalculatorPage(page);
        // Assuming the base URL is configured in playwright.config.ts,
        // so we just navigate to the path. If not, provide full URL.
        await calculatorPage.navigate();
    });

    test('should calculate electric usage correctly for Electric service type', async () => {
        const monthValue = 'm07'; // July
        const previousRead = '1000';
        const currentRead = '1250';
        const expectedElectricUsage = '250'; // 1250 - 1000

        await calculatorPage.selectMonth(monthValue);
        await calculatorPage.enterPreviousRead(previousRead);
        await calculatorPage.enterCurrentRead(currentRead);
        await calculatorPage.selectElectricServiceType();
        await calculatorPage.clickCalculateButton();

        // Assertions in the test layer
        const estimatedElectricUse = await calculatorPage.getEstimatedElectricUse();
        expect(estimatedElectricUse).toBe(expectedElectricUsage);

        // Verify gas usage field state for electric-only service
        const isGasDisabled = await calculatorPage.isEstimatedGasUseFieldDisabled();
        expect(isGasDisabled).toBe(true); 
        const estimatedGasUse = await calculatorPage.getEstimatedGasUse();
        expect(estimatedGasUse).toBe('0'); // Should remain default '0' for electric-only
    });

    test('should calculate electric and gas usage correctly for Electric/Gas service type', async () => {
        const monthValue = 'm08'; // August
        const previousElectricRead = '2000';
        const currentElectricRead = '2500';
        // The catalog doesn't provide an input for gas read, assuming gas usage is auto-calculated.
        // We'll verify the output for gas usage here.
        const expectedElectricUsage = '500';
        const expectedGasUsage = '50'; // Arbitrary expected value for demonstration

        await calculatorPage.selectMonth(monthValue);
        await calculatorPage.enterPreviousRead(previousElectricRead);
        await calculatorPage.enterCurrentRead(currentElectricRead);
        await calculatorPage.selectElectricAndGasServiceType();
        
        await calculatorPage.clickCalculateButton();

        // Assertions in the test layer
        const estimatedElectricUse = await calculatorPage.getEstimatedElectricUse();
        expect(estimatedElectricUse).toBe(expectedElectricUsage);

        // Verify gas consumption output for Electric/Gas service type
        const estimatedGasUse = await calculatorPage.getEstimatedGasUse();
        expect(estimatedGasUse).toBe(expectedGasUsage); 
        
        // Re-checking the disabled state for consistency with the catalog's metadata for the output field.
        const isGasDisabled = await calculatorPage.isEstimatedGasUseFieldDisabled();
        expect(isGasDisabled).toBe(true); // Still disabled for display/output based on catalog
    });

    test('should reset the form fields to their initial state', async () => {
        // Fill some data to ensure reset works
        await calculatorPage.selectMonth('m10'); // October
        await calculatorPage.enterPreviousRead('500');
        await calculatorPage.enterCurrentRead('750');
        await calculatorPage.selectElectricAndGasServiceType();
        await calculatorPage.clickCalculateButton(); // To populate results before reset
        
        // Perform reset
        await calculatorPage.clickResetButton();

        // Verify fields are reset to their initial state (based on catalog default values)
        expect(await calculatorPage.getPreviousReadValue()).toBe('0');
        expect(await calculatorPage.getCurrentReadValue()).toBe('0');
        expect(await calculatorPage.getEstimatedElectricUse()).toBe('0');
        expect(await calculatorPage.getEstimatedGasUse()).toBe('0');
        expect(await calculatorPage.getSelectedMonthValue()).toBe('m06'); // Initial currentValue for month is 'm06'
        
        // Verify radio button selection (assuming 'E' electric-only is default upon reset)
        expect(await calculatorPage.isElectricServiceSelected()).toBe(true); // Assuming 'E' is the initial selected state from UI
        expect(await calculatorPage.isElectricAndGasServiceSelected()).toBe(false);
    });

});