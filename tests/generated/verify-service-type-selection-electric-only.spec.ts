import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import

test.describe('Service Type Selection', () => {
  let rateCalculatorPage: RateCalculatorPage;

  // A common pattern is to navigate to the page before each test.
  // This ensures a clean state for every test scenario.
  // test.beforeEach(async ({ page }) => {
  //   await page.goto('/your-calculator-page-path'); // Replace with the actual URL segment
  // });

  test('Verify Service Type Selection - Electric Only', async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);

    // Assume navigation to the base URL has occurred in a global setup or beforeEach.
    // If not, uncomment and update the page.goto line above or here:
    // await page.goto('YOUR_APP_BASE_URL/calculator');

    // Step 1: Select 'Electric only' from the Service Type dropdown.
    // Input Data: Service Type: Electric only
    await rateCalculatorPage.selectElectricOnlyService();

    // Expected Result: Electric Meter Read field is enabled; Gas Meter Read field is disabled or hidden.
    await expect(rateCalculatorPage.getPreviousMeterReadInput()).toBeEnabled();
    await expect(rateCalculatorPage.getEstimatedGasUseInput()).toBeDisabled();

    // Step 2: Enter a value in the Electric Meter Read field and click Calculate.
    // Input Data: Electric Meter Read: 500
    await rateCalculatorPage.enterPreviousMeterRead('500');
    await rateCalculatorPage.clickCalculate();

    // Expected Result: The calculated price for electric usage is displayed.
    // TODO: Locator not found in catalog for the displayed calculated price.
    // A proper assertion would require a locator for the element displaying the calculated result.
    // Example: await expect(rateCalculatorPage.getCalculatedElectricPriceDisplay()).toBeVisible();
    // Example: await expect(rateCalculatorPage.getCalculatedElectricPriceDisplay()).toHaveText('$XX.XX');
  });
});