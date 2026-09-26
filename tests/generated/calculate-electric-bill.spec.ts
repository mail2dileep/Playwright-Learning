import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed based on your project structure

test.describe('Rate Calculator Functionality', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the calculator page before each test.
    // Assumes base URL is configured in playwright.config.ts and '/calculator' is the relative path.
    await page.goto('/calculator');
  });

  test('should calculate estimated electric bill correctly for electric service', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    // Action: Select a specific month (e.g., 'Janaury' with value 'm01')
    await calculatorPage.selectMonth('m01');

    // Action: Enter a previous meter read
    await calculatorPage.enterPreviousRead('1000');

    // Action: Enter a current meter read
    await calculatorPage.enterCurrentRead('1500');

    // Action: Select Electric service type
    await calculatorPage.selectServiceTypeElectric();

    // Action: Click the Calculate button
    await calculatorPage.clickCalculateButton();

    // Assertion: Verify the estimated electric use
    // Assumes a simple calculation where Estimated Electric use = Current Read - Previous Read
    await expect(await calculatorPage.getEstimatedElectricUseValue()).toBe('500');

    // Assertion: Verify that the estimated gas use field is disabled
    await expect(await calculatorPage.isEstimatedGasUseDisabled()).toBe(true);
  });

  test('should reset the form fields to their initial state', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    // Action: Populate fields with test values to simulate user input
    await calculatorPage.selectMonth('m05'); // Select 'May' (value 'm05')
    await calculatorPage.enterPreviousRead('2000');
    await calculatorPage.enterCurrentRead('2500');
    await calculatorPage.selectServiceTypeElectricAndGas(); // Select 'Electric & Gas'
    await calculatorPage.clickCalculateButton(); // Perform calculation to populate output fields

    // Assertion: Verify fields are populated before reset (optional, but good for robustness)
    await expect(await calculatorPage.getEstimatedElectricUseValue()).toBe('500'); // (2500 - 2000)
    await expect(await calculatorPage.getPreviousReadValue()).toBe('2000');
    await expect(await calculatorPage.getCurrentReadValue()).toBe('2500');
    await expect(await calculatorPage.isElectricGasServiceTypeSelected()).toBe(true);

    // Action: Click the Reset button
    await calculatorPage.clickResetButton();

    // Assertion: Verify fields are reset to their default/initial values
    // Based on the Locator Catalog:
    // 'Month' default is 'm06' (June)
    // 'Enter Previous Read' and 'Enter Current Read' default to '0'
    // 'Estimated Electric use (kWh)' and 'Estimated Gas use (Ccf)' default to '0'
    // 'Electric & Gas' service type should no longer be selected.
    await expect(await calculatorPage.getPreviousReadValue()).toBe('0');
    await expect(await calculatorPage.getCurrentReadValue()).toBe('0');
    await expect(await calculatorPage.getEstimatedElectricUseValue()).toBe('0');
    await expect(await calculatorPage.getEstimatedGasUseValue()).toBe('0');
    await expect(await calculatorPage.getSelectedMonthValue()).toBe('m06');
    await expect(await calculatorPage.isElectricGasServiceTypeSelected()).toBe(false);
  });

});