import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage';

test.describe('Utility Bill Calculator Functionality', () => {

  test('should successfully calculate electric bill', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.navigateTo();

    await calculatorPage.selectMonth('August');
    await calculatorPage.enterPreviousRead('1000');
    await calculatorPage.enterCurrentRead('1200');
    await calculatorPage.selectElectricService();
    await calculatorPage.clickCalculate();

    const estimatedElectricUse = await calculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).not.toBe('0');
    expect(estimatedElectricUse).toBe('200'); // Assuming calculation is Current - Previous

    // Verify gas use is disabled and remains 0 for Electric service
    const estimatedGasUse = await calculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).toBe('0');
  });

  test('should verify estimated gas use remains 0 even with Electric & Gas service selected if field is disabled', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.navigateTo();

    await calculatorPage.selectMonth('September');
    await calculatorPage.enterPreviousRead('2000');
    await calculatorPage.enterCurrentRead('2500');
    await calculatorPage.selectElectricAndGasService(); // Select EG service
    await calculatorPage.clickCalculate();

    const estimatedElectricUse = await calculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).not.toBe('0');
    expect(estimatedElectricUse).toBe('500'); // Assuming calculation is Current - Previous

    // As per Locator Catalog, 'Estimated Gas use (Ccf)' is disabled, so its value is expected to remain '0'.
    const estimatedGasUse = await calculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).toBe('0');
  });

  test('should reset form fields to their initial states', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);
    await calculatorPage.navigateTo();

    // Populate some fields to test reset functionality
    await calculatorPage.selectMonth('July');
    await calculatorPage.enterPreviousRead('500');
    await calculatorPage.enterCurrentRead('700');
    await calculatorPage.selectElectricAndGasService();
    await calculatorPage.clickCalculate(); // To ensure fields have values

    // Perform reset
    await calculatorPage.clickReset();

    // Verify fields are reset to initial states as per Locator Catalog default values
    const currentMonth = await calculatorPage.getCurrentMonth();
    expect(currentMonth).toBe('June'); // Initial value for 'Month' is 'm06' which corresponds to 'June'

    const previousRead = await calculatorPage.getPreviousReadValue();
    expect(previousRead).toBe('0'); // Initial value for 'Enter Previous Read:' is '0'

    const currentRead = await calculatorPage.getCurrentReadValue();
    expect(currentRead).toBe('0'); // Initial value for 'Enter Current Read:' is '0'

    const estimatedElectricUse = await calculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('0'); // Initial value for 'Estimated Electric use (kWh):' is '0'

    const estimatedGasUse = await calculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).toBe('0'); // Initial value for 'Estimated Gas use (Ccf):' is '0'
  });

});
