import { test, expect } from '@playwright/test';
import { EnergyCostCalculatorPage } from '../../pages/EnergyCostCalculatorPage';

test.describe('Energy Cost Calculator Page - Initial State Verification', () => {

  const ENERGY_CALCULATOR_URL = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test('MTX-4433: Verify Rate Calculator Visibility and Initial State', async ({ page }) => {
    const energyCostCalculatorPage = new EnergyCostCalculatorPage(page);

    await test.step('Step 1: Navigate to the Energy Cost Calculator page.', async () => {
      await energyCostCalculatorPage.navigateTo(ENERGY_CALCULATOR_URL);
      // Expected Result: Rate calculator section is visible on the page.
      await expect(await energyCostCalculatorPage.isCalculatorSectionVisible()).toBe(true);
    });

    await test.step('Step 2: Check for Service Type selection options.', async () => {
      // Expected Result: Options for 'Electric only' and 'Electric and Gas' are present.
      await expect(await energyCostCalculatorPage.isElectricServiceOptionPresent()).toBe(true);
      await expect(await energyCostCalculatorPage.isElectricAndGasServiceOptionPresent()).toBe(true);
    });

    await test.step('Step 3: Verify presence of help links.', async () => {
      // Expected Result: 'How to read your bill' and 'How to find Usage' links are visible.
      await expect(await energyCostCalculatorPage.isHowToReadYourBillLinkVisible()).toBe(true);
      await expect(await energyCostCalculatorPage.isHowToFindUsageLinkVisible()).toBe(true);
    });

    // Additional initial state verification based on catalog's currentValue and disabled attributes
    await test.step('Step 4: Verify default input values and states.', async () => {
      await expect(await energyCostCalculatorPage.getPreviousReadValue()).toBe('0');
      await expect(await energyCostCalculatorPage.getCurrentReadValue()).toBe('0');
      await expect(await energyCostCalculatorPage.getEstimatedElectricUse()).toBe('0');
      // 'Estimated Gas use (Ccf)' is disabled, so we verify its value but do not interact with it.
      await expect(await energyCostCalculatorPage.getEstimatedGasUse()).toBe('0');
      
      // Verify initial selected month based on 'currentValue' from the locator catalog.
      await expect(await energyCostCalculatorPage.getSelectedMonth()).toBe('m06');
    });

  });
});