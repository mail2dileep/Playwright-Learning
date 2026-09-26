import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality E2E Tests', () => {

  let rateCalculatorPage: RateCalculatorPage;

  // Before each test, initialize the Page Object and navigate.
  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigateTo();
  });

  test('should verify default state on initial page load', async () => {
    // Verify default values based on locator catalog data
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06'); // 'June' is the default value
    expect(await rateCalculatorPage.isElectricServiceTypeSelected()).toBe(true); // 'e' is default selected
  });

  test('should calculate estimated electric use for selected reads and service type', async () => {
    // Step 1: Input previous and current meter reads
    await rateCalculatorPage.enterPreviousRead('1000');
    await rateCalculatorPage.enterCurrentRead('1500');

    // Step 2: Select a specific month (e.g., July)
    await rateCalculatorPage.selectMonth('m07');

    // Step 3: Ensure Electric service type is selected (it's often default, but explicitly select for robustness)
    await rateCalculatorPage.selectElectricServiceType();

    // Step 4: Click the Calculate button
    await rateCalculatorPage.calculateBill();

    // Step 5: Verify the estimated electric use is calculated and displayed correctly
    // Assuming a simple calculation of Current - Previous = Consumption
    const expectedConsumption = '500'; // 1500 - 1000
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe(expectedConsumption);
  });

  test('should reset form fields to their initial default state', async () => {
    // Step 1: Perform some actions to change the form state
    await rateCalculatorPage.enterPreviousRead('2000');
    await rateCalculatorPage.enterCurrentRead('2500');
    await rateCalculatorPage.selectMonth('m08'); // August
    await rateCalculatorPage.selectElectricAndGasServiceType();
    await rateCalculatorPage.calculateBill(); // Trigger calculation for a changed state

    // Verify fields are changed from default
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('2000');
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('2500');
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m08');
    expect(await rateCalculatorPage.isElectricServiceTypeSelected()).toBe(false); // 'E' should not be selected if 'EG' is
    // Verification of Estimated Electric use not strictly needed here, but shows form state change

    // Step 2: Click the Reset button
    await rateCalculatorPage.resetForm();

    // Step 3: Verify all fields are reset to their default values
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06'); // Back to 'June'
    expect(await rateCalculatorPage.isElectricServiceTypeSelected()).toBe(true); // 'E' selected by default after reset
  });
});
