import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

// Requirement ID: MTX-4506
// Test Name: Verify Electric and Gas Calculation
// Objective: Validate that the user can calculate the price for both Electric and Gas services.

test.describe('MTX-4506 - Verify Electric and Gas Calculation', () => {
  test('Verify Electric and Gas Calculation', async ({ page }) => {
    const calculator = new RateCalculatorPage(page);

    await test.step('Navigate to Rate Calculator', async () => {
      await calculator.goto();
    });

    await test.step("Step 1: Select 'Electric and Gas' and verify both meter fields are enabled", async () => {
      await calculator.selectServiceType('Electric and Gas');
      await expect(await calculator.isElectricMeterEnabled()).toBeTruthy();
      await expect(await calculator.isGasMeterEnabled()).toBeTruthy();
    });

    await test.step('Step 2: Enter valid values in both meter read fields and verify acceptance', async () => {
      await calculator.fillElectricMeter(450);
      await calculator.fillGasMeter(150);
      await expect(await calculator.getElectricMeterValue()).toBe('450');
      await expect(await calculator.getGasMeterValue()).toBe('150');
    });

    await test.step('Step 3: Click Calculate and verify combined calculated price is displayed', async () => {
      await calculator.clickCalculate();
      await expect(await calculator.isCombinedPriceVisible()).toBeTruthy();
      const combinedPriceText = await calculator.getCombinedPriceText();
      await expect(combinedPriceText).toBeTruthy(); // Non-empty
      await expect(combinedPriceText).toMatch(/\d/); // Contains at least one digit
    });
  });
});
