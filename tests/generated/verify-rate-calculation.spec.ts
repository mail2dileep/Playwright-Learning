import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import

test.describe('Rate Calculator Functionality', () => {

  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigateTo();
    // Wait for the page to be stable or elements to be visible
    await page.waitForLoadState('domcontentloaded');
  });

  test('should correctly calculate estimated electric usage for Electric service type', async () => {
    // Step 1: Verify initial state defaults
    await expect(rateCalculatorPage.previousReadInput).toHaveValue('0');
    await expect(rateCalculatorPage.currentReadInput).toHaveValue('0');
    await expect(rateCalculatorPage.estimatedElectricUseInput).toHaveValue('0');
    await expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true); // 'E' is default
    await expect(await rateCalculatorPage.isElectricAndGasServiceSelected()).toBe(false);
    await expect(await rateCalculatorPage.isEstimatedGasUseEnabled()).toBe(false); // Gas use should be disabled by default
    await expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06'); // June is default

    // Step 2: Input meter reads and select month
    await rateCalculatorPage.enterPreviousRead('1000');
    await rateCalculatorPage.enterCurrentRead('1500');
    await rateCalculatorPage.selectMonth('m07'); // Select July

    // Step 3: Click Calculate
    await rateCalculatorPage.clickCalculate();

    // Step 4: Verify calculated electric usage and gas usage (should be 0)
    // Assuming calculation is (current - previous)
    await expect(await rateCalculatorPage.getEstimatedElectricUseValue()).toBe('500');
    await expect(await rateCalculatorPage.getEstimatedGasUseValue()).toBe('0'); // Should remain 0 as it's electric only
    await expect(await rateCalculatorPage.isEstimatedGasUseEnabled()).toBe(false); // Should still be disabled
  });

  test('should correctly calculate estimated electric and gas usage for Electric & Gas service type', async () => {
    // Step 1: Change service type to Electric & Gas
    await rateCalculatorPage.selectElectricAndGasServiceType();
    await expect(await rateCalculatorPage.isElectricAndGasServiceSelected()).toBe(true);
    await expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(false);
    await expect(await rateCalculatorPage.isEstimatedGasUseEnabled()).toBe(true); // Gas use should now be enabled

    // Step 2: Input meter reads (Electric and Gas values)
    await rateCalculatorPage.enterPreviousRead('1000'); // Electric previous
    await rateCalculatorPage.enterCurrentRead('1500'); // Electric current
    await rateCalculatorPage.enterEstimatedGasUse('20'); // Enter gas consumption value
    await rateCalculatorPage.selectMonth('m08'); // Select August

    // Step 3: Click Calculate
    await rateCalculatorPage.clickCalculate();

    // Step 4: Verify calculated usages
    // Assuming electric calculation is (current - previous) and gas is direct input
    await expect(await rateCalculatorPage.getEstimatedElectricUseValue()).toBe('500');
    await expect(await rateCalculatorPage.getEstimatedGasUseValue()).toBe('20'); // Assuming the entered value is just reflected or used in a calculation.
  });

  test('should reset the form fields to default values when Reset button is clicked', async () => {
    // Step 1: Input some values different from defaults
    await rateCalculatorPage.enterPreviousRead('123');
    await rateCalculatorPage.enterCurrentRead('456');
    await rateCalculatorPage.selectMonth('m12'); // Select December
    await rateCalculatorPage.selectElectricAndGasServiceType();
    await rateCalculatorPage.enterEstimatedGasUse('30');

    // Verify values are present and service type is EG
    await expect(rateCalculatorPage.previousReadInput).toHaveValue('123');
    await expect(rateCalculatorPage.currentReadInput).toHaveValue('456');
    await expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m12');
    await expect(await rateCalculatorPage.isElectricAndGasServiceSelected()).toBe(true);
    await expect(await rateCalculatorPage.isEstimatedGasUseEnabled()).toBe(true);
    await expect(await rateCalculatorPage.getEstimatedGasUseValue()).toBe('30');

    // Step 2: Click Reset
    await rateCalculatorPage.clickReset();

    // Step 3: Verify fields are reset to initial default values
    await expect(rateCalculatorPage.previousReadInput).toHaveValue('0');
    await expect(rateCalculatorPage.currentReadInput).toHaveValue('0');
    await expect(rateCalculatorPage.estimatedElectricUseInput).toHaveValue('0');
    await expect(rateCalculatorPage.estimatedGasUseInput).toHaveValue('0');
    await expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true); // Assuming 'E' is default service type
    await expect(await rateCalculatorPage.isEstimatedGasUseEnabled()).toBe(false); // Assuming gas field is disabled by default
    await expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06'); // Assuming 'June' (m06) is the default month
  });

  test('should navigate to "How to Read Your Bill" information when button is clicked', async ({ page }) => {
    // Step 1: Click the 'How to Read Your Bill' button
    // Expecting a new tab/window to open
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'), // Waits for a new page to be opened
      rateCalculatorPage.clickHowToReadYourBill()
    ]);
    // Step 2: Verify the new page URL or title (placeholder assertion)
    await expect(newPage).toBeDefined();
    await expect(newPage.url()).toContain('/how-to-read-bill'); // Placeholder URL, update with actual
    await newPage.close();
  });

  test('should navigate to "How to Find Usage" information when button is clicked', async ({ page }) => {
    // Step 1: Click the 'How to Find Usage' button
    // Expecting a new tab/window to open
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'), // Waits for a new page to be opened
      rateCalculatorPage.clickHowToFindUsage()
    ]);
    // Step 2: Verify the new page URL or title (placeholder assertion)
    await expect(newPage).toBeDefined();
    await expect(newPage.url()).toContain('/how-to-find-usage'); // Placeholder URL, update with actual
    await newPage.close();
  });
});