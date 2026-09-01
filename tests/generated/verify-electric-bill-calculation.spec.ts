import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import

test.describe('Rate Calculator Functionality', () => {

  // Test to verify a basic electric bill calculation scenario
  test('should calculate estimated electric use correctly', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Navigate to the page. In an enterprise framework, this might be handled by a fixture or base page setup.
    await page.goto('/rate-calculator'); // Placeholder URL, replace with actual URL if available

    const month = 'm06'; // June
    const previousRead = '1000';
    const currentRead = '1200';
    const expectedElectricUse = '200'; // (1200 - 1000)

    // Perform the calculation using Page Object workflow method
    await rateCalculatorPage.performElectricCalculation(month, previousRead, currentRead);

    // Assertions in the test layer
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe(expectedElectricUse);

    // Verify gas consumption is still 0 as only electric service was chosen
    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).toBe('0'); // Expecting 0 if Electric service selected and no gas input
  });

  // Test to verify the reset functionality of the form
  test('should reset the form fields to default values', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await page.goto('/rate-calculator'); // Placeholder URL, assume it loads with default values

    // Fill some values different from defaults
    await rateCalculatorPage.selectMonth('m07'); // Default from catalog is 'm06'
    await rateCalculatorPage.enterPreviousRead('500'); // Default from catalog is '0'
    await rateCalculatorPage.enterCurrentRead('600'); // Default from catalog is '0'
    await rateCalculatorPage.selectElectricGasService(); // Default from catalog is 'E' (Electric)

    // Click the Reset button
    await rateCalculatorPage.clickReset();

    // Assertions that fields are reset to their initial/default states as per the Locator Catalog
    expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06');
    expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true); // 'E' is the default radio selection
    expect(await rateCalculatorPage.isElectricGasServiceSelected()).toBe(false); // 'EG' should not be selected after reset
  });
});
