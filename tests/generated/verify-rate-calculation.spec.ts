import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary

test.describe('Rate Calculator Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the calculator page before each test
    // In a real scenario, this URL would be configured in playwright.config.ts base URL
    await page.goto('http://localhost:3000/calculator'); // Placeholder URL
  });

  test('should calculate estimated electric use correctly for electric-only service', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Select a month (e.g., July)
    await rateCalculatorPage.selectMonth('m07');

    // Step 2: Enter previous meter read
    await rateCalculatorPage.enterPreviousRead('1000');

    // Step 3: Enter current meter read
    await rateCalculatorPage.enterCurrentRead('1500');

    // Step 4: Select 'Electric' service type
    await rateCalculatorPage.selectElectricService();

    // Step 5: Click 'Calculate'
    await rateCalculatorPage.clickCalculate();

    // Assertions
    // Verify estimated electric use
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('500'); // 1500 - 1000 = 500 kWh

    // Verify estimated gas use field is disabled for electric-only service
    expect(await rateCalculatorPage.isEstimatedGasUseFieldDisabled()).toBeTruthy();
    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).toBe('0'); // Should remain '0' as it's disabled or default value
  });

  test('should enable gas use input when Electric & Gas service is selected', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Initial state check: Gas use field should be disabled (based on locator catalog's disabled=true)
    expect(await rateCalculatorPage.isEstimatedGasUseFieldDisabled()).toBeTruthy();

    // Select 'Electric & Gas' service type
    await rateCalculatorPage.selectElectricAndGasService();

    // Assert that the gas use field is now enabled
    expect(await rateCalculatorPage.isEstimatedGasUseFieldEnabled()).toBeTruthy();
    expect(await rateCalculatorPage.isEstimatedGasUseFieldDisabled()).toBeFalsy();
  });

  test('should reset form fields to default values', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Populate some fields
    await rateCalculatorPage.selectMonth('m10'); // October
    await rateCalculatorPage.enterPreviousRead('200');
    await rateCalculatorPage.enterCurrentRead('300');
    await rateCalculatorPage.selectElectricAndGasService();
    await rateCalculatorPage.clickCalculate(); // Simulate some interaction

    // Click Reset
    await rateCalculatorPage.clickReset();

    // Assert fields are reset to their initial values
    // 'Month' default is 'm06' (June) as per currentValue in catalog
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06');
    // Previous Read default is '0'
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    // Current Read default is '0'
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    // Estimated Electric use default is '0'
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
    // Estimated Gas use should be disabled again and show '0' if reset also resets service type
    expect(await rateCalculatorPage.isEstimatedGasUseFieldDisabled()).toBeTruthy();
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
  });
});