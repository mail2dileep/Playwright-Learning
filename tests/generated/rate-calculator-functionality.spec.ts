import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Navigate to the Rate Calculator page.
    // In a real enterprise framework, this URL might come from a config file.
    await page.goto('https://www.example.com/rate-calculator'); // Placeholder URL
  });

  test('should calculate electric usage correctly for Electric service', async () => {
    await test.step('Perform calculation with Electric service type', async () => {
      await rateCalculatorPage.calculateUsage('m07', '1000', '1200', 'Electric');
    });

    await test.step('Verify estimated electric usage', async () => {
      const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(estimatedElectricUse).toBe('200'); // Assuming (1200 - 1000)
    });

    await test.step('Verify estimated gas usage remains 0 for Electric service (disabled field)', async () => {
      const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
      expect(estimatedGasUse).toBe('0');
    });
  });

  test('should calculate electric and gas usage correctly for Electric & Gas service', async () => {
    await test.step('Perform calculation with Electric & Gas service type', async () => {
      await rateCalculatorPage.calculateUsage('m08', '2000', '2500', 'Electric & Gas');
    });

    await test.step('Verify estimated electric usage', async () => {
      const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(estimatedElectricUse).toBe('500'); // Assuming (2500 - 2000)
    });

    await test.step('Verify estimated gas usage remains 0 (disabled field, without specific calculation logic)', async () => {
      // The 'Estimated Gas use' field is disabled per the locator catalog.
      // Without specific business logic for gas calculation or input fields for gas, it's expected to remain 0.
      const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
      expect(estimatedGasUse).toBe('0');
    });
  });

  test('should reset all form fields to their initial state', async () => {
    await test.step('Fill some fields and select options to change state', async () => {
      await rateCalculatorPage.selectMonth('m12'); // Change month to December
      await rateCalculatorPage.enterPreviousRead('500');
      await rateCalculatorPage.enterCurrentRead('600');
      await rateCalculatorPage.selectElectricGasServiceType();
    });

    await test.step('Click the Reset button', async () => {
      await rateCalculatorPage.clickReset();
    });

    await test.step('Verify fields are reset to their initial values', async () => {
      const initialMonth = await rateCalculatorPage.getCurrentlySelectedMonthValue();
      expect(initialMonth).toBe('m06'); // Initial value from locator catalog

      const initialPreviousRead = await rateCalculatorPage.previousReadInput.inputValue();
      expect(initialPreviousRead).toBe('0'); // Initial value from locator catalog

      const initialCurrentRead = await rateCalculatorPage.currentReadInput.inputValue();
      expect(initialCurrentRead).toBe('0'); // Initial value from locator catalog

      // Check if radio buttons revert to default. 'E' (Electric) is often the default.
      expect(await rateCalculatorPage.isElectricServiceTypeSelected()).toBe(true);
      expect(await rateCalculatorPage.isElectricGasServiceTypeSelected()).toBe(false);

      const initialEstimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(initialEstimatedElectricUse).toBe('0');

      const initialEstimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
      expect(initialEstimatedGasUse).toBe('0');
    });
  });
});