import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary based on project structure

test.describe('Rate Calculator Functionality', () => {
  const TEST_URL = 'http://localhost:3000/rate-calculator'; // Placeholder URL - update with actual application URL

  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URL);
    // Ensure the page is loaded and key calculator elements are visible before each test
    await expect(page.getByLabel('Month')).toBeVisible(); 
    await expect(page.getByLabel('Enter Previous Read:')).toBeVisible();
    await expect(page.locator('#validateMoveInBtn')).toBeVisible(); // Calculate button
  });

  test('should calculate electric usage correctly for Electric & Gas service', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    const monthValue = 'm07'; // July
    const previousRead = '1000';
    const currentRead = '1250';

    await rateCalculatorPage.selectBillingMonth(monthValue);
    await rateCalculatorPage.enterPreviousRead(previousRead);
    await rateCalculatorPage.enterCurrentRead(currentRead);
    await rateCalculatorPage.selectElectricAndGasServiceType();
    
    // Verify radio button states
    await expect(page.locator('#eg')).toBeChecked();
    await expect(page.locator('#e')).not.toBeChecked();

    await rateCalculatorPage.clickCalculate();

    // Verification of estimated electric use
    // The exact expected value depends on the application's business logic.
    // Here, we assert it's a positive number and an example value if known.
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(Number(estimatedElectricUse)).toBeGreaterThan(0);
    expect(estimatedElectricUse).not.toBe('0');
    expect(estimatedElectricUse).toBe('250'); // Example expected value based on (1250-1000)
    
    // Verify estimated gas consumption. Given the field is disabled and no gas inputs provided,
    // it is expected to remain at its default '0' value in this scenario.
    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).toBe('0'); 
  });

  test('should reset form fields to their initial state', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Fill some fields to prepare for reset
    await rateCalculatorPage.selectBillingMonth('m08'); // August
    await rateCalculatorPage.enterPreviousRead('500');
    await rateCalculatorPage.enterCurrentRead('750');
    await rateCalculatorPage.selectElectricServiceType();

    // Assert fields are filled with test data
    await expect(page.getByLabel('Enter Previous Read:')).toHaveValue('500');
    await expect(page.getByLabel('Enter Current Read:')).toHaveValue('750');
    await expect(page.locator('#e')).toBeChecked();

    // Perform the reset action
    await rateCalculatorPage.clickReset();

    // Assert fields are reset to their initial values
    await expect(page.getByLabel('Enter Previous Read:')).toHaveValue('0');
    await expect(page.getByLabel('Enter Current Read:')).toHaveValue('0');
    // Assuming radio buttons are unchecked or default to a specific state upon reset
    await expect(page.locator('#e')).not.toBeChecked(); 
    await expect(page.locator('#eg')).not.toBeChecked(); 
    
    // Check if the month selection resets to its default, which is 'm06' (June) based on catalog's currentValue.
    const selectedMonth = await rateCalculatorPage.getSelectedMonth();
    expect(selectedMonth).toContain('m06'); 
  });
});