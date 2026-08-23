import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary based on your project structure

test.describe('Rate Calculator Functionality', () => {
  const baseURL = 'http://example.com/rate-calculator'; // Placeholder URL, replace with your actual application URL

  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
  });

  test('should calculate estimated electric use correctly for electric service', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    // Step 1: Select a month (e.g., 'm06' for June as per locator catalog options)
    await calculatorPage.selectMonth('m06');

    // Step 2: Enter previous and current meter reads
    await calculatorPage.enterPreviousRead('1000');
    await calculatorPage.enterCurrentRead('1500');

    // Step 3: Select 'Electric' service type
    await calculatorPage.selectServiceType('electric');

    // Step 4: Click Calculate
    await calculatorPage.calculateRates();

    // Step 5: Verify the estimated electric use is the difference between current and previous reads
    const estimatedElectricUse = await calculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('500'); // Assuming calculation is Current - Previous

    // Step 6: Verify estimated gas use is '0' as only electric service was selected
    const estimatedGasUse = await calculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).toBe('0');
  });

  test('should reset the form fields to their default values', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    // Step 1: Fill some values into the form to ensure they can be reset
    await calculatorPage.selectMonth('m07'); // Select a different month (July)
    await calculatorPage.enterPreviousRead('2000');
    await calculatorPage.enterCurrentRead('2500');
    await calculatorPage.selectServiceType('electric-gas'); // Select a different service type

    // Step 2: Click the Reset button
    await calculatorPage.resetForm();

    // Step 3: Verify all fields are reset to their initial/default values as per the locator catalog
    const previousRead = await calculatorPage.getPreviousReadValue();
    const currentRead = await calculatorPage.getCurrentReadValue();
    const estimatedElectricUse = await calculatorPage.getEstimatedElectricUse();
    const estimatedGasUse = await calculatorPage.getEstimatedGasUse();
    const selectedMonthValue = await calculatorPage.getSelectedMonthValue();

    expect(previousRead).toBe('0'); // Default value for previous read input
    expect(currentRead).toBe('0'); // Default value for current read input
    expect(estimatedElectricUse).toBe('0'); // Default value for estimated electric use
    expect(estimatedGasUse).toBe('0'); // Default value for estimated gas use
    expect(selectedMonthValue).toBe('m06'); // Default selected month value from catalog (June)
  });
});
