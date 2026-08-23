import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  const CALCULATOR_BASE_URL = 'https://example.com/calculator'; // Placeholder URL

  test('should calculate bill and reset values correctly', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the calculator page', async () => {
      await calculatorPage.navigateTo(CALCULATOR_BASE_URL);
      // Await page load or a specific element to be visible if needed
      await expect(calculatorPage.getEstimatedElectricUseKwh()).toBeVisible();
    });

    await test.step('Perform calculations with Electric/Gas service', async () => {
      await calculatorPage.selectBillingMonth('m03'); // Select March
      await calculatorPage.enterPreviousMeterRead('1000');
      await calculatorPage.enterCurrentMeterRead('1500');
      await calculatorPage.selectServiceType('electric-gas');
      await calculatorPage.clickCalculateButton();

      // Assertions after calculation
      await expect(await calculatorPage.getEstimatedElectricUseKwh()).toBe('500'); // Assuming 1500 - 1000 = 500
      await expect(await calculatorPage.isEstimatedGasUseCcfDisabled()).toBeFalsy(); // Gas field should be enabled
      await expect(await calculatorPage.getPreviousMeterReadValue()).toBe('1000');
      await expect(await calculatorPage.getCurrentMeterReadValue()).toBe('1500');
      await expect(await calculatorPage.getSelectedMonthValue()).toBe('m03');
    });

    await test.step('Verify auxiliary buttons', async () => {
      // These buttons might open modals or navigate, a simple click verification is done here.
      // For a real application, further assertions like modal visibility or new tab navigation would be added.
      await calculatorPage.clickHowToReadYourBill();
      // expect(page.locator('.modal-dialog')).toBeVisible(); // Example assertion for a modal
      // await page.goBack(); // If it navigates away
      await calculatorPage.clickHowToFindUsage();
      // expect(page.url()).toContain('/usage-info'); // Example assertion for navigation
      // await page.goBack();
    });

    await test.step('Reset the form', async () => {
      await calculatorPage.clickResetButton();

      // Assertions after reset
      await expect(await calculatorPage.getPreviousMeterReadValue()).toBe('0');
      await expect(await calculatorPage.getCurrentMeterReadValue()).toBe('0');
      await expect(await calculatorPage.getEstimatedElectricUseKwh()).toBe('0');
      await expect(await calculatorPage.isEstimatedGasUseCcfDisabled()).toBeTruthy(); // Gas field should be disabled again
      await expect(await calculatorPage.getSelectedMonthValue()).toBe('m06'); // Default month is June (m06)
    });
  });

  test('should initially have gas consumption field disabled for electric service', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the calculator page and verify initial state', async () => {
      await calculatorPage.navigateTo(CALCULATOR_BASE_URL);
      await expect(calculatorPage.getEstimatedElectricUseKwh()).toBeVisible();
      // Default service type is typically 'electric' or it needs to be explicitly set
      // Here we assume it defaults to electric where gas field is disabled
      await expect(await calculatorPage.isEstimatedGasUseCcfDisabled()).toBeTruthy();
    });

    await test.step('Select Electric service type and verify gas field remains disabled', async () => {
      await calculatorPage.selectServiceType('electric');
      await expect(await calculatorPage.isEstimatedGasUseCcfDisabled()).toBeTruthy();
    });
  });
});
