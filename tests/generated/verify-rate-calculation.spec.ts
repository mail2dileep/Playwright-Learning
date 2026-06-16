import { test, expect } from '@playwright/test';
import RateCalculatorPage from '../../pages/RateCalculatorPage';

// Requirement ID: MTX-4506
// Test Name: Verify Rate Calculation Functionality
// Objective: Validate that the calculator displays the price after clicking the Calculate button.

test.describe('MTX-4506 - Verify Rate Calculation Functionality', () => {
  test('should display price after calculation for Electric and Gas service', async ({ page }) => {
    const rateCalculator = new RateCalculatorPage(page);

    await rateCalculator.open();

    await test.step("Step 1 - Select 'Electric and Gas' service type", async () => {
      await rateCalculator.selectServiceType('Electric and Gas');
      await rateCalculator.waitUntilMeterFieldsReady();
      expect(await rateCalculator.areMeterFieldsEnabled()).toBe(true);
    });

    await test.step('Step 2 - Enter valid numeric values for Electric and Gas meter reads', async () => {
      await rateCalculator.enterMeterReads(500, 100);
      await expect(await rateCalculator.getElectricMeterValue()).toBe('500');
      await expect(await rateCalculator.getGasMeterValue()).toBe('100');
    });

    await test.step("Step 3 - Click 'Calculate' and verify price is displayed", async () => {
      await rateCalculator.clickCalculate();
      await rateCalculator.waitForPriceToBeDisplayed();
      expect(await rateCalculator.isCalculatedPriceVisible()).toBe(true);

      const priceText = await rateCalculator.getCalculatedPriceText();
      expect(priceText.length).toBeGreaterThan(0);
    });
  });
});
