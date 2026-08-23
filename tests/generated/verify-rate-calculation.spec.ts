import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  let calculatorPage: RateCalculatorPage;

  // Set up the Page Object before each test
  test.beforeEach(async ({ page }) => {
    calculatorPage = new RateCalculatorPage(page);
    // Assuming the rate calculator is accessible at the root or a specific path
    // Adjust '/calculator' to the actual URL path of your application's rate calculator page
    await page.goto('/calculator');
  });

  test('should calculate electric and gas usage correctly for December', async () => {
    const month = 'm12'; // December
    const previousRead = '1000';
    const currentRead = '1500';
    const serviceType: 'electric-gas' = 'electric-gas';

    // Perform the calculation workflow using the Page Object method
    await calculatorPage.calculateUsageWorkflow(month, previousRead, currentRead, serviceType);

    // Assertions remain in the test layer
    const estimatedElectric = await calculatorPage.getEstimatedElectricUsage();
    const estimatedGas = await calculatorPage.getEstimatedGasUsage();
    const isGasInputDisabled = await calculatorPage.isEstimatedGasUsageInputDisabled();

    // Example assertions (values are illustrative, replace with actual expected results)
    expect(estimatedElectric).toBe('500'); // (1500 - 1000)
    // The gas consumption input is disabled according to the catalog. It might not be calculated or remains '0'.
    // Assuming for this scenario it remains '0' as no specific gas input was provided.
    expect(estimatedGas).toBe('0');
    expect(isGasInputDisabled).toBe(true);
  });

  test('should reset form fields to their initial state', async () => {
    // First, interact with the form to change values
    await calculatorPage.calculateUsageWorkflow('m03', '500', '600', 'electric');

    // Verify some values are set to ensure the form was indeed populated
    expect(await calculatorPage.getEstimatedElectricUsage()).toBe('100');
    expect(await calculatorPage.getCurrentSelectedMonth()).toBe('m03');
    expect(await calculatorPage.getPreviousReadValue()).toBe('500');
    expect(await calculatorPage.getCurrentReadValue()).toBe('600');

    // Now, click the reset button
    await calculatorPage.clickReset();

    // Verify fields are reset to their default/initial values from the catalog
    expect(await calculatorPage.getCurrentSelectedMonth()).toBe('m06'); // Initial currentValue for Month
    expect(await calculatorPage.getPreviousReadValue()).toBe('0'); // Initial currentValue for Enter Previous Read:
    expect(await calculatorPage.getCurrentReadValue()).toBe('0'); // Initial currentValue for Enter Current Read:
    expect(await calculatorPage.getEstimatedElectricUsage()).toBe('0'); // Initial currentValue for Estimated Electric use (kWh):
    expect(await calculatorPage.getEstimatedGasUsage()).toBe('0'); // Initial currentValue for Estimated Gas use (Ccf):
  });
});
