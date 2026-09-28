import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  // Placeholder for actual application URL. In a real scenario, this would likely be configured
  // in playwright.config.ts or passed via environment variables.
  const TEST_URL = '/calculator';

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigate(TEST_URL);
    // Ensure the page is loaded and main elements are visible before proceeding with tests
    await expect(rateCalculatorPage.page.getByLabel('Month')).toBeVisible();
  });

  test('should successfully calculate electric bill for October', async () => {
    const month = 'm10'; // Value for October from locator catalog
    const previousRead = '1000';
    const currentRead = '1500';
    const expectedElectricUse = '500'; // Assuming a simple calculation for demonstration

    test.info().annotations.push({ type: 'Test Objective', description: 'Verify electric bill calculation for a specific month and meter readings.' });

    // Step 1: Select month
    await rateCalculatorPage.selectMonth(month);
    await expect(await rateCalculatorPage.getSelectedMonth()).toBe(month);

    // Step 2: Enter Previous Read
    await rateCalculatorPage.enterPreviousRead(previousRead);
    await expect(await rateCalculatorPage.getPreviousReadValue()).toBe(previousRead);

    // Step 3: Enter Current Read
    await rateCalculatorPage.enterCurrentRead(currentRead);
    await expect(await rateCalculatorPage.getCurrentReadValue()).toBe(currentRead);

    // Step 4: Select Electric service type
    await rateCalculatorPage.selectElectricService();
    await expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true);
    await expect(await rateCalculatorPage.isElectricGasServiceSelected()).toBe(false);

    // Verify Gas use input is disabled initially for Electric only service, as per catalog
    await expect(await rateCalculatorPage.isGasUseInputDisabled()).toBe(true);
    await expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0'); // Current value from catalog

    // Step 5: Click Calculate
    await rateCalculatorPage.clickCalculate();

    // Step 6: Verify the estimated electric use
    await expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe(expectedElectricUse);

    // Verify estimated gas use remains disabled and '0'
    await expect(await rateCalculatorPage.isGasUseInputDisabled()).toBe(true);
    await expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
  });

  test('should reset form fields when reset button is clicked', async () => {
    test.info().annotations.push({ type: 'Test Objective', description: 'Verify all input fields and selections are reset to default values upon clicking the Reset button.' });

    // Fill some fields first
    await rateCalculatorPage.selectMonth('m11');
    await rateCalculatorPage.enterPreviousRead('200');
    await rateCalculatorPage.enterCurrentRead('300');
    await rateCalculatorPage.selectElectricGasService();

    // Verify fields are filled with the entered values
    await expect(await rateCalculatorPage.getSelectedMonth()).toBe('m11');
    await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('200');
    await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('300');
    await expect(await rateCalculatorPage.isElectricGasServiceSelected()).toBe(true);

    // Click reset
    await rateCalculatorPage.clickReset();

    // Verify fields are reset to initial default values as per locator catalog
    // Month defaults to 'm06' from catalog
    await expect(await rateCalculatorPage.getSelectedMonth()).toBe('m06');
    // Input fields default to '0' from catalog
    await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    // Assuming 'Electric' ('e') is the default radio button selection after reset, 
    // as 'E' has a current value and 'EG' also does, but a reset typically goes to the first default or 'E'.
    await expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true);
    await expect(await rateCalculatorPage.isElectricGasServiceSelected()).toBe(false);
  });
});
