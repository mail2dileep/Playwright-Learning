import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed based on framework structure

test.describe('Rate Calculator Frontend Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  // IMPORTANT NOTE:
  // The original test objective 'Verify Authoring - Pricing Adjustments' (MTX-4433)
  // and its steps related to AEM CMS authoring dialog could not be automated
  // as the provided locator catalog exclusively contains elements for the
  // frontend Rate Calculator user interface, not for CMS authoring forms.
  // This generated test focuses on demonstrating the frontend Rate Calculator's
  // calculation and interaction functionality using the available locators.

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming the rate calculator is accessible at this URL.
    // In a real enterprise scenario, this URL would be dynamic or configured
    // via a base URL in playwright.config.ts or environment variables.
    await rateCalculatorPage.navigateTo('https://example.com/rate-calculator');
  });

  test('should calculate electric usage correctly based on meter reads', async () => {
    const previousRead = '100';
    const currentRead = '250';
    // Assuming a simple calculation: Current Read - Previous Read
    const expectedElectricUse = (parseInt(currentRead) - parseInt(previousRead)).toString();

    await rateCalculatorPage.selectMonth('m07'); // Select July
    await rateCalculatorPage.enterPreviousRead(previousRead);
    await rateCalculatorPage.enterCurrentRead(currentRead);
    await rateCalculatorPage.selectServiceType('Electric');
    await rateCalculatorPage.clickCalculate();

    // Keep assertions in the test layer, using Page Object methods
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe(expectedElectricUse);
    // If only Electric service is selected, Gas use should remain 0
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
  });

  test('should reset inputs to default values when reset button is clicked', async () => {
    // Interact with inputs to change their state
    await rateCalculatorPage.enterPreviousRead('150');
    await rateCalculatorPage.enterCurrentRead('300');
    await rateCalculatorPage.selectServiceType('Electric & Gas');
    await rateCalculatorPage.clickCalculate(); // Simulate a calculation first

    await rateCalculatorPage.clickReset();

    // Verify inputs are reset to their initial/default states (as per locator catalog)
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06'); // Default is June (m06)
    // Default radio button selection based on `currentValue: E` for #e
    expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true);
    expect(await rateCalculatorPage.isElectricGasServiceSelected()).toBe(false);
  });

  test('should display correct default values on initial page load', async () => {
    // Direct navigation in beforeEach ensures initial state. Assert defaults from catalog.
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06'); // June
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
    // Based on `currentValue: E` for radio button with id 'e'
    expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true);
    expect(await rateCalculatorPage.isElectricGasServiceSelected()).toBe(false);
  });
});
