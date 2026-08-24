import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative path

test.describe('Rate Calculator Functionality', () => {

    let rateCalculatorPage: RateCalculatorPage;

    test.beforeEach(async ({ page }) => {
        rateCalculatorPage = new RateCalculatorPage(page);
        // Assuming the base URL is configured in playwright.config.ts
        // and '/rate-calculator' is the relative path to the page.
        await page.goto('/rate-calculator');
    });

    test('should calculate estimated electric use for Electric Only service', async () => {
        // Step 1: Select "October" from the Month dropdown ('m10' is the value for October)
        await rateCalculatorPage.selectMonth('m10');

        // Step 2: Enter "100" into "Enter Previous Read:"
        await rateCalculatorPage.enterPreviousRead('100');

        // Step 3: Enter "200" into "Enter Current Read:"
        await rateCalculatorPage.enterCurrentRead('200');

        // Step 4: Select "Electric Only" service type
        await rateCalculatorPage.selectElectricService();

        // Step 5: Click "Calculate"
        await rateCalculatorPage.clickCalculate();

        // Step 6: Verify "Estimated Electric use (kWh):" shows "100" (200 - 100 = 100 kWh)
        await expect(rateCalculatorPage.getEstimatedElectricUseLocator()).toHaveValue('100');

        // Step 7: Verify "Estimated Gas use (Ccf):" remains disabled for Electric Only service
        await expect(rateCalculatorPage.getEstimatedGasUseLocator()).toBeDisabled();
    });

    test('should calculate estimated electric use and enable gas input for Electric & Gas service', async () => {
        // Step 1: Select "November" from the Month dropdown ('m11' is the value for November)
        await rateCalculatorPage.selectMonth('m11');

        // Step 2: Enter "500" into "Enter Previous Read:"
        await rateCalculatorPage.enterPreviousRead('500');

        // Step 3: Enter "700" into "Enter Current Read:"
        await rateCalculatorPage.enterCurrentRead('700');

        // Step 4: Select "Electric and Gas" service type
        await rateCalculatorPage.selectElectricAndGasService();

        // Step 5: Click "Calculate"
        await rateCalculatorPage.clickCalculate();

        // Step 6: Verify "Estimated Electric use (kWh):" shows "200" (700 - 500 = 200 kWh)
        await expect(rateCalculatorPage.getEstimatedElectricUseLocator()).toHaveValue('200');

        // Step 7: Verify "Estimated Gas use (Ccf):" is enabled and shows '0' (assuming a default value post-calculation if no gas read is provided)
        await expect(rateCalculatorPage.getEstimatedGasUseLocator()).toBeEnabled();
        await expect(rateCalculatorPage.getEstimatedGasUseLocator()).toHaveValue('0');
    });

    test('should reset all fields to their initial state when Reset button is clicked', async () => {
        // Pre-fill fields with non-default values
        await rateCalculatorPage.selectMonth('m03'); // March
        await rateCalculatorPage.enterPreviousRead('150');
        await rateCalculatorPage.enterCurrentRead('300');
        await rateCalculatorPage.selectElectricAndGasService();
        await rateCalculatorPage.clickCalculate(); // Simulate a calculation before reset

        // Verify pre-reset state (optional, but good for robust testing)
        await expect(rateCalculatorPage.getMonthDropdownLocator()).toHaveValue('m03');
        await expect(rateCalculatorPage.getPreviousReadInputLocator()).toHaveValue('150');
        await expect(rateCalculatorPage.getCurrentReadInputLocator()).toHaveValue('300');
        await expect(rateCalculatorPage.getElectricAndGasServiceRadioLocator()).toBeChecked();
        await expect(rateCalculatorPage.getEstimatedElectricUseLocator()).toHaveValue('150'); // 300-150
        await expect(rateCalculatorPage.getEstimatedGasUseLocator()).toBeEnabled();

        // Click Reset
        await rateCalculatorPage.clickReset();

        // Verify fields are reset to their initial values
        // Initial month value is 'm06' (June) as per the catalog
        await expect(rateCalculatorPage.getMonthDropdownLocator()).toHaveValue('m06');
        // Initial read values are '0' as per the catalog
        await expect(rateCalculatorPage.getPreviousReadInputLocator()).toHaveValue('0');
        await expect(rateCalculatorPage.getCurrentReadInputLocator()).toHaveValue('0');
        // Initial service type is 'E' (Electric) as per the catalog's currentValue for #e
        await expect(rateCalculatorPage.getElectricServiceRadioLocator()).toBeChecked();
        await expect(rateCalculatorPage.getElectricAndGasServiceRadioLocator()).not.toBeChecked();

        // Estimated fields should also reset to '0' and gas field should be disabled again
        await expect(rateCalculatorPage.getEstimatedElectricUseLocator()).toHaveValue('0');
        await expect(rateCalculatorPage.getEstimatedGasUseLocator()).toBeDisabled();
    });
});