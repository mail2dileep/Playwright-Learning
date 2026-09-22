import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.goto(); // Navigate using Page Object method
  });

  test('should calculate estimated electric use correctly for Electric service type', async () => {
    // Step 1: Input meter reads
    await rateCalculatorPage.enterPreviousRead('100');
    await rateCalculatorPage.enterCurrentRead('200');

    // Step 2: Select Electric service type
    await rateCalculatorPage.selectElectricServiceType();
    await expect(await rateCalculatorPage.isElectricServiceTypeSelected()).toBe(true);
    await expect(await rateCalculatorPage.isElectricGasServiceTypeSelected()).toBe(false);

    // Step 3: Select a month (e.g., December 'm12')
    await rateCalculatorPage.selectMonth('m12');
    await expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m12');

    // Step 4: Click Calculate
    await rateCalculatorPage.clickCalculate();

    // Step 5: Verify estimated electric use
    // Assuming calculation logic: (Current Read - Previous Read) = Estimated Electric use (kWh)
    // For input 100 and 200, the expected result is '100'.
    await expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('100');

    // Step 6: Verify estimated gas use is disabled and remains '0' for electric-only service
    await expect(await rateCalculatorPage.isEstimatedGasUseInputDisabled()).toBe(true);
    await expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
  });

  test('should reset all input fields and selections to default', async () => {
    // Step 1: Fill some data to be reset
    await rateCalculatorPage.enterPreviousRead('500');
    await rateCalculatorPage.enterCurrentRead('700');
    await rateCalculatorPage.selectElectricGasServiceType();
    await rateCalculatorPage.selectMonth('m03'); // March

    // Step 2: Verify data is filled/selected using Page Object getters
    await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('500');
    await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('700');
    await expect(await rateCalculatorPage.isElectricGasServiceTypeSelected()).toBe(true);
    await expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m03');

    // Step 3: Click Reset button
    await rateCalculatorPage.clickReset();

    // Step 4: Verify fields are reset to initial default values
    // Based on the Locator Catalog, default input values are '0', and default selected month is 'm06' (June) for the dropdown.
    await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
    await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
    await expect(await rateCalculatorPage.isElectricServiceTypeSelected()).toBe(true); // Assuming 'Electric' is the default radio button selection after reset.
    await expect(await rateCalculatorPage.isElectricGasServiceTypeSelected()).toBe(false);
    await expect(await rateCalculatorPage.getPage.locator('Month').getSelectedMonthValue()).toBe('m06'); // Default month is June ('m06')

    // Step 5: Verify estimated fields are also reset
    await expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
    await expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
  });

  test('should allow interacting with "How to Read Your Bill" information button', async ({ page }) => {
    // Step 1: Click the 'How to Read Your Bill' button
    await rateCalculatorPage.clickHowToReadYourBill();

    // Step 2: Verify the outcome of the click.
    // As the exact behavior (e.g., opens modal, navigates to a new page) is not specified, a generic assertion is used.
    // In a real application, more specific assertions would be added here, e.g.:
    // - If it navigates: await expect(page).toHaveURL(/.*how-to-read-bill/);
    // - If it opens a modal: await expect(page.locator('[role="dialog"]')).toBeVisible();
    // For this exercise, we will await for network idle to ensure any potential navigation or content loading has completed.
    await page.waitForLoadState('networkidle');
    // TODO: Add robust assertion to verify the outcome of clicking 'How to Read Your Bill' (e.g., URL change, modal visibility, content presence).
  });
});