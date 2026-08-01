import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {

  const BASE_URL = 'https://www.example.com/calculator'; // Placeholder URL for the application under test

  test('Validate Reset Functionality', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the Rate Calculator page', async () => {
      await rateCalculatorPage.goto(BASE_URL);
      // Assert that a key element is visible, indicating the page loaded correctly
      await expect(rateCalculatorPage.page.getByLabel('Month')).toBeVisible();
    });

    await test.step('Step 1: Enter values into the meter read fields and click Calculate.', async () => {
      // Input Data: Electric: 300, Gas: 50
      // To achieve 300 kWh electric use, we'll set previous read to 100 and current read to 400.
      // Gas consumption field is disabled, so we expect it to remain 0.
      await rateCalculatorPage.enterPreviousRead('100');
      await rateCalculatorPage.enterCurrentRead('400');
      await rateCalculatorPage.selectElectricService(); // Ensure Electric service is selected for calculation
      await rateCalculatorPage.clickCalculate();

      // Expected Result: Calculation result is displayed.
      await expect(rateCalculatorPage.getEstimatedElectricUse()).toHaveValue('300');
      // As per locator catalog, gasconsumption is disabled, so it should retain its default value.
      await expect(rateCalculatorPage.getEstimatedGasUse()).toHaveValue('0');
    });

    await test.step('Step 2: Click the Reset button.', async () => {
      await rateCalculatorPage.clickReset();

      // Expected Result: All input fields are cleared and the calculation result is removed.
      // Input fields for meter reads and estimated usage should reset to their default '0' values.
      await expect(rateCalculatorPage.getPreviousReadValue()).toHaveValue('0');
      await expect(rateCalculatorPage.getCurrentReadValue()).toHaveValue('0');
      await expect(rateCalculatorPage.getEstimatedElectricUse()).toHaveValue('0');
      await expect(rateCalculatorPage.getEstimatedGasUse()).toHaveValue('0');

      // Verify that the default radio button for 'Electric' service is still checked after reset.
      await expect(rateCalculatorPage.page.locator('#e')).toBeChecked();
    });
  });
});
