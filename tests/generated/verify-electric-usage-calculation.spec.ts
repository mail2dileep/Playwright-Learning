import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  const BASE_URL = 'http://localhost:8080/rate-calculator'; // Placeholder URL

  test('should correctly calculate electric usage and handle service type change', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Navigate to the Rate Calculator Page and verify initial state
    await test.step('Navigate to Rate Calculator Page and verify initial state', async () => {
      await rateCalculatorPage.navigate(BASE_URL);
      await expect(page).toHaveTitle(/Rate Calculator/);
      await expect(await rateCalculatorPage.getCurrentSelectedMonth()).toBe('m06'); // June
      await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
      await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
      await expect(await rateCalculatorPage.getEstimatedElectricUseValue()).toBe('0');
      await expect(await rateCalculatorPage.isEstimatedGasUseFieldEnabled()).toBeFalsy();
      await expect(await rateCalculatorPage.isElectricServiceSelected()).toBeTruthy();
      await expect(await rateCalculatorPage.isElectricGasServiceSelected()).toBeFalsy();
    });

    // Step 2: Perform an electric usage calculation
    await test.step('Perform an electric usage calculation', async () => {
      const previousRead = '1000';
      const currentRead = '1500';
      const expectedElectricUsage = (parseInt(currentRead) - parseInt(previousRead)).toString();

      await rateCalculatorPage.calculateElectricUsage('m03', previousRead, currentRead); // Select March

      await expect(await rateCalculatorPage.getCurrentSelectedMonth()).toBe('m03');
      await expect(await rateCalculatorPage.getPreviousReadValue()).toBe(previousRead);
      await expect(await rateCalculatorPage.getCurrentReadValue()).toBe(currentRead);
      await expect(await rateCalculatorPage.getEstimatedElectricUseValue()).toBe(expectedElectricUsage);
    });

    // Step 3: Change service type to Electric & Gas and verify gas field becomes enabled
    await test.step('Change service type to Electric & Gas and verify gas field enabled', async () => {
      await rateCalculatorPage.selectElectricGasService();

      await expect(await rateCalculatorPage.isElectricServiceSelected()).toBeFalsy();
      await expect(await rateCalculatorPage.isElectricGasServiceSelected()).toBeTruthy();
      await expect(await rateCalculatorPage.isEstimatedGasUseFieldEnabled()).toBeTruthy();
      // Verify gas consumption remains 0 initially as no gas read was entered
      await expect(await rateCalculatorPage.getEstimatedGasUseValue()).toBe('0');
    });

    // Step 4: Reset the form and verify initial state is restored
    await test.step('Reset the form and verify initial state is restored', async () => {
      await rateCalculatorPage.clickResetButton();

      await expect(await rateCalculatorPage.getCurrentSelectedMonth()).toBe('m06'); // Back to default June
      await expect(await rateCalculatorPage.getPreviousReadValue()).toBe('0');
      await expect(await rateCalculatorPage.getCurrentReadValue()).toBe('0');
      await expect(await rateCalculatorPage.getEstimatedElectricUseValue()).toBe('0');
      await expect(await rateCalculatorPage.isEstimatedGasUseFieldEnabled()).toBeFalsy();
      await expect(await rateCalculatorPage.isElectricServiceSelected()).toBeTruthy();
      await expect(await rateCalculatorPage.isElectricGasServiceSelected()).toBeFalsy();
    });
  });
});
