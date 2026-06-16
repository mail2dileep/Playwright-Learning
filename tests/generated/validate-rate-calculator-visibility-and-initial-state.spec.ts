import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

// Requirement ID: MTX-4506
// Test Name: Validate Rate Calculator Visibility and Initial State

test.describe('MTX-4506 - Validate Rate Calculator Visibility and Initial State', () => {
  test('Rate calculator section and key components should be visible', async ({ page }) => {
    const rateCalculator = new RateCalculatorPage(page);

    // Step 1: Navigate to the Rate Estimator Residential page
    await rateCalculator.navigateTo();
    await rateCalculator.waitForReady();

    // Assertions: Keep checks in the test layer, use only Page Object methods
    await test.step('Verify calculator section is visible', async () => {
      expect(await rateCalculator.isCalculatorSectionVisible()).toBeTruthy();
    });

    await test.step('Verify Service Type dropdown is visible', async () => {
      expect(await rateCalculator.isServiceTypeDropdownVisible()).toBeTruthy();
    });

    await test.step('Verify at least one input field is visible', async () => {
      const visibleInputs = await rateCalculator.getVisibleInputFieldCount();
      expect(visibleInputs).toBeGreaterThan(0);
    });

    await test.step('Verify primary action button (e.g., Calculate/Estimate) is visible', async () => {
      expect(await rateCalculator.isPrimaryActionButtonVisible()).toBeTruthy();
    });

    await test.step('Verify secondary action button (e.g., Reset/Clear) is visible', async () => {
      expect(await rateCalculator.isSecondaryActionButtonVisible()).toBeTruthy();
    });
  });
});
