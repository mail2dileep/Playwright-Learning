import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage';

test.describe('Calculator Functionality', () => {
  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    // Placeholder URL as no specific application URL was provided in the prompt.
    // In a real framework, this might be handled by baseURL in playwright.config.ts
    // or a navigation method within a BasePage/PageFixture.
    await page.goto('http://localhost:3000/calculator'); 
  });

  test('Verify Reset Functionality clears all inputs and results', async ({ page }) => {
    // Step 1: Enter values into the meter read fields and perform a calculation.
    // Input Data: Electric: 300, Gas: 50
    await test.step('Enter meter reads and calculate rates', async () => {
      await calculatorPage.selectServiceType('ElectricAndGas');
      await calculatorPage.enterPreviousMeterRead('0');
      await calculatorPage.enterCurrentMeterRead('300'); 
      await calculatorPage.calculateRates();

      // Expected Result: Calculation result is displayed.
      // Assert that the estimated electric and gas use are now the expected values.
      // Assuming the application calculates 300 kWh for electric and 50 Ccf for gas with these inputs.
      await expect(calculatorPage.getEstimatedElectricUseValue()).toEqual('300');
      await expect(calculatorPage.getEstimatedGasUseValue()).toEqual('50'); 
    });

    // Step 2: Click on the 'Reset' button.
    await test.step('Click Reset button and verify fields are cleared', async () => {
      await calculatorPage.resetCalculator();

      // Expected Result: All input fields are cleared and the displayed price is removed or reset to zero.
      await expect(calculatorPage.getPreviousMeterReadValue()).toEqual('0');
      await expect(calculatorPage.getCurrentMeterReadValue()).toEqual('0');
      await expect(calculatorPage.getEstimatedElectricUseValue()).toEqual('0');
      await expect(calculatorPage.getEstimatedGasUseValue()).toEqual('0');
      // Verify default month selection is restored, 'm06' (June) is the default value from the catalog.
      await expect(calculatorPage.getSelectedMonthValue()).toEqual('m06'); 
    });
  });
});