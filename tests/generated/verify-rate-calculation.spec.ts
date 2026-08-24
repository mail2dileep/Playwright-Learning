import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
    let rateCalculatorPage: RateCalculatorPage;
    const baseURL = 'https://example.com/rate-calculator'; // Placeholder URL

    test.beforeEach(async ({ page }) => {
        rateCalculatorPage = new RateCalculatorPage(page);
        await rateCalculatorPage.navigateTo(baseURL);
    });

    test('should successfully calculate electric usage for valid reads', async () => {
        const month = 'm07'; // July
        const previousRead = '100';
        const currentRead = '250';
        const expectedElectricUsage = '150'; // 250 - 100 = 150

        await rateCalculatorPage.calculateElectricBill(month, previousRead, currentRead);

        const actualElectricUsage = await rateCalculatorPage.getEstimatedElectricUsage();
        expect(actualElectricUsage).toBe(expectedElectricUsage);
    });

    test('should reset the form fields to their default values', async () => {
        // Fill some data first to ensure it's changed from defaults
        await rateCalculatorPage.selectMonth('m08'); // Change from default 'm06'
        await rateCalculatorPage.enterPreviousRead('50'); // Change from default '0'
        await rateCalculatorPage.enterCurrentRead('150'); // Change from default '0'
        await rateCalculatorPage.selectServiceType('electricAndGas'); // Change default selected

        // Click reset
        await rateCalculatorPage.clickReset();

        // Verify fields are reset to their known default values from the locator catalog
        // Default values: month='m06', inputs='0'. The radio button 'E' has currentValue 'E', suggesting it's default selected.
        expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06');
        expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
        expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
        expect(await rateCalculatorPage.getEstimatedElectricUsage()).toBe('0');
        expect(await rateCalculatorPage.getEstimatedGasUsage()).toBe('0');
        expect(await rateCalculatorPage.getElectricServiceRadioStatus()).toBe(true);
        expect(await rateCalculatorPage.getElectricAndGasServiceRadioStatus()).toBe(false);
    });

    test('should calculate electric and gas usage when selected', async () => {
        const month = 'm09'; // September
        const previousRead = '200';
        const currentRead = '400';
        const expectedElectricUsage = '200'; // 400 - 200 = 200
        const expectedGasUsage = '0'; // Assuming no gas calculation logic on front-end for now, or it defaults to 0 if not implemented

        await rateCalculatorPage.calculateElectricAndGasBill(month, previousRead, currentRead);

        const actualElectricUsage = await rateCalculatorPage.getEstimatedElectricUsage();
        expect(actualElectricUsage).toBe(expectedElectricUsage);

        const actualGasUsage = await rateCalculatorPage.getEstimatedGasUsage();
        expect(actualGasUsage).toBe(expectedGasUsage);
    });
}