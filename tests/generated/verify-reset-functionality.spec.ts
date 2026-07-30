import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage';

test.describe('Rate Calculator Reset Functionality (MTX-4433)', () => {
  const BASE_URL = 'http://localhost:3000/rate-calculator'; // Placeholder URL

  test('Verify Reset button clears all inputs and results', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Step 1: Enter values into the meter read fields and perform a calculation.', async () => {
      await rateCalculatorPage.navigate(BASE_URL);
      await rateCalculatorPage.selectMonth('m06'); // Select an arbitrary month for calculation context
      await rateCalculatorPage.enterPreviousRead('100');
      await rateCalculatorPage.enterCurrentRead('550');
      await rateCalculatorPage.selectServiceTypeElectricAndGas(); // Enables gas calculation
      await rateCalculatorPage.clickCalculateButton();

      // Expected Result: Calculation result is displayed.
      // For this test, we'll check that the consumption fields are not '0' or empty.
      const electricConsumption = await rateCalculatorPage.getEstimatedElectricUse();
      const gasConsumption = await rateCalculatorPage.getEstimatedGasUse();

      expect(electricConsumption).not.toBe('0');
      expect(electricConsumption).not.toBe('');
      expect(gasConsumption).not.toBe('0');
      expect(gasConsumption).not.toBe('');
      console.log(`Initial Electric Consumption: ${electricConsumption} kWh`);
      console.log(`Initial Gas Consumption: ${gasConsumption} Ccf`);
    });

    await test.step('Step 2: Click the \'Reset\' button.', async () => {
      await rateCalculatorPage.clickResetButton();

      // Expected Result: All input fields are cleared and the calculated price display is removed.
      const previousReadValue = await rateCalculatorPage.getPreviousReadValue();
      const currentReadValue = await rateCalculatorPage.getCurrentReadValue();
      const electricConsumptionAfterReset = await rateCalculatorPage.getEstimatedElectricUse();
      const gasConsumptionAfterReset = await rateCalculatorPage.getEstimatedGasUse();

      expect(previousReadValue).toBe('0'); // Assuming reset sets fields to '0' or default
      expect(currentReadValue).toBe('0');
      expect(electricConsumptionAfterReset).toBe('0');
      expect(gasConsumptionAfterReset).toBe('0');
      console.log(`Previous Read after reset: ${previousReadValue}`);
      console.log(`Current Read after reset: ${currentReadValue}`);
      console.log(`Electric Consumption after reset: ${electricConsumptionAfterReset} kWh`);
      console.log(`Gas Consumption after reset: ${gasConsumptionAfterReset} Ccf`);
    });
  });
});