import { test, expect } from '@playwright/test';
import { EnergyUsageCalculatorPage } from '../../pages/EnergyUsageCalculatorPage';

test.describe('Energy Usage Calculator Functionality', () => {
  let energyUsageCalculatorPage: EnergyUsageCalculatorPage;

  test.beforeEach(async ({ page }) => {
    energyUsageCalculatorPage = new EnergyUsageCalculatorPage(page);
    // In a real scenario, you would navigate to the specific page like this:
    await page.goto('https://www.example.com/energy-calculator'); // Placeholder URL, replace with actual URL
  });

  test('should calculate electric usage correctly for current month', async () => {
    const previousRead = '1000';
    const currentRead = '1500';
    const expectedElectricUsage = '500'; // 1500 - 1000

    await energyUsageCalculatorPage.selectMonth('m06'); // Select June
    await energyUsageCalculatorPage.enterPreviousMeterRead(previousRead);
    await energyUsageCalculatorPage.enterCurrentMeterRead(currentRead);
    await energyUsageCalculatorPage.selectElectricService();
    await energyUsageCalculatorPage.clickCalculate();

    // Assertions
    const actualElectricUsage = await energyUsageCalculatorPage.getEstimatedElectricUse();
    expect(actualElectricUsage).toBe(expectedElectricUsage);

    const actualGasUsage = await energyUsageCalculatorPage.getEstimatedGasUse();
    expect(actualGasUsage).toBe('0'); // Gas consumption should be 0 as only electric service was selected

    const isGasDisabled = await energyUsageCalculatorPage.isGasConsumptionFieldDisabled();
    expect(isGasDisabled).toBeTruthy(); // Gas input field is disabled by default when only electric is chosen
  });

  test('should reset the form fields to their default state', async () => {
    // Fill some data first to ensure fields are not in their default state
    await energyUsageCalculatorPage.selectMonth('m07'); // Change from default 'm06'
    await energyUsageCalculatorPage.enterPreviousMeterRead('500');
    await energyUsageCalculatorPage.enterCurrentMeterRead('600');
    await energyUsageCalculatorPage.selectElectricAndGasService();
    await energyUsageCalculatorPage.clickCalculate(); // Trigger calculation to update estimated values

    // Click reset
    await energyUsageCalculatorPage.clickReset();

    // Verify fields are reset to their assumed default values
    expect(await energyUsageCalculatorPage.getPreviousMeterRead()).toBe('0');
    expect(await energyUsageCalculatorPage.getCurrentMeterRead()).toBe('0');
    expect(await energyUsageCalculatorPage.getEstimatedElectricUse()).toBe('0');
    expect(await energyUsageCalculatorPage.getEstimatedGasUse()).toBe('0');
    // Based on the catalog, 'm06' (June) is the initial 'currentValue' for the Month dropdown.
    expect(await energyUsageCalculatorPage.getSelectedMonthValue()).toBe('m06');
  });
});