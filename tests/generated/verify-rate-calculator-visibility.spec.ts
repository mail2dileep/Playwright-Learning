import { test, expect } from '@playwright/test';
import { RateEstimatorResidentialPage } from '../../pages/RateEstimatorResidentialPage';

// Requirement ID: MTX-4506
// Test Name: Verify Rate Calculator Visibility

test.describe('MTX-4506 - Verify Rate Calculator Visibility', () => {
  test('Verify Rate Calculator Visibility', async ({ page }) => {
    const rateEstimatorPage = new RateEstimatorResidentialPage(page);

    await test.step('Navigate to the CPS Energy Rate Estimator URL', async () => {
      await rateEstimatorPage.goto();
      await rateEstimatorPage.waitForReady();
      await rateEstimatorPage.acceptCookiesIfPresent();
    });

    await test.step('Validate the Rate Calculator section is visible', async () => {
      await rateEstimatorPage.waitForRateCalculatorVisible({ timeout: 20000 });
      const isVisible = await rateEstimatorPage.isRateCalculatorSectionVisible();
      expect(isVisible).toBeTruthy();
    });
  });
});
