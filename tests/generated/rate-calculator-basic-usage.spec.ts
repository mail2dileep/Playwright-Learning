import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed based on project structure

test.describe('Rate Calculator Functionality', () => {
  const TEST_URL = '/rate-calculator'; // Placeholder URL, adjust as per your application's routing

  test.beforeEach(async ({ page }) => {
    // Navigate to the calculator page before each test
    // Assuming the base URL is configured in playwright.config.ts
    await page.goto(TEST_URL);
  });

  test('should calculate estimated electric use correctly for electric only service', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    const previousRead = '100';
    const currentRead = '250';
    const expectedElectricUse = (parseInt(currentRead) - parseInt(previousRead)).toString();

    await rateCalculatorPage.performCalculation('m07', previousRead, currentRead, 'Electric'); // July, Electric service

    const actualEstimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(actualEstimatedElectricUse).toEqual(expectedElectricUse);
    const actualEstimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    // Expect 0 for gas when 'Electric' only is selected and the field is disabled by default
    expect(actualEstimatedGasUse).toEqual('0');
  });

  test('should reset the calculator fields to default values', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // First, fill some values to ensure they are not defaults
    await rateCalculatorPage.selectMonth('m12'); // December
    await rateCalculatorPage.enterPreviousRead('500');
    await rateCalculatorPage.enterCurrentRead('700');
    await rateCalculatorPage.selectServiceTypeElectricGas();
    await rateCalculatorPage.clickCalculate(); // Optional: to ensure form state is updated before reset

    // Now, reset
    await rateCalculatorPage.clickReset();

    // Verify fields are reset to their catalog default values
    expect(await rateCalculatorPage.getPreviousReadValue()).toEqual('0');
    expect(await rateCalculatorPage.getCurrentReadValue()).toEqual('0');
    expect(await rateCalculatorPage.getSelectedMonthValue()).toEqual('m06'); // Default month value 'June'
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toEqual('0');
    expect(await rateCalculatorPage.getEstimatedGasUse()).toEqual('0');
  });

  test('should correctly handle Electric and Gas service calculation option', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    const previousRead = '50';
    const currentRead = '150';
    const expectedElectricUse = (parseInt(currentRead) - parseInt(previousRead)).toString();

    await rateCalculatorPage.performCalculation('m03', previousRead, currentRead, 'ElectricGas'); // March, Electric and Gas service

    const actualEstimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(actualEstimatedElectricUse).toEqual(expectedElectricUse);
    // As per locator catalog, 'Estimated Gas use (Ccf)' is disabled and has a currentValue of "0".
    // It's assumed to remain '0' unless specific application logic enables/updates it, which is not indicated.
    const actualEstimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(actualEstimatedGasUse).toEqual('0');
  });
})