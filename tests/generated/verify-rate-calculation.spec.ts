import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming the page is navigated to the calculator URL.
    // In a real scenario, this would be page.goto('/rate-calculator-url');
    // For this exercise, we assume the page is already loaded.
    await page.goto('https://example.com/rate-calculator'); // Placeholder URL
  });

  test('should calculate estimated electric use correctly for Electric service', async ({ page }) => {
    // Action: Select month (October)
    await rateCalculatorPage.selectMonth('m10'); 

    // Action: Enter previous read
    await rateCalculatorPage.enterPreviousMeterRead('1000');

    // Action: Enter current read
    await rateCalculatorPage.enterCurrentMeterRead('1500');

    // Action: Select Electric service type
    await rateCalculatorPage.selectServiceTypeElectric();

    // Action: Click Calculate
    await rateCalculatorPage.clickCalculate();

    // Assertion: Verify estimated electric use
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('500'); 

    // Assertion: Verify estimated gas use field remains disabled when Electric service is selected
    const isGasUseDisabled = await rateCalculatorPage.isEstimatedGasUseFieldDisabled();
    expect(isGasUseDisabled).toBe(true);
  });

  test('should reset form fields to default values', async ({ page }) => {
    // Pre-fill some fields to test reset
    await rateCalculatorPage.selectMonth('m12'); // December
    await rateCalculatorPage.enterPreviousMeterRead('500');
    await rateCalculatorPage.enterCurrentMeterRead('700');
    await rateCalculatorPage.selectServiceTypeElectricAndGas();

    // Click Reset
    await rateCalculatorPage.clickReset();

    // Assertions: Verify fields are reset to their default/initial states
    // Month dropdown default currentValue is 'm06' (June)
    expect(await rateCalculatorPage.monthDropdownLocator.inputValue()).toBe('m06');
    // Previous Read default currentValue is '0'
    expect(await rateCalculatorPage.previousReadInputLocator.inputValue()).toBe('0');
    // Current Read default currentValue is '0'
    expect(await rateCalculatorPage.currentReadInputLocator.inputValue()).toBe('0');
    // Assuming 'Electric only' radio is default based on catalog for #e radio (currentValue: "E")
    expect(await rateCalculatorPage.electricServiceTypeRadioLocator.isChecked()).toBe(true);
    expect(await rateCalculatorPage.electricAndGasServiceTypeRadioLocator.isChecked()).toBe(false);
  });
});
