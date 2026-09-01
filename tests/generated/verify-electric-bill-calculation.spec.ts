import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage';

test.describe('Electric Bill Calculator Functionality', () => {
    let calculatorPage: CalculatorPage;
    const testUrl = 'http://localhost:3000/calculator'; // Placeholder URL

    test.beforeEach(async ({ page }) => {
        calculatorPage = new CalculatorPage(page);
        await calculatorPage.navigateTo(testUrl);
    });

    test('should successfully calculate electric bill for selected month and readings', async () => {
        const month = 'm10'; // October
        const previousRead = '1000';
        const currentRead = '1500';
        const expectedElectricConsumption = '500'; // 1500 - 1000

        // Step 1: Select Month
        await calculatorPage.selectMonth(month);
        await expect(calculatorPage.page.getByLabel('Month')).toHaveValue(month);

        // Step 2: Enter Previous Read
        await calculatorPage.enterPreviousRead(previousRead);
        await expect(calculatorPage.page.getByLabel('Enter Previous Read:')).toHaveValue(previousRead);

        // Step 3: Enter Current Read
        await calculatorPage.enterCurrentRead(currentRead);
        await expect(calculatorPage.page.getByLabel('Enter Current Read:')).toHaveValue(currentRead);

        // Step 4: Select Electric Service Type
        await calculatorPage.selectElectricService();
        await expect(calculatorPage.page.locator('#e')).toBeChecked();
        await expect(calculatorPage.page.locator('#eg')).not.toBeChecked();

        // Step 5: Verify Estimated Gas Use is Disabled before calculation (if 'E' is selected)
        expect(await calculatorPage.isEstimatedGasUseDisabled()).toBe(true);
        await expect(calculatorPage.page.getByLabel('Estimated Gas use (Ccf):')).toBeDisabled();

        // Step 6: Click Calculate
        await calculatorPage.clickCalculate();

        // Step 7: Verify Estimated Electric Use
        const actualElectricConsumption = await calculatorPage.getEstimatedElectricUse();
        expect(actualElectricConsumption).toBe(expectedElectricConsumption);
        await expect(calculatorPage.page.getByLabel('Estimated Electric use (kWh):')).toHaveValue(expectedElectricConsumption);

        // Step 8: Verify Estimated Gas Use remains disabled and '0'
        expect(await calculatorPage.isEstimatedGasUseDisabled()).toBe(true);
        expect(await calculatorPage.getEstimatedGasUse()).toBe('0');
        await expect(calculatorPage.page.getByLabel('Estimated Gas use (Ccf):')).toBeDisabled();
        await expect(calculatorPage.page.getByLabel('Estimated Gas use (Ccf):')).toHaveValue('0');
    });

    test('should reset form fields when reset button is clicked', async () => {
        // Fill some fields first
        await calculatorPage.selectMonth('m12');
        await calculatorPage.enterPreviousRead('200');
        await calculatorPage.enterCurrentRead('300');
        await calculatorPage.selectElectricAndGasService();

        // Verify fields are filled
        await expect(calculatorPage.page.getByLabel('Month')).toHaveValue('m12');
        await expect(calculatorPage.page.getByLabel('Enter Previous Read:')).toHaveValue('200');
        await expect(calculatorPage.page.getByLabel('Enter Current Read:')).toHaveValue('300');
        await expect(calculatorPage.page.locator('#eg')).toBeChecked();

        // Click Reset
        await calculatorPage.clickReset();

        // Verify fields are reset to initial values (default month 'm06', 0 for reads)
        await expect(calculatorPage.page.getByLabel('Month')).toHaveValue('m06');
        await expect(calculatorPage.page.getByLabel('Enter Previous Read:')).toHaveValue('0');
        await expect(calculatorPage.page.getByLabel('Enter Current Read:')).toHaveValue('0');
        await expect(calculatorPage.page.getByLabel('Estimated Electric use (kWh):')).toHaveValue('0');
        await expect(calculatorPage.page.getByLabel('Estimated Gas use (Ccf):')).toHaveValue('0');

        // After reset, 'Electric' service radio should be selected as default
        await expect(calculatorPage.page.locator('#e')).toBeChecked();
        await expect(calculatorPage.page.locator('#eg')).not.toBeChecked();

        // After reset, Estimated Gas Use should be disabled again
        expect(await calculatorPage.isEstimatedGasUseDisabled()).toBe(true);
    });
});
