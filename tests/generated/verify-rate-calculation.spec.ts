import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // It's assumed that the test environment handles navigation to the base URL
    // where the rate calculator form is present, e.g., via playwright.config.ts
    // or a direct page.goto() call in a common setup hook if needed.
    // Example: await page.goto('/your-calculator-path');
  });

  test('should calculate estimated electric and gas usage correctly', async () => {
    // Step 1: Select service type "Electric and Gas"
    await rateCalculatorPage.selectElectricAndGasService();

    // Step 2: Select month "December" (value 'm12')
    await rateCalculatorPage.selectMonth('m12');

    // Step 3: Enter Previous Read value
    await rateCalculatorPage.enterPreviousRead('1000');

    // Step 4: Enter Current Read value
    await rateCalculatorPage.enterCurrentRead('1500');

    // Step 5: Click Calculate button
    await rateCalculatorPage.clickCalculateButton();

    // Step 6: Verify Estimated Electric use is 500 (1500 - 1000)
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('500');

    // Step 7: Verify Estimated Gas use is '0' or a calculated value.
    // The 'Estimated Gas use (Ccf)' input is initially disabled according to the catalog.
    // If selecting 'EG' service type enables it, a calculated value (or '0' if no gas data) is expected.
    // Based on the catalog's `currentValue: "0"` for this field, '0' is a reasonable default
    // if no specific gas calculation is performed or gas data is provided.
    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).not.toBeNull();
    expect(estimatedGasUse).toBe('0'); // Expecting '0' as a default or due to no gas-specific input data.
  });

  test('should reset form fields upon clicking Reset button', async () => {
    // Pre-fill some fields to test reset functionality
    await rateCalculatorPage.selectElectricService(); // Select Electric service
    await rateCalculatorPage.selectMonth('m07'); // Select July
    await rateCalculatorPage.enterPreviousRead('2000');
    await rateCalculatorPage.enterCurrentRead('2500');

    // Click Reset button
    await rateCalculatorPage.clickResetButton();

    // Verify fields are reset to their default initial values as per the catalog
    expect(await rateCalculatorPage.previousReadInput.inputValue()).toBe('0');
    expect(await rateCalculatorPage.currentReadInput.inputValue()).toBe('0');
    expect(await rateCalculatorPage.estimatedElectricUseInput.inputValue()).toBe('0');
    expect(await rateCalculatorPage.estimatedGasUseInput.inputValue()).toBe('0');

    // Month dropdown should revert to its initial state, which is 'm06' (June)
    // as indicated by the 'currentValue' in the locator catalog for the month dropdown.
    expect(await rateCalculatorPage.getSelectedMonth()).toBe('m06');
  });
});
