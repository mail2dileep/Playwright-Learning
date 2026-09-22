import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  const BASE_URL = 'http://localhost:3000/rate-calculator'; // Placeholder URL

  test('should correctly calculate electric usage for a given month and meter reads', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    await calculatorPage.navigateTo(BASE_URL);

    // Verify initial state
    await expect(calculatorPage.isEstimatedGasUseDisabled()).resolves.toBe(true);
    await expect(calculatorPage.getMonthDropdownCurrentValue()).resolves.toBe('m06'); // Initial value from catalog

    // Perform calculation for Electric service
    const month = 'm07'; // July
    const previousRead = '1000';
    const currentRead = '1150';
    const expectedElectricUsage = '150'; // 1150 - 1000 = 150

    await calculatorPage.calculateElectricUsage(month, previousRead, currentRead);

    // Assertions for electric calculation
    await expect(calculatorPage.getEstimatedElectricUse()).resolves.toBe(expectedElectricUsage);
    await expect(calculatorPage.getMonthDropdownCurrentValue()).resolves.toBe(month);
    await expect(calculatorPage.getPreviousMeterReadValue()).resolves.toBe(previousRead);
    await expect(calculatorPage.getCurrentMeterReadValue()).resolves.toBe(currentRead);
    await expect(calculatorPage.isElectricServiceTypeSelected()).resolves.toBe(true);
    await expect(calculatorPage.isElectricAndGasServiceTypeSelected()).resolves.toBe(false);
  });

  test('should reset the form fields when the Reset button is clicked', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    await calculatorPage.navigateTo(BASE_URL);

    // Fill some fields
    await calculatorPage.selectMonth('m08'); // August
    await calculatorPage.enterPreviousMeterRead('500');
    await calculatorPage.enterCurrentMeterRead('750');
    await calculatorPage.selectElectricAndGasServiceType();

    // Verify fields are filled
    await expect(calculatorPage.getMonthDropdownCurrentValue()).resolves.toBe('m08');
    await expect(calculatorPage.getPreviousMeterReadValue()).resolves.toBe('500');
    await expect(calculatorPage.getCurrentMeterReadValue()).resolves.toBe('750');
    await expect(calculatorPage.isElectricAndGasServiceTypeSelected()).resolves.toBe(true);

    // Click reset
    await calculatorPage.clickReset();

    // Assertions after reset - check for default values or empty fields
    await expect(calculatorPage.getMonthDropdownCurrentValue()).resolves.toBe('m06'); // Assumed default
    await expect(calculatorPage.getPreviousMeterReadValue()).resolves.toBe('0'); // Assumed default from catalog
    await expect(calculatorPage.getCurrentMeterReadValue()).resolves.toBe('0'); // Assumed default from catalog
    await expect(calculatorPage.getEstimatedElectricUse()).resolves.toBe('0'); // Assumed default from catalog
    await expect(calculatorPage.isElectricServiceTypeSelected()).resolves.toBe(false); // Neither selected after reset if 'E' is default
    await expect(calculatorPage.isElectricAndGasServiceTypeSelected()).resolves.toBe(false);
  });

  test('should allow selection of Electric and Gas service type', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    await calculatorPage.navigateTo(BASE_URL);

    // Select Electric and Gas service type
    await calculatorPage.selectElectricAndGasServiceType();

    // Assert that the radio button is selected
    await expect(calculatorPage.isElectricAndGasServiceTypeSelected()).resolves.toBe(true);
    await expect(calculatorPage.isElectricServiceTypeSelected()).resolves.toBe(false);
    await expect(calculatorPage.isEstimatedGasUseDisabled()).resolves.toBe(false); // Expect gas input to be enabled if EG is selected

    // You might also assert the state of the gas consumption field if it changes based on service type selection
    // The provided catalog shows gasconsumption as disabled=true, so this test step assumes a dynamic UI behavior.
    // If the application doesn't enable it, this assertion should be removed or adapted.
  });
});