import { test, expect } from '@playwright/test';
import { RateEstimatorResidentialPage } from '../../pages/RateEstimatorResidentialPage'; // Relative import

test.describe('Rate Calculator Functionality on Residential Page', () => {

  let rateEstimatorPage: RateEstimatorResidentialPage;

  test.beforeEach(async ({ page }) => {
    rateEstimatorPage = new RateEstimatorResidentialPage(page);
  });

  test('MTX-4506: Verify Rate Calculator Visibility and Service Type Selection', async () => {
    // Step 1: Navigate to the Rate Estimator Residential page.
    await rateEstimatorPage.navigateToRateEstimatorResidentialPage();

    // Expected Result: The Rate Calculator section is visible on the page.
    await expect(await rateEstimatorPage.isRateCalculatorSectionVisible(), 'Rate Calculator section should be visible after navigation.').toBe(true);

    // Step 2: Select 'Electric only' from the Service type dropdown.
    await rateEstimatorPage.selectServiceType('Electric only');

    // Expected Result: The 'Electric Meter Read' field is enabled and 'Gas Meter Read' is disabled or hidden.
    await expect(await rateEstimatorPage.isElectricMeterReadFieldEnabled(), 'Electric Meter Read field should be enabled for "Electric only".').toBe(true);
    await expect(await rateEstimatorPage.isGasMeterReadFieldEnabled(), 'Gas Meter Read field should be disabled for "Electric only".').toBe(false);
    // Optional: If the field is expected to be truly hidden (not just disabled), uncomment the line below.
    // await expect(await rateEstimatorPage.isGasMeterReadFieldHidden(), 'Gas Meter Read field should be hidden for "Electric only".').toBe(true);

    // Step 3: Select 'Electric and Gas' from the Service type dropdown.
    await rateEstimatorPage.selectServiceType('Electric and Gas');

    // Expected Result: Both 'Electric Meter Read' and 'Gas Meter Read' fields are enabled for input.
    await expect(await rateEstimatorPage.isElectricMeterReadFieldEnabled(), 'Electric Meter Read field should be enabled for "Electric and Gas".').toBe(true);
    await expect(await rateEstimatorPage.isGasMeterReadFieldEnabled(), 'Gas Meter Read field should be enabled for "Electric and Gas".').toBe(true);
  });
});