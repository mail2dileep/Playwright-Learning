import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('MTX-4506: Rate Calculator Visibility and Initial State', () => {
  const RATE_ESTIMATOR_URL = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/rate_estimator_residential.html';

  test('Verify initial display of Rate Calculator elements', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1:
    // Action: Navigate to the Rate Estimator Residential URL
    await rateCalculatorPage.navigateToRateEstimatorResidentialPage(RATE_ESTIMATOR_URL);

    // Expected Result: Page loads successfully and the Rate Calculator section is visible.
    await expect(page).toHaveURL(RATE_ESTIMATOR_URL);

    // Step 2:
    // Action: Check for the presence of Service Type dropdown, Meter Read fields, and Calculate/Reset buttons
    // Note: "Calculate/Reset buttons" locators were not provided in the catalog, so they cannot be asserted in this test.
    // "Service Type dropdown" refers to the radio buttons for service type in the catalog.
    // "Meter Read fields" refers to the electric and gas usage dropdowns.

    // Expected Result: All UI elements are present and displayed correctly.

    // Assert presence and visibility for Electric Usage dropdown (Meter Read field)
    await expect(rateCalculatorPage.getElectricUsageDropdown()).toBeVisible();
    await expect(rateCalculatorPage.getElectricUsageDropdown()).toBeEnabled();

    // Assert presence and visibility for Gas Usage dropdown (Meter Read field)
    await expect(rateCalculatorPage.getGasUsageDropdown()).toBeVisible();
    await expect(rateCalculatorPage.getGasUsageDropdown()).toBeEnabled();

    // Assert presence and visibility for Service Type radio buttons
    await expect(rateCalculatorPage.getServiceTypeElectricOnlyRadio()).toBeVisible();
    await expect(rateCalculatorPage.getServiceTypeElectricGasRadio()).toBeVisible();

    // Assert presence and visibility for City Limits radio buttons
    await expect(rateCalculatorPage.getCityLimitsYesRadio()).toBeVisible();
    await expect(rateCalculatorPage.getCityLimitsNoRadio()).toBeVisible();

    // Assert presence and visibility for Trash Cart radio buttons
    await expect(rateCalculatorPage.getTrashCartSmallRadio()).toBeVisible();
    await expect(rateCalculatorPage.getTrashCartMediumRadio()).toBeVisible();
    await expect(rateCalculatorPage.getTrashCartLargeRadio()).toBeVisible();
    await expect(rateCalculatorPage.getTrashCartNoneRadio()).toBeVisible();
  });
});