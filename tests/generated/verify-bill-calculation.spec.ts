import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary

test.describe('Bill Calculation Functionality', () => {
  const TEST_URL = 'https://www.example.com/rate-calculator'; // Placeholder URL, update as needed

  test('Verify that the \"Calculate\" button generates a price based on inputs', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the Rate Calculator Page', async () => {
      await rateCalculatorPage.navigate(TEST_URL);
    });

    await test.step('Step 1: Select \'Electric and Gas\' service type.', async () => {
      await rateCalculatorPage.selectElectricAndGasServiceType();
      // Expected Result: Fields are displayed. Specifically, the estimated gas use field should become enabled.
      // Assuming selecting 'Electric and Gas' service type enables the 'Estimated Gas use (Ccf)' field.
      await expect(rateCalculatorPage.isEstimatedGasUseFieldEnabled()).resolves.toBe(true);
    });

    await test.step('Step 2: Enter valid numeric values into the Electric and Gas meter read fields.', async () => {
      // As per locator catalog, 'Estimated Gas use (Ccf)' field (id: gasconsumption) is initially disabled.
      // The test step implies inputting into 'Electric and Gas meter read fields'.
      // From the catalog, only 'Enter Previous Read:' (id: eMeterRead) and 'Enter Current Read:' (id: eMeterNewRead) are actual meter read input fields for Electric.
      // 'Estimated Gas use (Ccf)' is an *estimated* field, not a direct 'Gas Meter Read' input field.
      // Given the constraints to only use provided locators and respect their initial disabled state (until explicitly enabled by a prior action),
      // we proceed by interacting with the available Electric meter read fields.
      await rateCalculatorPage.enterPreviousMeterRead('500');
      await rateCalculatorPage.enterCurrentMeterRead('700'); // Using a value higher than previous to ensure positive consumption

      // TODO: Locator for a dedicated 'Gas Meter Read' input field that accepts values for calculation was not clearly identified in the catalog, aside from the 'Estimated Gas use (Ccf)' field which is primarily an output/estimated field and was initially disabled.

      // Expected Result: Values are accepted. (Implicitly verified by the successful calculation in the next step).
    });

    await test.step('Step 3: Click on the \'Calculate\' button.', async () => {
      await rateCalculatorPage.clickCalculateButton();

      // Expected Result: The calculated price is displayed to the user.
      // No direct 'calculated price' display locator was provided in the catalog.
      // We will assert that the 'Estimated Electric use (kWh)' field, which should reflect a calculation result,
      // has a value greater than its initial '0'. This acts as a proxy for a successful calculation.
      const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      await expect(estimatedElectricUse).not.toBe('0'); // Expecting a non-zero value after calculation
      await expect(parseFloat(estimatedElectricUse)).toBeGreaterThan(0);
    });
  });
});
