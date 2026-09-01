import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage'; // Relative import

test.describe('Energy Calculator Functionality', () => {
  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    // Assuming the calculator is available at a specific URL
    await page.goto('https://example.com/energy-calculator'); // Placeholder URL
  });

  test('should successfully calculate electric consumption', async ({ page }) => {
    const month = 'm03'; // March
    const prevRead = '1000';
    const currRead = '1250';
    const expectedElectricUse = '250'; // 1250 - 1000

    await test.step('Perform electric consumption calculation', async () => {
      await calculatorPage.performElectricCalculation(month, prevRead, currRead);
    });

    await test.step('Verify estimated electric use', async () => {
      const estimatedElectricUse = await calculatorPage.getEstimatedElectricUse();
      expect(estimatedElectricUse).toEqual(expectedElectricUse);
    });

    await test.step('Verify estimated gas use is zero and disabled', async () => {
      const estimatedGasUse = await calculatorPage.getEstimatedGasUse();
      expect(estimatedGasUse).toEqual('0');
      expect(await calculatorPage.isEstimatedGasUseFieldEnabled()).toBeFalsy();
    });

    await test.step('Verify selected month and meter reads', async () => {
      expect(await calculatorPage.getSelectedMonthValue()).toEqual(month);
      expect(await calculatorPage.getPreviousReadValue()).toEqual(prevRead);
      expect(await calculatorPage.getCurrentReadValue()).toEqual(currRead);
    });
  });

  test('should successfully calculate electric and gas consumption when EG service is selected', async ({ page }) => {
    const month = 'm09'; // September
    const prevRead = '500';
    const currRead = '600';
    const expectedElectricUse = '100'; // 600 - 500
    // No specific gas calculation is known, so we'll assert it's enabled and not default '0'.

    await test.step('Perform electric and gas consumption calculation', async () => {
      await calculatorPage.performElectricAndGasCalculation(month, prevRead, currRead);
    });

    await test.step('Verify estimated electric use', async () => {
      const estimatedElectricUse = await calculatorPage.getEstimatedElectricUse();
      expect(estimatedElectricUse).toEqual(expectedElectricUse);
    });

    await test.step('Verify estimated gas use is enabled and has a value', async () => {
      expect(await calculatorPage.isEstimatedGasUseFieldEnabled()).toBeTruthy();
      const estimatedGasUse = await calculatorPage.getEstimatedGasUse();
      // Assuming a non-zero value for gas when EG is selected.
      expect(estimatedGasUse).not.toEqual('0');
      // If the actual calculation is '0', this assertion would fail.
      // This is a placeholder for a more precise expectation if the business logic were known.
    });
  });

  test('should reset form fields to initial state', async ({ page }) => {
    await test.step('Fill in some data to change the state', async () => {
      await calculatorPage.selectMonth('m10');
      await calculatorPage.enterPreviousRead('200');
      await calculatorPage.enterCurrentRead('300');
      await calculatorPage.selectElectricService();
      await calculatorPage.clickCalculate(); // Simulate a calculation to change output fields
    });

    await test.step('Click Reset button', async () => {
      await calculatorPage.clickReset();
    });

    await test.step('Verify fields are reset to their initial default values', async () => {
      // Based on catalog, initial values:
      // Month: m06
      // Previous Read: 0
      // Current Read: 0
      // Estimated Electric use (kWh): 0
      // Estimated Gas use (Ccf): 0
      expect(await calculatorPage.getSelectedMonthValue()).toEqual('m06');
      expect(await calculatorPage.getPreviousReadValue()).toEqual('0');
      expect(await calculatorPage.getCurrentReadValue()).toEqual('0');
      expect(await calculatorPage.getEstimatedElectricUse()).toEqual('0');
      expect(await calculatorPage.getEstimatedGasUse()).toEqual('0');
      // After reset, gas use field should also be disabled again (default E service or initial state)
      expect(await calculatorPage.isEstimatedGasUseFieldEnabled()).toBeFalsy();
    });
  });
});