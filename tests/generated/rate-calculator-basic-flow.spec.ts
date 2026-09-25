import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed

test.describe('Rate Calculator Functionality', () => {
    let rateCalculatorPage: RateCalculatorPage;
    const calculatorUrl = '/calculator_current'; // Assuming base URL is configured in playwright.config.ts

    test.beforeEach(async ({ page }) => {
        rateCalculatorPage = new RateCalculatorPage(page);
        await page.goto(calculatorUrl);
    });

    test('should successfully calculate estimated electric usage', async () => {
        test.info().annotations.push({ type: 'Test Case ID', description: 'RC_001' });
        test.info().annotations.push({ type: 'Requirement', description: 'Verify Electric Usage Calculation' });
        test.info().annotations.push({ type: 'Priority', description: 'High' });

        const monthValue = 'm06'; // June
        const previousRead = '1000';
        const currentRead = '1250';
        const expectedElectricUse = '250';

        await test.step('1. Perform electric usage calculation', async () => {
            await rateCalculatorPage.performElectricCalculation(monthValue, previousRead, currentRead);
        });

        await test.step('2. Verify estimated electric usage', async () => {
            const actualElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
            expect(actualElectricUse).toBe(expectedElectricUse);
        });

        await test.step('3. Verify estimated gas usage is zero for electric-only calculation', async () => {
            const actualGasUse = await rateCalculatorPage.getEstimatedGasUse();
            expect(actualGasUse).toBe('0'); // Gas consumption input is disabled by default for electric only
        });
    });

    test('should reset all input fields to their initial state', async () => {
        test.info().annotations.push({ type: 'Test Case ID', description: 'RC_002' });
        test.info().annotations.push({ type: 'Requirement', description: 'Verify Reset Functionality' });
        test.info().annotations.push({ type: 'Priority', description: 'High' });

        const initialMonthValue = 'm06'; // Based on catalog currentValue for Month
        const initialReadValue = '0'; // Based on catalog currentValue for input fields

        await test.step('1. Enter some arbitrary data into the calculator', async () => {
            await rateCalculatorPage.selectMonth('m07'); // Change from default 'm06'
            await rateCalculatorPage.enterPreviousRead('500');
            await rateCalculatorPage.enterCurrentRead('700');
            await rateCalculatorPage.selectElectricAndGasService(); // Change from default Electric
            await rateCalculatorPage.clickCalculateButton(); // To ensure fields are populated
        });

        await test.step('2. Click the Reset button', async () => {
            await rateCalculatorPage.clickResetButton();
        });

        await test.step('3. Verify the Month dropdown is reset to initial value', async () => {
            expect(await rateCalculatorPage.getMonthSelectedValue()).toBe(initialMonthValue);
        });

        await test.step('4. Verify Previous Read input is reset to initial value', async () => {
            expect(await rateCalculatorPage.getPreviousReadValue()).toBe(initialReadValue);
        });

        await test.step('5. Verify Current Read input is reset to initial value', async () => {
            expect(await rateCalculatorPage.getCurrentReadValue()).toBe(initialReadValue);
        });

        await test.step('6. Verify Estimated Electric use is reset to initial value', async () => {
            expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe(initialReadValue);
        });

        await test.step('7. Verify Estimated Gas use is reset to initial value', async () => {
            expect(await rateCalculatorPage.getEstimatedGasUse()).toBe(initialReadValue);
        });

        await test.step('8. Verify Electric service radio button is selected by default', async () => {
            // After reset, it should typically revert to the default selected option (Electric)
            expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true);
            expect(await rateCalculatorPage.isElectricAndGasServiceSelected()).toBe(false);
        });
    });
});
