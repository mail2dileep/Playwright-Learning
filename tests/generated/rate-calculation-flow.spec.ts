import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative path to the Page Object

test.describe('Rate Calculator Core Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;
  // Define a placeholder base URL. In a real framework, this would typically come from a config file.
  const baseURL = 'https://example.com/rate-calculator'; 

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    await page.goto(baseURL);
    // Ensure the page is fully loaded before attempting interactions
    await page.waitForLoadState('domcontentloaded'); 
  });

  test('should successfully calculate electric and gas usage with valid inputs', async () => {
    // Step 1: Select a specific month from the dropdown
    await rateCalculatorPage.selectMonth('m07'); // Select 'July' with value 'm07'
    expect(await rateCalculatorPage.getMonthSelectedValue()).toBe('m07');

    // Step 2: Enter previous and current meter readings
    const previousRead = '100';
    const currentRead = '250';
    await rateCalculatorPage.enterPreviousRead(previousRead);
    await rateCalculatorPage.enterCurrentRead(currentRead);

    // Step 3: Select 'Electric and Gas' service type.
    // Assumption: Selecting 'Electric and Gas' enables the 'Estimated Gas use' field.
    await rateCalculatorPage.selectElectricAndGasService();
    expect(await rateCalculatorPage.isEstimatedGasUseFieldDisabled()).toBe(false);

    // Step 4: Click the 'Calculate' button to trigger computations
    await rateCalculatorPage.clickCalculateButton();

    // Expected Result 1: Verify the calculated estimated electric use.
    // Assuming a simple calculation (Current Read - Previous Read).
    const expectedElectricUse = String(parseInt(currentRead) - parseInt(previousRead));
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe(expectedElectricUse);

    // Expected Result 2: Verify the estimated gas use.
    // Assuming '0' if no specific gas consumption input, but the field is now enabled.
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
  });

  test('should reset all form fields to their initial default states', async () => {
    // Arrange: Populate form fields with non-default values to demonstrate reset functionality
    await rateCalculatorPage.selectMonth('m12'); // Select 'December'
    await rateCalculatorPage.enterPreviousRead('50');
    await rateCalculatorPage.enterCurrentRead('150');
    await rateCalculatorPage.selectElectricService(); // Select Electric service
    await rateCalculatorPage.clickCalculateButton();

    // Assert: Verify fields are populated as expected before the reset action
    expect(await rateCalculatorPage.getMonthSelectedValue()).toBe('m12');
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('100'); // 150 - 50 = 100
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0'); 
    expect(await rateCalculatorPage.isEstimatedGasUseFieldDisabled()).toBe(true); // Gas field should remain disabled if only electric service is selected

    // Step 1: Click the 'Reset' button
    await rateCalculatorPage.clickResetButton();

    // Expected Result 1: Verify the month dropdown reverts to its initial default value ('m06' for June).
    expect(await rateCalculatorPage.getMonthSelectedValue()).toBe('m06');
    
    // Expected Result 2: Verify the estimated electric use reverts to its default initial value ('0').
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');

    // Expected Result 3: Verify the estimated gas use reverts to its default initial value ('0') and becomes disabled.
    expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
    expect(await rateCalculatorPage.isEstimatedGasUseFieldDisabled()).toBe(true); 
    
    // Additional checks for radio buttons could be added if their default selection state needs verification.
  });
});
