import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage'; // Relative path as per requirements

test.describe('Rate Calculator Functionality', () => {
  // A beforeEach hook to navigate to the application URL
  // Assuming the base URL is configured in playwright.config.ts
  test.beforeEach(async ({ page }) => {
    // Replace with the actual URL of your Rate Calculator page
    // Example: await page.goto('https://example.com/rate-calculator');
    await page.goto('http://localhost:3000/rate-calculator'); 
  });

  test('should successfully calculate electric usage when only electric service is selected', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Select July as the month', async () => {
      await rateCalculatorPage.selectMonth('m07');
    });

    await test.step('Enter previous meter read as 100', async () => {
      await rateCalculatorPage.enterPreviousRead('100');
    });

    await test.step('Enter current meter read as 250', async () => {
      await rateCalculatorPage.enterCurrentRead('250');
    });

    await test.step('Select Electric service type', async () => {
      await rateCalculatorPage.selectServiceType('Electric');
    });

    await test.step('Click the Calculate button', async () => {
      await rateCalculatorPage.clickCalculate();
    });

    await test.step('Verify estimated electric use is 150 kWh', async () => {
      const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(estimatedElectricUse).toBe('150');
    });

    await test.step('Verify estimated gas use remains 0 Ccf (disabled field)', async () => {
      const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
      expect(estimatedGasUse).toBe('0');
    });

    await test.step('Verify selected month is July (m07)', async () => {
      const selectedMonth = await rateCalculatorPage.getSelectedMonthValue();
      expect(selectedMonth).toBe('m07');
    });

    await test.step('Verify previous read input value is 100', async () => {
      const previousRead = await rateCalculatorPage.getPreviousReadValue();
      expect(previousRead).toBe('100');
    });

    await test.step('Verify current read input value is 250', async () => {
      const currentRead = await rateCalculatorPage.getCurrentReadValue();
      expect(currentRead).toBe('250');
    });
  });

  test('should reset all input fields to default values when the Reset button is clicked', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Fill out some fields initially', async () => {
      await rateCalculatorPage.selectMonth('m09'); // September
      await rateCalculatorPage.enterPreviousRead('50');
      await rateCalculatorPage.enterCurrentRead('150');
      await rateCalculatorPage.selectServiceType('Electric & Gas');
      await rateCalculatorPage.clickCalculate(); // Perform calculation to populate estimated fields
    });

    await test.step('Click the Reset button', async () => {
      await rateCalculatorPage.clickReset();
    });

    await test.step('Verify all input fields are reset to their initial default values', async () => {
      // The default month from the catalog is 'm06' (June)
      expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06');
      // Default values for meter reads and consumption from catalog are '0'
      expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
      expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
      expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
      expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
      // Verifying the radio button selection after reset would require checking the initial state or default selection behavior.
      // For this example, we assume it defaults to a state where the 'Estimated Gas use' is 0, which is consistent with the initial disabled state.
    });
  });

  test('should successfully calculate usage when Electric & Gas service is selected', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Select August as the month', async () => {
      await rateCalculatorPage.selectMonth('m08');
    });

    await test.step('Enter previous electric read as 200', async () => {
      await rateCalculatorPage.enterPreviousRead('200');
    });

    await test.step('Enter current electric read as 400', async () => {
      await rateCalculatorPage.enterCurrentRead('400');
    });

    await test.step('Select Electric & Gas service type', async () => {
      await rateCalculatorPage.selectServiceType('Electric & Gas');
      // Assuming this enables the gas consumption field and allows it to be calculated
    });

    await test.step('Click the Calculate button', async () => {
      await rateCalculatorPage.clickCalculate();
    });

    await test.step('Verify estimated electric use is 200 kWh', async () => {
      // Actual calculation logic might differ, this is an example based on input logic
      const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(estimatedElectricUse).toBe('200'); 
    });

    await test.step('Verify estimated gas use is also calculated (assuming 10 for example)', async () => {
      // The behavior of gas consumption calculation is not specified by locators alone.
      // Assuming a non-zero value implies it's now active.
      const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
      // Placeholder for actual expected gas usage value after 'Electric & Gas' selection
      expect(estimatedGasUse).not.toBe('0'); 
    });

    await test.step('Verify selected month is August (m08)', async () => {
      const selectedMonth = await rateCalculatorPage.getSelectedMonthValue();
      expect(selectedMonth).toBe('m08');
    });
  });
});
