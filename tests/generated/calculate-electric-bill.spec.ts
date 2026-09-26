import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage'; // Relative import adjusted for structure

test.describe('Rate Calculator Functionality', () => {

    let calculatorPage: CalculatorPage;

    test.beforeEach(async ({ page }) => {
        calculatorPage = new CalculatorPage(page);
        // Assuming a base URL is configured in playwright.config.ts
        // If not, you'd navigate here:
        // await calculatorPage.navigateTo('/your-calculator-page-path');
        await page.goto('/calculator-path'); // Placeholder path for demonstration
        await page.waitForLoadState('domcontentloaded'); // Ensure page is loaded
    });

    test('should successfully calculate electric usage and verify gas input state', async () => {
        // Step 1: Select July as the billing month
        await calculatorPage.selectBillingMonth('m07');

        // Step 2: Enter previous meter read
        await calculatorPage.enterPreviousMeterRead('1000');

        // Step 3: Enter current meter read
        await calculatorPage.enterCurrentMeterRead('1500');

        // Step 4: Select Electric service type
        await calculatorPage.selectServiceType('Electric');

        // Step 5: Click the Calculate button
        await calculatorPage.clickCalculate();

        // Expected Result 1: Verify estimated electric use
        const estimatedElectricUse = await calculatorPage.getEstimatedElectricUse();
        expect(estimatedElectricUse).toBe('500'); // Assuming the calculation result is 1500 - 1000 = 500

        // Expected Result 2: Verify estimated gas use input is disabled
        const isGasInputDisabled = await calculatorPage.isEstimatedGasUseInputDisabled();
        expect(isGasInputDisabled).toBe(true);

        // Optional: Verify default month is not 'm06' anymore
        const currentMonth = await calculatorPage.getCurrentSelectedMonth();
        expect(currentMonth).toBe('m07');
    });

    test('should allow resetting the calculator (Placeholder - Reset button not covered in catalog requirements)', async () => {
        // This test demonstrates how to structure, but the 'Reset' button (id: rateCalCancelBtn)
        // was not explicitly included in the test steps, though it exists in the catalog.
        // If a test step explicitly asked to click 'Reset', a method would be added to Page Object.
        // For now, focusing on the core calculation.
        // If we were to test reset, we would have:
        // await calculatorPage.enterPreviousMeterRead('999');
        // await calculatorPage.clickReset(); // Assuming a clickReset() method exists
        // expect(await calculatorPage.getPreviousMeterRead()).toBe('0'); // Assuming getter method and reset to default
        test.skip(true, 'Reset button functionality not explicitly requested in test steps.');
    });

    test('should calculate electric and gas usage if selected (Placeholder)', async () => {
        // This test would cover the 'ElectricAndGas' service type
        test.skip(true, 'Electric and Gas calculation not explicitly requested in test steps.');
        // await calculatorPage.selectBillingMonth('m08');
        // await calculatorPage.enterPreviousMeterRead('2000');
        // await calculatorPage.enterCurrentMeterRead('2200');
        // await calculatorPage.selectServiceType('ElectricAndGas');
        // await calculatorPage.clickCalculate();
        // expect(await calculatorPage.getEstimatedElectricUse()).toBe('200');
        // // Would also need to assert gas consumption if it becomes enabled and has a value
        // expect(await calculatorPage.isEstimatedGasUseInputDisabled()).toBe(false); // Should be enabled for EG
    });

});