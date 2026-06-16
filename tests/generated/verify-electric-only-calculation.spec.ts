import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

// Requirement ID: MTX-4506
// Test Name: Verify Electric Only Calculation

test.describe('MTX-4506 | Verify Electric Only Calculation', () => {
  test('Verify Electric Only Calculation', async ({ page }) => {
    const calculator = new RateCalculatorPage(page);

    await calculator.waitForReady();

    // Step 1: Select 'Electric only' from the Service type dropdown
    await calculator.selectServiceType('Electric only');

    // Expected: Electric Meter Read enabled; Gas Meter Read disabled or hidden
    const electricEnabled = await calculator.isElectricMeterReadEnabled();
    const gasVisible = await calculator.isGasMeterReadVisible();
    const gasEnabled = await calculator.isGasMeterReadEnabled();

    expect(electricEnabled).toBeTruthy();
    // Gas field should be either hidden or disabled
    expect(gasVisible && gasEnabled).toBeFalsy();

    // Step 2: Enter a valid value in the Electric Meter Read field
    await calculator.enterElectricMeterRead(500);

    // Expected: Value is accepted in the field
    await expect.poll(async () => await calculator.getElectricMeterReadValue(), { timeout: 2000 }).toBe('500');

    // Step 3: Click on the Calculate button
    await calculator.clickCalculate();

    // Expected: The calculated price is displayed to the user
    await expect.poll(async () => await calculator.isCalculatedPriceVisible(), { timeout: 5000 }).toBeTruthy();
    const priceText = await calculator.getCalculatedPriceText();
    expect(priceText).not.toEqual('');
  });
});
