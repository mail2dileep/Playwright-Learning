import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary

test.describe('Rate Calculator Default Behavior for New Users', () => {

  test('should load the calculator with default initial values', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Open the site in a private/incognito window or clear all site cookies.
    // Playwright's 'page' fixture typically provides a fresh browser context for each test,
    // effectively clearing cookies and local storage between tests.
    // If persistent state is a concern, configure 'storageState: { cookies: [] }' in playwright.config.ts
    // or use a separate context for the test if explicitly needed for specific scenarios.

    // Step 2: Access the site URL.
    // NOTE: The provided input data URL "https://credera.atlassian.net/browse/MTX-4945"
    // does not match a rate calculator application.
    // Assuming 'baseURL' is configured in playwright.config.ts to point to the actual application's URL.
    await rateCalculatorPage.navigateTo();

    // Expected Result for Step 2:
    // The site loads with the default global header and generic navigation/CTAs.
    // As per requirement, asserting for a prominent calculator element to confirm page load.
    await expect(rateCalculatorPage.isCalculatorPageVisible(), 'Rate calculator page should be visible').resolves.toBe(true);

    // Additional assertions based on default values from Locator Catalog
    await expect(rateCalculatorPage.getSelectedMonthValue(), 'Default month should be June (m06)').resolves.toBe('m06');
    await expect(rateCalculatorPage.getPreviousReadValue(), 'Previous Read input should default to 0').resolves.toBe('0');
    await expect(rateCalculatorPage.getCurrentReadValue(), 'Current Read input should default to 0').resolves.toBe('0');
    await expect(rateCalculatorPage.getEstimatedElectricUse(), 'Estimated Electric use should default to 0').resolves.toBe('0');
    await expect(rateCalculatorPage.getEstimatedGasUse(), 'Estimated Gas use should default to 0').resolves.toBe('0'); // Disabled input, verifying default value
    await expect(rateCalculatorPage.isElectricServiceSelected(), 'Electric service type should be selected by default').resolves.toBe(true);
    await expect(rateCalculatorPage.isElectricAndGasServiceSelected(), 'Electric and Gas service type should not be selected by default').resolves.toBe(false);

    // Example of interacting with calculator (not explicitly required by this test's steps but good practice to show interaction potential)
    // await rateCalculatorPage.selectMonth('m07'); // Select July
    // await rateCalculatorPage.enterPreviousRead('100');
    // await rateCalculatorPage.enterCurrentRead('200');
    // await rateCalculatorPage.clickCalculate();
    // await expect(rateCalculatorPage.getEstimatedElectricUse(), 'Calculated electric use should be updated').resolves.not.toBe('0');
  });
}