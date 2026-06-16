import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

// Requirement ID: MTX-4506
// Test Name: Verify Reset Functionality
// Objective: Ensure that the Reset button clears all inputs and selections.

test.describe('Verify Reset Functionality (MTX-4506)', () => {
  test('Ensure that the Reset button clears all inputs and selections.', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Navigate
    await rateCalculatorPage.goto();

    // Step 1: Enter values and select a service type
    await rateCalculatorPage.selectServiceByLabel('Electric and Gas');
    await rateCalculatorPage.enterElectricUsage(300);
    await rateCalculatorPage.enterGasUsage(100);

    // Expected Result: Fields are populated
    await expect.soft(await rateCalculatorPage.getSelectedServiceLabel()).toBe('Electric and Gas');
    await expect.soft(await rateCalculatorPage.getElectricUsageValue()).toBe('300');
    await expect.soft(await rateCalculatorPage.getGasUsageValue()).toBe('100');

    // Step 2: Click on the Reset button
    await rateCalculatorPage.resetForm();

    // Expected Result: All input fields are cleared and dropdown returns to default state
    await expect(await rateCalculatorPage.getElectricUsageValue()).toBe('');
    await expect(await rateCalculatorPage.getGasUsageValue()).toBe('');
    await expect(await rateCalculatorPage.isServiceAtDefault()).toBe(true);
  });
});
