import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import as per framework structure

test.describe('Rate Calculator Functionality', () => {

  let rateCalculatorPage: RateCalculatorPage;
  const testPageUrl = 'https://www.example.com/calculator'; // Placeholder URL for navigation

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    await rateCalculatorPage.navigateTo(testPageUrl);
  });

  test('should calculate estimated electric usage correctly when Electric service is selected', async () => {
    const month = 'July';
    const previousRead = '100';
    const currentRead = '500';
    const expectedElectricUsage = '400'; // Assuming (500-100) = 400 kWh
    const expectedGasUsage = '0'; // As gas service is not selected

    // Step 1: Select month
    await rateCalculatorPage.selectMonth(month);

    // Step 2: Enter previous read
    await rateCalculatorPage.enterPreviousRead(previousRead);

    // Step 3: Enter current read
    await rateCalculatorPage.enterCurrentRead(currentRead);

    // Step 4: Select Electric service type
    await rateCalculatorPage.selectServiceType('Electric');

    // Step 5: Click Calculate
    await rateCalculatorPage.clickCalculate();

    // Step 6: Verify estimated electric usage
    const actualElectricUsage = await rateCalculatorPage.getEstimatedElectricUsage();
    expect(actualElectricUsage).toBe(expectedElectricUsage);

    // Step 7: Verify estimated gas usage is 0 and disabled
    const actualGasUsage = await rateCalculatorPage.getEstimatedGasUsage();
    expect(actualGasUsage).toBe(expectedGasUsage);
    const isGasFieldDisabled = await rateCalculatorPage.isGasUsageFieldDisabled();
    expect(isGasFieldDisabled).toBe(true);
  });

  test('should reset form fields when Reset button is clicked', async () => {
    // Fill some values
    await rateCalculatorPage.selectMonth('August');
    await rateCalculatorPage.enterPreviousRead('200');
    await rateCalculatorPage.enterCurrentRead('600');
    await rateCalculatorPage.selectServiceType('ElectricAndGas');
    
    // Click Reset
    await rateCalculatorPage.clickReset();

    // Verify fields are reset to their default values
    // Based on the catalog: Month default is 'm06' (June), input fields default to '0'.
    expect(await rateCalculatorPage.monthSelect.inputValue()).toBe('m06');
    expect(await rateCalculatorPage.previousReadInput.inputValue()).toBe('0');
    expect(await rateCalculatorPage.currentReadInput.inputValue()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedElectricUsage()).toBe('0');
    expect(await rateCalculatorPage.getEstimatedGasUsage()).toBe('0');
    // Further assertions could check the default selected radio button or state if applicable.
  });

});