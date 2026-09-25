import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative path

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming the application under test (AUT) starts at a specific URL
    // For this example, let's use a placeholder. In a real scenario, this would be the actual URL.
    await page.goto('http://localhost:8080/rate-calculator');
    // Or if the page object itself handled navigation: await rateCalculatorPage.navigate();
  });

  test('should calculate estimated electric use correctly for Electric service', async () => {
    const month = 'm09'; // September
    const previousRead = '100';
    const currentRead = '200';
    const expectedElectricUse = '100'; // 200 - 100

    await test.step('Perform electric rate calculation', async () => {
      await rateCalculatorPage.performElectricCalculation(month, previousRead, currentRead);
    });

    await test.step('Verify estimated electric use', async () => {
      const actualElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(actualElectricUse).toBe(expectedElectricUse);
    });

    await test.step('Verify estimated gas use field is disabled', async () => {
      const isGasFieldDisabled = await rateCalculatorPage.isEstimatedGasUseFieldDisabled();
      expect(isGasFieldDisabled).toBe(true);
    });
  });

  test('should calculate estimated electric and gas use correctly for Electric & Gas service', async () => {
    const month = 'm10'; // October
    const previousRead = '50';
    const currentRead = '150';
    const expectedElectricUse = '100'; // 150 - 50
    const expectedGasUse = '100'; // Assuming same logic for gas consumption

    await test.step('Perform electric and gas rate calculation', async () => {
      await rateCalculatorPage.performElectricGasCalculation(month, previousRead, currentRead);
    });

    await test.step('Verify estimated electric use', async () => {
      const actualElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(actualElectricUse).toBe(expectedElectricUse);
    });

    await test.step('Verify estimated gas use field is enabled and has a value', async () => {
      const isGasFieldDisabled = await rateCalculatorPage.isEstimatedGasUseFieldDisabled();
      expect(isGasFieldDisabled).toBe(false); // Should be enabled now

      const actualGasUse = await rateCalculatorPage.getEstimatedGasUse();
      expect(actualGasUse).toBe(expectedGasUse); 
      expect(actualGasUse).not.toBe('0');
    });
  });
});