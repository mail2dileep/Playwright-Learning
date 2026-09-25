import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed based on actual file structure

test.describe('Rate Calculator Functionality', () => {
  const BASE_URL = 'http://localhost:3000/rate-calculator'; // Placeholder URL for the application

  test('should calculate electric usage correctly and reset form', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the Rate Calculator page', async () => {
      await rateCalculatorPage.navigate(BASE_URL);
      await expect(page).toHaveTitle(/Rate Calculator/); // Assuming page title contains "Rate Calculator"
    });

    await test.step('Fill in meter reads and select Electric service type', async () => {
      await rateCalculatorPage.selectMonth('m07'); // Select July
      await rateCalculatorPage.enterPreviousRead('1000');
      await rateCalculatorPage.enterCurrentRead('1500');
      await rateCalculatorPage.selectElectricService();

      // Assert initial state before calculation
      await expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m07');
      await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('1000');
      await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('1500');
      await expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true);
      await expect(await rateCalculatorPage.isElectricAndGasServiceSelected()).toBe(false);
      await expect(await rateCalculatorPage.isGasUseFieldEnabled()).toBe(false); // Should remain disabled based on catalog
    });

    await test.step('Perform calculation and verify estimated electric usage', async () => {
      await rateCalculatorPage.clickCalculate();
      const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(estimatedElectricUse).toBe('500'); // (1500 - 1000 = 500)
      expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0'); // Gas consumption should be 0 as only electric is selected and gas field is disabled
    });

    await test.step('Reset the form and verify fields revert to default values', async () => {
      await rateCalculatorPage.clickReset();
      expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
      expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
      expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
      expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
      expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06'); // Assuming default month is 'm06' (June) as per locator catalog 'currentValue'
      expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true); // Assuming 'Electric' is default selected based on catalog 'currentValue'
    });
  });

  test('should allow calculation for electric and gas service with gas field remaining disabled', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the Rate Calculator page', async () => {
      await rateCalculatorPage.navigate(BASE_URL);
      await expect(page).toHaveTitle(/Rate Calculator/);
    });

    await test.step('Fill in meter reads and select Electric & Gas service type', async () => {
      await rateCalculatorPage.selectMonth('m08'); // Select August
      await rateCalculatorPage.enterPreviousRead('200');
      await rateCalculatorPage.enterCurrentRead('300');
      await rateCalculatorPage.selectElectricAndGasService();

      // Assert selected values
      await expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m08');
      await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('200');
      await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('300');
      await expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(false);
      await expect(await rateCalculatorPage.isElectricAndGasServiceSelected()).toBe(true);
      await expect(await rateCalculatorPage.isGasUseFieldEnabled()).toBe(false); // Strictly adhering to locator catalog: field remains disabled
    });

    await test.step('Perform calculation and verify estimated usage for Electric & Gas', async () => {
      await rateCalculatorPage.clickCalculate();
      const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
      expect(estimatedElectricUse).toBe('100'); // (300 - 200 = 100)
      // As the 'Estimated Gas use' field is marked as disabled in the locator catalog, it is expected to remain '0'
      // unless application logic explicitly enables and populates it, which is not inferable from the catalog.
      expect(estimatedGasUse).toBe('0');
    });

    await test.step('Reset the form after Electric & Gas calculation', async () => {
      await rateCalculatorPage.clickReset();
      expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
      expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
      expect(await rateCalculatorPage.getEstimatedElectricUse()).toBe('0');
      expect(await rateCalculatorPage.getEstimatedGasUse()).toBe('0');
      expect(await rateCalculatorPage.getSelectedMonthValue()).toBe('m06');
      expect(await rateCalculatorPage.isElectricServiceSelected()).toBe(true);
      expect(await rateCalculatorPage.isElectricAndGasServiceSelected()).toBe(false); // Assuming default is 'E' after reset
    });
  });
});