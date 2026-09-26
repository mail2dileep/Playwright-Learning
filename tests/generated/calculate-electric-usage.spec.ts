import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed based on your project structure

test.describe('Rate Calculator Functionality', () => {

  // Placeholder URL - replace with the actual application URL for the rate calculator
  const BASE_URL = 'http://localhost:3000/rate-calculator';

  test.beforeEach(async ({ page }) => {
    // Navigate to the rate calculator page before each test execution
    await page.goto(BASE_URL);
  });

  test('should successfully calculate electric consumption when only electric service is selected', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Test Data for the calculation
    const month = 'm07'; // Value attribute for July
    const previousRead = '1000';
    const currentRead = '1500';
    const expectedElectricConsumption = '500'; // Calculated as Current Read - Previous Read

    // Action: Execute the business workflow to calculate electric consumption
    await rateCalculatorPage.calculateElectricConsumption(month, previousRead, currentRead);

    // Assertion: Verify the estimated electric use displayed on the page
    const actualElectricConsumption = await rateCalculatorPage.getEstimatedElectricUse();
    expect(actualElectricConsumption).toBe(expectedElectricConsumption);

    // Assertion: Verify that the estimated gas use field is disabled and its value is '0'
    expect(await rateCalculatorPage.isEstimatedGasUseDisabled()).toBeTruthy();
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
  });

  test('should reset all input fields and selections to their default states', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Action: Populate fields with values different from their known defaults
    await rateCalculatorPage.selectMonth('m08'); // Default month is 'm06'
    await rateCalculatorPage.enterPreviousRead('200'); // Default previous read is '0'
    await rateCalculatorPage.enterCurrentRead('300'); // Default current read is '0'
    await rateCalculatorPage.selectElectricAndGasService(); // Assuming 'Electric' is the default service type

    // Optional Assertions: Verify that the fields are indeed changed from defaults before reset
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m08');
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('200');
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('300');
    expect(await rateCalculatorPage.isElectricAndGasServiceSelected()).toBeTruthy();

    // Action: Click the Reset button to revert changes
    await rateCalculatorPage.clickResetButton();

    // Assertion: Verify all relevant fields and selections have reset to their initial default states
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06'); // Default month as per catalog
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0'); // Default previous read as per catalog
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0'); // Default current read as per catalog
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0'); // Default electric use as per catalog
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0'); // Default gas use as per catalog
    
    // Assert that the 'Electric' service radio button is selected by default after reset
    expect(await rateCalculatorPage.isElectricServiceSelected()).toBeTruthy();
    expect(await rateCalculatorPage.isElectricAndGasServiceSelected()).toBeFalsy();
  });
});