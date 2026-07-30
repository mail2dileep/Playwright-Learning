import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Service Type Selection Functionality', () => {
  let calculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new RateCalculatorPage(page);
    // Assume navigation to the calculator page is handled here
    // For example: await page.goto('/rate-calculator'); 
    // Or the test environment ensures the page is already open
  });

  test('MTX-4433: Verify selecting "Electric only" updates input fields correctly', async ({ page }) => {
    test.info().annotations.push(
      { type: 'Objective', description: 'Validate that selecting \'Electric only\' updates the input fields accordingly.' },
      { type: 'Priority', description: 'High' }
    );

    // Step 1: Action - Select 'Electric only' service type
    await test.step('Select \'Electric only\' from the Service Type options', async () => {
      await calculatorPage.selectServiceTypeElectricOnly();
    });

    // Expected Result: The 'Electric Meter Read' field is enabled/visible and 'Gas Meter Read' is disabled or hidden.
    await test.step('Verify the state of electric and gas meter read fields', async () => {
      // Check the 'Enter Previous Read:' field (part of electric meter read input)
      await expect(calculatorPage.getPreviousReadField()).toBeEnabled();
      await expect(calculatorPage.getPreviousReadField()).toBeVisible();

      // Check the 'Enter Current Read:' field (part of electric meter read input)
      await expect(calculatorPage.getCurrentReadField()).toBeEnabled();
      await expect(calculatorPage.getCurrentReadField()).toBeVisible();

      // Check the 'Estimated Electric use (kWh):' field
      await expect(calculatorPage.getEstimatedElectricUseField()).toBeEnabled();
      await expect(calculatorPage.getEstimatedElectricUseField()).toBeVisible();

      // Check the 'Estimated Gas use (Ccf):' field
      await expect(calculatorPage.getEstimatedGasUseField()).toBeDisabled();
      await expect(calculatorPage.getEstimatedGasUseField()).toBeVisible(); // It should be visible but disabled
    });
  });
});
