import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('MTX-4506: Rate Calculator Automation', () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html');
    });

    test('Verify bill calculation for Electric and Gas service', async ({ page }) => {
        const rateCalculator = new RateCalculatorPage(page);

        await test.step('Select Electric and Gas service type', async () => {
            await rateCalculator.selectElectricAndGas();
            await expect(rateCalculator.electricAndGasRadio).toBeChecked();
        });

        await test.step('Enter meter readings and select month', async () => {
            await rateCalculator.enterElectricRead('1200');
            await rateCalculator.enterGasRead('500');
            await rateCalculator.selectMonth('January');
        });

        await test.step('Click calculate and verify price is displayed', async () => {
            await rateCalculator.calculateBill();
            // Verify that the total price display is visible and contains a value
            await expect(rateCalculator.totalPriceDisplay).toBeVisible();
            await expect(rateCalculator.totalPriceDisplay).not.toHaveText('$0.00');
        });
    });

    test('Verify calculator reset functionality', async ({ page }) => {
        const rateCalculator = new RateCalculatorPage(page);

        await test.step('Enter values and click reset', async () => {
            await rateCalculator.enterElectricRead('1000');
            await rateCalculator.resetCalculator();
        });

        await test.step('Verify fields are cleared', async () => {
            await expect(rateCalculator.electricMeterInput).toHaveValue('');
        });
    });

    test('Verify external help links for bill and usage', async ({ page }) => {
        const rateCalculator = new RateCalculatorPage(page);

        await test.step('Click How to read your bill link', async () => {
            const [newPage] = await Promise.all([
                page.context().waitForEvent('page'),
                rateCalculator.clickHowToReadBill()
            ]);
            await expect(newPage).toHaveURL(/.*\.pdf/);
        });

        await test.step('Click How to find Usage link', async () => {
            const [newPage] = await Promise.all([
                page.context().waitForEvent('page'),
                rateCalculator.clickHowToFindUsage()
            ]);
            await expect(newPage).toHaveURL(/.*\.pdf/);
        });
    });
});