import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming the calculator is accessible at a specific URL.
    // Replace with your actual application URL.
    await rateCalculatorPage.navigateTo('http://localhost:3000/rate-calculator');
  });

  test('should calculate estimated electric use correctly for June', async () => {
    // Step 1: Select month
    await rateCalculatorPage.selectMonth('m06'); // June

    // Step 2: Enter previous read
    await rateCalculatorPage.enterPreviousRead('1000');

    // Step 3: Enter current read
    await rateCalculatorPage.enterCurrentRead('1500');

    // Step 4: Select Electric service type
    await rateCalculatorPage.selectElectricService();

    // Step 5: Click Calculate
    await rateCalculatorPage.clickCalculate();

    // Step 6: Verify estimated electric use
    const electricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(electricUse).toBe('500'); // Assuming a simple calculation (1500 - 1000 = 500)

    // Step 7: Verify estimated gas use is disabled and shows 0 for Electric service
    const gasUseDisabled = await rateCalculatorPage.isEstimatedGasUseDisabled();
    expect(gasUseDisabled).toBe(true);
    const gasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(gasUse).toBe('0');
  });

  test('should reset the form fields when reset button is clicked', async () => {
    // Fill some values first
    await rateCalculatorPage.selectMonth('m07'); // July
    await rateCalculatorPage.enterPreviousRead('2000');
    await rateCalculatorPage.enterCurrentRead('2100');
    await rateCalculatorPage.selectElectricAndGasService();

    // Click reset
    await rateCalculatorPage.clickReset();

    // Verify fields are reset to their initial/default states
    const previousRead = await rateCalculatorPage.getPreviousReadValue();
    const currentRead = await rateCalculatorPage.getCurrentReadValue();
    const selectedMonth = await rateCalculatorPage.getSelectedMonthValue();

    expect(selectedMonth).toBe('m06'); // Default value as per catalog
    expect(previousRead).toBe('0');     // Default value as per catalog
    expect(currentRead).toBe('0');      // Default value as per catalog

    // Verify Electric service radio is checked (assuming this is default after reset or initial state)
    expect(await rateCalculatorPage.isElectricServiceChecked()).toBe(true);
  });
});
