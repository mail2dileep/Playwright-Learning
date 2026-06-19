import { test, expect } from '@playwright/test';
import { MeterReadCalculatorPage } from '../../pages/MeterReadCalculatorPage'; // Relative import

test.describe('MTX-4506: Meter Read Calculator Functionality', () => {
  test('Verify Reset Functionality', async ({ page }) => {
    const calculatorPage = new MeterReadCalculatorPage(page);

    // In a real scenario, this URL would point to the actual Meter Read Calculator page.
    // Using a placeholder URL for demonstration purposes.
    await calculatorPage.navigateTo('http://localhost:3000/meter-calculator'); 

    // Step 1: Enter values into the meter read fields and perform a calculation.
    // Input Data: Electric: 300, Gas: 50
    await calculatorPage.enterElectricMeterRead('300');
    await calculatorPage.enterGasMeterRead('50');
    await calculatorPage.performCalculation();

    // Expected Result: Calculation result is displayed.
    // IMPORTANT: As locators are TODO, this assertion's reliability is limited by the placeholder. 
    // It assumes a non-empty string indicates a result. In a real application, more specific assertions would be made.
    await expect(await calculatorPage.getCalculationResultText()).not.toBe('');
    console.log("Assertion: Calculation result is displayed (based on placeholder locator).");

    // Step 2: Click on the 'Reset' button.
    await calculatorPage.clickReset();

    // Expected Result: All input fields are cleared and the calculation result is removed.
    await expect(await calculatorPage.getElectricMeterReadValue()).toBe('');
    console.log("Assertion: Electric Meter Read input field is cleared (based on placeholder locator).");

    await expect(await calculatorPage.getGasMeterReadValue()).toBe('');
    console.log("Assertion: Gas Meter Read input field is cleared (based on placeholder locator).");

    await expect(await calculatorPage.getCalculationResultText()).toBe(''); // Expecting the display to be empty after reset
    console.log("Assertion: Calculation result display is cleared (based on placeholder locator).");
  });
});