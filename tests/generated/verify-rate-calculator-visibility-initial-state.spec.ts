import { test, expect } from '@playwright/test';
import { RateEstimatorResidentialPage } from '../../pages/RateEstimatorResidentialPage'; // Adjust path based on project structure

test.describe('MTX-4506: Verify Rate Calculator Visibility and Initial State', () => {
  const RATE_ESTIMATOR_URL = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/rate_estimator_residential.html';

  test('should display rate calculator section and its initial elements', async ({ page }) => {
    const ratePage = new RateEstimatorResidentialPage(page);

    // Step 1: Navigate to the Rate Estimator Residential page.
    // Action: Navigate to the Rate Estimator Residential page.
    await ratePage.navigateTo(RATE_ESTIMATOR_URL);

    // Expected Result: The page loads successfully and the Rate Calculator section is visible.
    // Asserting the presence and text of the main title/header as the indicator for the calculator section.
    await expect(ratePage.getRateCalculatorSectionTitle()).toBeVisible();
    await expect(ratePage.getRateCalculatorSectionTitle()).toHaveText('Bill Estimator - Residential');

    // Step 2: Verify the presence of Service Type selection, Meter Read fields, and action buttons.
    // Expected Result: Service Type dropdown/selection, Electric/Gas Meter Read fields, Calculate button, and Reset button are all present.
    // Note: These assertions are made against placeholder locators as specific elements were not found in the provided catalog.
    // These assertions will typically fail at runtime unless elements with the placeholder data-testids are present.
    await expect(ratePage.getServiceTypeSelector()).toBeVisible();
    await expect(ratePage.getElectricMeterReadField()).toBeVisible();
    await expect(ratePage.getGasMeterReadField()).toBeVisible();
    await expect(ratePage.getCalculateButton()).toBeVisible();
    await expect(ratePage.getResetButton()).toBeVisible();
  });
});