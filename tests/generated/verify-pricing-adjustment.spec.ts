import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import for Page Object

test.describe('Pricing Adjustment Verification', () => {

  // Define placeholder URLs for AEM author and live sites.
  // In a real enterprise setup, these would be configured via environment variables or a configuration file.
  const AEM_AUTHOR_URL = 'http://localhost:4502/editor.html/content/mysite/us/en/rate-calculator.html';
  const LIVE_RATE_CALCULATOR_URL = 'http://localhost:8080/content/mysite/us/en/rate-calculator.html';

  test('Verify author can adjust pricing values and they reflect on live site', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Log in to the AEM author instance and open the Rate Calculator component properties.
    console.log('Executing Test Step 1: Navigating to AEM and logging in...');
    await rateCalculatorPage.navigateToAEMAuthoring(AEM_AUTHOR_URL);
    await rateCalculatorPage.loginToAEM('admin', 'admin'); // Input Data: Author credentials
    await rateCalculatorPage.openRateCalculatorComponentProperties();
    // Expected Result: Component properties dialog opens.
    // TODO: Add an assertion here to verify the component properties dialog is open.
    // This requires a locator for the dialog itself, which is not in the provided catalog.

    // Step 2: Modify the 'Electric fuel' and 'Gas fuel' pricing values.
    console.log('Executing Test Step 2: Modifying fuel pricing values in AEM...');
    await rateCalculatorPage.setElectricFuelPricingInAEM('0.15'); // Input Data: Electric fuel: 0.15
    await rateCalculatorPage.setGasFuelPricingInAEM('0.85');   // Input Data: Gas fuel: 0.85
    await rateCalculatorPage.saveAEMComponentProperties();
    // Expected Result: Values are saved successfully.
    // TODO: Add an assertion here to verify successful saving (e.g., a success message).
    // This requires locators for feedback elements, not in the catalog.

    // Step 3: Publish the page and verify the calculation on the live site reflects the new rates.
    console.log('Executing Test Step 3: Publishing page and verifying on live site...');
    await rateCalculatorPage.publishPage();
    // TODO: Add an assertion here to verify successful page publication.

    // Navigate to the live site to verify the changes
    await rateCalculatorPage.navigateToLiveRateCalculator(LIVE_RATE_CALCULATOR_URL);

    // Perform a calculation on the live site using arbitrary values to test the updated rates.
    const previousReadValue = '100';
    const currentReadValue = '200';
    const expectedElectricKwhUsage = (parseInt(currentReadValue) - parseInt(previousReadValue)).toString();

    await rateCalculatorPage.selectBillingMonth('m07'); // Select July
    await rateCalculatorPage.enterPreviousRead(previousReadValue);
    await rateCalculatorPage.enterCurrentRead(currentReadValue);
    await rateCalculatorPage.selectServiceType('Electric'); // Choose Electric service type
    await rateCalculatorPage.clickCalculate();

    // Verify the estimated electric use (kWh) is correct based purely on meter readings.
    // This assertion confirms the calculation of *usage*, not directly the *pricing*.
    const actualEstimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(actualEstimatedElectricUse).toBe(expectedElectricKwhUsage);

    // Expected Result: The live calculator uses the updated pricing values for calculations.
    // TODO: A direct assertion to confirm the '0.15' and '0.85' rates are applied is not possible
    // with the provided Locator Catalog as there is no locator for the final calculated bill amount
    // or specific rate display on the public calculator.
    // If a result locator were available, an assertion would look like:
    // const actualBillAmount = await rateCalculatorPage.getCalculatedBillAmount();
    // expect(actualBillAmount).toBe('Expected Calculated Amount based on new rates');

    console.log(`Successfully verified estimated electric use: ${actualEstimatedElectricUse} kWh.`);
    console.log('Verification of pricing application is limited due to the absence of a final bill amount locator in the catalog.');
  });
});
