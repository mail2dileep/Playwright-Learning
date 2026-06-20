import { test, expect } from '@playwright/test';
import { EnergyCostCalculatorPage } from '../../pages/EnergyCostCalculatorPage';

test.describe('Verify Rate Calculator Visibility and Service Type Selection', () => {
  const energyCostCalculatorUrl = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test('should ensure rate calculator is visible and service types can be selected', async ({ page }) => {
    const calculatorPage = new EnergyCostCalculatorPage(page);

    // Step 1: Navigate to the Energy Cost Calculator URL.
    await test.step('Navigate to the Energy Cost Calculator URL', async () => {
      await calculatorPage.navigateTo(energyCostCalculatorUrl);

      // Expected Result: The Rate Calculator section is visible on the page.
      await expect(await calculatorPage.isRateCalculatorSectionVisible(), 'Expected Rate Calculator section to be visible').toBe(true);
    });

    // Step 2: Select 'Electric only' from the Service type dropdown (interpreted as radio button).
    await test.step('Select "Electric only" service type', async () => {
      await calculatorPage.selectElectricOnlyService();

      // Expected Result: The 'Electric Meter Read' field is displayed and 'Gas Meter Read' field is hidden or disabled.
      await expect(await calculatorPage.isPreviousReadFieldVisible(), 'Expected "Enter Previous Read:" field to be visible').toBe(true);
      await expect(await calculatorPage.isCurrentReadFieldVisible(), 'Expected "Enter Current Read:" field to be visible').toBe(true);
      await expect(await calculatorPage.isEstimatedGasUseFieldVisible(), 'Expected "Estimated Gas use (Ccf):" field to be visible').toBe(true);
      await expect(await calculatorPage.isEstimatedGasUseFieldEnabled(), 'Expected "Estimated Gas use (Ccf):" field to be disabled').toBe(false);
    });

    // Step 3: Select 'Electric and Gas' from the Service type dropdown (interpreted as radio button).
    await test.step('Select "Electric and Gas" service type', async () => {
      await calculatorPage.selectElectricAndGasService();

      // Expected Result: Both 'Electric Meter Read' and 'Gas Meter Read' fields are displayed and editable.
      await expect(await calculatorPage.isPreviousReadFieldVisible(), 'Expected "Enter Previous Read:" field to be visible').toBe(true);
      await expect(await calculatorPage.isCurrentReadFieldVisible(), 'Expected "Enter Current Read:" field to be visible').toBe(true);
      await expect(await calculatorPage.isEstimatedGasUseFieldVisible(), 'Expected "Estimated Gas use (Ccf):" field to be visible').toBe(true);
      await expect(await calculatorPage.isEstimatedGasUseFieldEnabled(), 'Expected "Estimated Gas use (Ccf):" field to be enabled').toBe(true);
    });
  });
});
