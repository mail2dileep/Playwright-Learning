import { test, expect } from '@playwright/test';
import { EnergyCostCalculatorPage } from '../../pages/EnergyCostCalculatorPage'; // Relative import

test.describe('Energy Cost Calculator Functionality', () => {
  const calculatorUrl = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test('Verify Rate Calculator Visibility and Service Type Selection (MTX-4278)', async ({ page }) => {
    const calculatorPage = new EnergyCostCalculatorPage(page);

    await test.step('Step 1: Navigate to the Energy Cost Calculator page.', async () => {
      await calculatorPage.navigateToCalculatorPage(calculatorUrl);
      const isCalculatorVisible = await calculatorPage.isCalculatorSectionVisible();
      expect(isCalculatorVisible).toBeTruthy({ message: 'Rate calculator section should be visible upon navigation.' });
    });

    await test.step('Step 2: Select "Electric only" from the Service type options.', async () => {
      await calculatorPage.selectElectricServiceOnly();

      const electricMeterReadState = await calculatorPage.getElectricMeterReadState();
      const gasMeterReadState = await calculatorPage.getGasMeterReadState();

      // Expected: Electric Meter Read field is enabled.
      expect(electricMeterReadState.isEnabled).toBeTruthy({ message: 'Electric Meter Read field should be enabled after selecting Electric only.' });

      // Expected: Gas Meter Read field is hidden or disabled.
      // Based on the locator catalog, 'Estimated Gas use (Ccf)' is initially disabled. 
      // When 'Electric only' is selected, it is expected to remain disabled and visible (not hidden).
      expect(gasMeterReadState.isEnabled).toBeFalsy({ message: 'Gas Meter Read field should be disabled when Electric only is selected.' });
      expect(gasMeterReadState.isVisible).toBeTruthy({ message: 'Gas Meter Read field should remain visible even if disabled.' });
    });

    await test.step('Step 3: Select "Electric and Gas" from the Service type options.', async () => {
      await calculatorPage.selectElectricAndGasService();

      const electricMeterReadState = await calculatorPage.getElectricMeterReadState();
      const gasMeterReadState = await calculatorPage.getGasMeterReadState();

      // Expected: Both Electric Meter Read and Gas Meter Read fields are visible and enabled.
      expect(electricMeterReadState.isEnabled).toBeTruthy({ message: 'Electric Meter Read field should be enabled after selecting Electric and Gas.' });
      expect(gasMeterReadState.isEnabled).toBeTruthy({ message: 'Gas Meter Read field should be enabled after selecting Electric and Gas.' });
      expect(gasMeterReadState.isVisible).toBeTruthy({ message: 'Gas Meter Read field should be visible after selecting Electric and Gas.' });
    });
  });
});
