import { test, expect } from '@playwright/test';
import { RateEstimatorPage } from '../pages/RateEstimatorPage'; // Relative import as per framework structure

test.describe('Residential Rate Estimator Page Functionality', () => {
  const RATE_ESTIMATOR_URL = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/rate_estimator_residential.html';

  test('MTX-4506: Verify Rate Calculator Visibility and Initial State', async ({ page }) => {
    // Instantiate the Page Object for the Rate Estimator Page
    const rateEstimatorPage = new RateEstimatorPage(page);

    await test.step('Step 1: Navigate to the CPS Energy Rate Estimator URL', async () => {
      // Action: Navigate to the specified URL using a Page Object method.
      await rateEstimatorPage.navigate(RATE_ESTIMATOR_URL);

      // Expected Result: The page loads successfully and the Rate Calculator section is visible.
      // Assertions are kept in the test layer, using Page Object's public locators.
      await expect(page).toHaveURL(RATE_ESTIMATOR_URL);
      await expect(rateEstimatorPage.electricUsageDropdown).toBeVisible({ timeout: 10000 });
    });

    await test.step('Step 2: Check for the presence of Service Type selection, Meter Read fields, and action buttons', async () => {
      // Expected Result: Service Type dropdown/selection, Electric/Gas Meter Read fields,
      // 'Calculate' button, and 'Reset' button are all present.

      // Assert presence of Service Type selection (represented by radio buttons)
      await expect(rateEstimatorPage.serviceTypeElectricRadio).toBeVisible();
      await expect(rateEstimatorPage.serviceTypeElectricGasRadio).toBeVisible();

      // Assert presence of Electric/Gas Meter Read fields (represented by dropdowns)
      await expect(rateEstimatorPage.electricUsageDropdown).toBeVisible();
      await expect(rateEstimatorPage.gasUsageDropdown).toBeVisible();

      // IMPORTANT: Locators for 'Calculate' and 'Reset' buttons were not found
      // in the provided Locator Catalog. As per strict rules, we cannot invent selectors.
      // Therefore, direct assertions for these specific elements are omitted.
      console.warn("WARNING: Locators for 'Calculate' and 'Reset' buttons were not found in the provided catalog.");
      console.warn("Cannot verify their presence as per strict locator catalog rules. Please ensure all required locators are available.");
    });
  });
})