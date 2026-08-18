import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Service Type Selection', () => {
  test('Verify Service Type selection - Electric only', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // TODO: Replace with actual URL for the Rate Calculator page.
    // Example: await page.goto('http://localhost:3000/rate-calculator');

    // Step 1: Select 'Electric only' from the Service Type options.
    await rateCalculatorPage.selectServiceTypeElectricOnly();

    // Expected Result: Electric Meter Read fields are displayed; Gas Meter Read field is hidden.
    // The 'Electric Meter Read field' refers to 'Enter Previous Read:', 'Enter Current Read:', and 'Estimated Electric use (kWh):'.
    // The 'Gas Meter Read field' refers to 'Estimated Gas use (Ccf):'.

    // Assertions for Electric fields being displayed
    expect(await rateCalculatorPage.isElectricPreviousReadFieldVisible(), 'Previous Meter Read field should be visible.').toBe(true);
    expect(await rateCalculatorPage.isElectricCurrentReadFieldVisible(), 'Current Meter Read field should be visible.').toBe(true);
    expect(await rateCalculatorPage.isEstimatedElectricUseFieldVisible(), 'Estimated Electric Use field should be visible.').toBe(true);

    // Assertion for Gas field being hidden
    expect(await rateCalculatorPage.isGasConsumptionFieldHidden(), 'Gas Consumption field should be hidden.').toBe(true);
  });
});