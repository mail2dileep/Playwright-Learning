import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed

test.describe('Rate Calculator Reset Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming the application under test is served at the base URL configured in playwright.config.ts
    // If not, provide the specific URL here:
    await rateCalculatorPage.navigateTo('/your-rate-calculator-page-path'); // Placeholder URL
  });

  test('should clear all inputs and results when Reset button is clicked', async () => {
    // Test Step 1: Enter values into the meter read fields and perform a calculation.
    // Input Data: Electric: 300, Gas: 50 (Assuming these are target consumption values)
    // To achieve consumption values, we'll enter meter reads and select EG service.
    await rateCalculatorPage.selectServiceType('Electric & Gas');
    await rateCalculatorPage.enterPreviousRead(100); // Example values for 300 electric (400-100)
    await rateCalculatorPage.enterCurrentRead(400);

    // Change month dropdown from default to verify reset behavior
    await rateCalculatorPage.selectMonth('m01'); // Select January

    await rateCalculatorPage.clickCalculate();

    // Expected Result: Calculation result is displayed.
    // Based on the example, we expect Electric use 300 and Gas use 50.
    // Note: The actual calculation logic is external, we assume these values for assertion.
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('300');
    // For gas consumption, since the catalog shows disabled=true, it might be enabled after selecting EG
    // and then display a value. Let's verify it's enabled and shows 50.
    await expect(rateCalculatorPage.isEstimatedGasUseEnabled()).resolves.toBe(true);
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('50'); // Assuming '50' as per input data

    // Verify input fields are populated before reset
    await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('100');
    await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('400');
    await expect(rateCalculatorPage.getSelectedMonthValue()).resolves.toBe('m01'); // January is selected

    // Test Step 2: Click on the 'Reset' button.
    // Input Data: Click Reset
    await rateCalculatorPage.clickReset();

    // Expected Result: All input fields are cleared, dropdown returns to default, and the displayed price is removed.
    await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('0'); // Should be cleared to '0'
    await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('0'); // Should be cleared to '0'
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0'); // Should be cleared to '0'
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0'); // Should be cleared to '0'
    await expect(rateCalculatorPage.getSelectedMonthValue()).resolves.toBe('m06'); // Should revert to default 'm06' (June)
  });
});