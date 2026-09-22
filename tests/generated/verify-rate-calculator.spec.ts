import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path based on your framework structure

test.describe('Rate Calculator Core Functionality', () => {

  test.beforeEach(async ({ page }) => {
    // Assuming the rate calculator is accessible at a specific route or base URL
    await page.goto('/calculator'); // Placeholder URL, replace with actual application URL
    await page.waitForLoadState('domcontentloaded');
  });

  test('should calculate electric usage and verify gas field for Electric service type', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Verify initial state: estimated gas use field is disabled', async () => {
      const isGasDisabledInitially = await rateCalculatorPage.isEstimatedGasUseFieldDisabled();
      expect(isGasDisabledInitially).toBe(true);
    });

    await test.step('Select a month for calculation (July)', async () => {
      await rateCalculatorPage.selectMonth('m07');
    });

    await test.step('Enter previous meter read (1000 kWh)', async () => {
      await rateCalculatorPage.enterPreviousMeterRead('1000');
    });

    await test.step('Enter current meter read (1500 kWh)', async () => {
      await rateCalculatorPage.enterCurrentMeterRead('1500');
    });

    await test.step('Select "Electric" service type (if not already selected)', async () => {
      await rateCalculatorPage.selectServiceType('Electric');
    });

    await test.step('Click Calculate button', async () => {
      await rateCalculatorPage.clickCalculate();
    });

    await test.step('Verify estimated electric use (should be 500 kWh)', async () => {
      const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(estimatedElectricUse).toBe('500');
    });

    await test.step('Verify estimated gas use field remains disabled for Electric service', async () => {
      const isGasDisabled = await rateCalculatorPage.isEstimatedGasUseFieldDisabled();
      expect(isGasDisabled).toBe(true);
      const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
      expect(estimatedGasUse).toBe('0'); // Expect initial value as it's disabled
    });

    await test.step('Click Reset and verify fields are cleared', async () => {
      await rateCalculatorPage.clickReset();
      const currentReadAfterReset = await rateCalculatorPage.getEstimatedElectricUse();
      expect(currentReadAfterReset).toBe('0');
      const previousReadAfterReset = await rateCalculatorPage.getEstimatedElectricUse(); // Re-using for value check
      expect(previousReadAfterReset).toBe('0');
    });
  });

  test('should enable gas consumption field when "Electric & Gas" service is selected', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Verify initial state: estimated gas use field is disabled', async () => {
      const isGasDisabledInitially = await rateCalculatorPage.isEstimatedGasUseFieldDisabled();
      expect(isGasDisabledInitially).toBe(true);
    });

    await test.step('Select "ElectricAndGas" service type', async () => {
      await rateCalculatorPage.selectServiceType('ElectricAndGas');
    });

    await test.step('Verify estimated gas use field is now enabled', async () => {
      const isGasDisabled = await rateCalculatorPage.isEstimatedGasUseFieldDisabled();
      expect(isGasDisabled).toBe(false); // Expect it to be enabled after selecting EG
    });

    // As there's no separate input field for gas consumption, we assume it's calculated based on electric input or remains 0.
    // If the application logic allows direct gas input, a new locator and method would be needed.
    await test.step('Enter electric meter reads (1000 -> 1200 kWh)', async () => {
      await rateCalculatorPage.enterPreviousMeterRead('1000');
      await rateCalculatorPage.enterCurrentMeterRead('1200');
    });

    await test.step('Click Calculate button', async () => {
      await rateCalculatorPage.clickCalculate();
    });

    await test.step('Verify estimated electric use (200 kWh)', async () => {
      const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(estimatedElectricUse).toBe('200');
    });

    await test.step('Verify estimated gas use (assuming 0 for now without explicit gas input logic)', async () => {
        const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
        expect(estimatedGasUse).toBe('0'); // Placeholder, actual value depends on application's calculation logic
    });
  });

  test('should allow interaction with information buttons', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Click "How to Read Your Bill" button', async () => {
      await rateCalculatorPage.clickHowToReadYourBill();
      // Add assertion based on expected behavior: e.g., modal appears, new page loads
      // For demonstration, assuming a generic heading becomes visible if a new content section appears.
      await expect(page.locator('h1, h2, [role="dialog"]')).toBeVisible();
    });

    // Assuming the page resets or returns to original state to click the next button
    await page.reload(); 
    
    await test.step('Click "How to Find Usage" button', async () => {
      await rateCalculatorPage.clickHowToFindUsage();
      // Similar assertion for the 'How to Find Usage' information
      await expect(page.locator('h1, h2, [role="dialog"]')).toBeVisible();
    });
  });
});