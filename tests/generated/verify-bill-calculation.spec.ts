import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../pages/RateCalculatorPage";

test.describe('Energy Bill Calculator Functionality', () => {
  const CALCULATOR_PATH = '/calculator'; // Assuming a base URL is configured in playwright.config.ts

  test('should calculate estimated bill and reset fields correctly', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the calculator page', async () => {
      await rateCalculatorPage.navigateTo(CALCULATOR_PATH);
    });

    await test.step('Verify initial state of fields', async () => {
      await expect(rateCalculatorPage.getSelectedMonth()).resolves.toBe('m06');
      await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('0');
      await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('0');
      await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0');
      await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
      await expect(rateCalculatorPage.isEstimatedGasUseEnabled()).resolves.toBe(false);
    });

    await test.step('Input meter reads and select service type', async () => {
      await rateCalculatorPage.selectMonth('m07'); // Select July
      await rateCalculatorPage.enterPreviousRead('1000');
      await rateCalculatorPage.enterCurrentRead('1250');
      await rateCalculatorPage.selectServiceType('electricAndGas');
    });

    await test.step('Click calculate and verify estimated usage', async () => {
      await rateCalculatorPage.clickCalculate();
      await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('250'); // 1250 - 1000 = 250
      // Gas use is 0 initially, even with EG selected, as no gas read inputs are available.
      await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
      await expect(rateCalculatorPage.isEstimatedGasUseEnabled()).resolves.toBe(true); // Should become enabled after selecting 'electricAndGas'
    });

    await test.step('Reset the form and verify fields return to initial state', async () => {
      await rateCalculatorPage.clickReset();

      await expect(rateCalculatorPage.getSelectedMonth()).resolves.toBe('m06'); // Resets to default month
      await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('0');
      await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('0');
      await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0');
      await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
      await expect(rateCalculatorPage.isEstimatedGasUseEnabled()).resolves.toBe(false); // Resets to disabled state
    });
  });

  test('should check if "How to Read Your Bill" button is clickable', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the calculator page', async () => {
      await rateCalculatorPage.navigateTo(CALCULATOR_PATH);
    });

    await test.step('Verify and click "How to Read Your Bill" button', async () => {
      await expect(rateCalculatorPage.page.locator('#howToReadYourBillBtn')).toBeVisible();
      await expect(rateCalculatorPage.page.locator('#howToReadYourBillBtn')).toBeEnabled();
      // We would ideally verify navigation or a modal appears here, but without specific locators, we only confirm interaction.
      await rateCalculatorPage.clickHowToReadYourBill();
    });
  });
});