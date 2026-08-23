import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming the base URL is configured, and this path leads to the calculator.
    // Replace '/calculator' with the actual path if different.
    await rateCalculatorPage.navigateTo('/calculator');
    await expect(page).toHaveTitle(/Rate Calculator/); // Example assertion for page load
  });

  test('should successfully calculate electric usage and reset', async () => {
    const month = 'm07'; // July
    const previousRead = '1000';
    const currentRead = '1500';
    const expectedElectricUse = '500'; // 1500 - 1000

    await test.step('Select billing month', async () => {
      await rateCalculatorPage.selectBillingMonth(month);
      await expect(rateCalculatorPage['monthDropdown']).toHaveValue(month);
    });

    await test.step('Enter previous and current meter reads', async () => {
      await rateCalculatorPage.enterPreviousRead(previousRead);
      await rateCalculatorPage.enterCurrentRead(currentRead);
      await expect(rateCalculatorPage['previousReadInput']).toHaveValue(previousRead);
      await expect(rateCalculatorPage['currentReadInput']).toHaveValue(currentRead);
    });

    await test.step('Select Electric service type', async () => {
      await rateCalculatorPage.selectElectricService();
      await expect(rateCalculatorPage['electricServiceRadio']).toBeChecked();
      // Verify Gas use is disabled when only Electric is selected
      await expect(rateCalculatorPage['estimatedGasUseInput']).toBeDisabled();
    });

    await test.step('Click Calculate button', async () => {
      await rateCalculatorPage.clickCalculate();
    });

    await test.step('Verify estimated electric usage', async () => {
      const estimatedUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(estimatedUse).toBe(expectedElectricUse);
    });

    await test.step('Reset the form', async () => {
      await rateCalculatorPage.clickReset();
      // Verify fields are reset (assuming reset clears to default values like '0' or empty)
      await expect(rateCalculatorPage['previousReadInput']).toHaveValue('0');
      await expect(rateCalculatorPage['currentReadInput']).toHaveValue('0');
      // Verify month might revert to default 'm06'
      await expect(rateCalculatorPage['monthDropdown']).toHaveValue('m06');
    });
  });

  test('should verify estimated gas usage field is disabled when Electric service is selected', async () => {
    await test.step('Select Electric service type', async () => {
      await rateCalculatorPage.selectElectricService();
      await expect(rateCalculatorPage['electricServiceRadio']).toBeChecked();
    });

    await test.step('Verify Estimated Gas use (Ccf) field is disabled', async () => {
      const isDisabled = await rateCalculatorPage.isEstimatedGasUseDisabled();
      expect(isDisabled).toBe(true);
      await expect(rateCalculatorPage['estimatedGasUseInput']).toBeDisabled(); // Redundant check for demonstration
    });
  });

  // Example of using the combined action method
  test('should calculate with combined action', async () => {
    const month = 'm10'; // October
    const previousRead = '500';
    const currentRead = '800';
    const expectedElectricUse = '300'; // 800 - 500

    await test.step('Fill calculator form and calculate', async () => {
      await rateCalculatorPage.calculateEstimatedUsage(month, previousRead, currentRead, 'electric');
    });

    await test.step('Verify estimated electric usage', async () => {
      const estimatedUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(estimatedUse).toBe(expectedElectricUse);
    });
  });
});
