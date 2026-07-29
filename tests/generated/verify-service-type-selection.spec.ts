import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage'; // Adjust the path as needed

test.describe('Rate Calculator - Service Type Selection', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Navigate to the application's base URL or the specific page for the calculator.
    // In a real enterprise setup, this URL would be configured centrally (e.g., via a config file).
    await rateCalculatorPage.navigateTo('http://localhost:3000/rate-calculator'); // Placeholder URL
  });

  test('MTX-4433: Verify selecting "Electric and Gas" service type enables relevant fields', async () => {
    // Step 1: Select 'Electric and Gas' from the Service Type radio button group.
    await test.step('Action: Select "Electric and Gas" service type', async () => {
      await rateCalculatorPage.selectServiceType('Electric and Gas');
    });

    // Expected Result: Both 'Electric Meter Read' and 'Gas Meter Read' fields are enabled and visible.
    // This corresponds to 'Enter Previous Read:', 'Enter Current Read:', 'Estimated Electric use (kWh):' and 'Estimated Gas use (Ccf):' inputs.
    await test.step('Verification: Relevant electric and gas fields are enabled and visible', async () => {
      // Verify 'Enter Previous Read:' field
      await expect(await rateCalculatorPage.isPreviousElectricReadInputEnabled(), 'Previous Electric Read input should be enabled').toBeTruthy();
      await expect(await rateCalculatorPage.isPreviousElectricReadInputVisible(), 'Previous Electric Read input should be visible').toBeTruthy();

      // Verify 'Enter Current Read:' field
      await expect(await rateCalculatorPage.isCurrentElectricReadInputEnabled(), 'Current Electric Read input should be enabled').toBeTruthy();
      await expect(await rateCalculatorPage.isCurrentElectricReadInputVisible(), 'Current Electric Read input should be visible').toBeTruthy();

      // Verify 'Estimated Electric use (kWh):' field
      await expect(await rateCalculatorPage.isEstimatedElectricUseInputEnabled(), 'Estimated Electric Use input should be enabled').toBeTruthy();
      await expect(await rateCalculatorPage.isEstimatedElectricUseInputVisible(), 'Estimated Electric Use input should be visible').toBeTruthy();

      // Verify 'Estimated Gas use (Ccf):' field (crucial, as it starts disabled)
      await expect(await rateCalculatorPage.isEstimatedGasUseInputEnabled(), 'Estimated Gas Use input should be enabled').toBeTruthy();
      await expect(await rateCalculatorPage.isEstimatedGasUseInputVisible(), 'Estimated Gas Use input should be visible').toBeTruthy();
    });
  });
});
