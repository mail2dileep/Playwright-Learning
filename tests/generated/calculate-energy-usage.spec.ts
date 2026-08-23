import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage'; // Relative import

test.describe('Rate Calculator Functionality', () => {
  const TEST_URL = 'http://localhost:3000/rate-calculator'; // Placeholder URL, adjust as needed

  test('should calculate estimated electric and gas usage correctly for March', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Navigate to the Rate Calculator page
    await rateCalculatorPage.navigateTo(TEST_URL);

    // Step 2: Select "March" for the month (value 'm03')
    await rateCalculatorPage.selectMonth('m03');

    // Step 3: Enter "1000" as the previous meter read
    await rateCalculatorPage.enterPreviousRead('1000');

    // Step 4: Enter "1200" as the current meter read
    await rateCalculatorPage.enterCurrentRead('1200');

    // Step 5: Select "Electric and Gas" service type
    await rateCalculatorPage.selectElectricAndGasService();
    
    // Allowing a small delay for UI updates after selecting service type, if any
    await page.waitForTimeout(100); 

    // Step 6: Click "Calculate"
    await rateCalculatorPage.clickCalculate();

    // Step 7: Verify "Estimated Electric use (kWh)" is "200"
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('200');

    // Step 8: Verify "Estimated Gas use (Ccf)" is "0" and is enabled
    // Assuming the Estimated Gas Use field becomes enabled when 'Electric and Gas' service is selected,
    // but shows '0' as no specific gas meter readings were provided in the scenario.
    const isGasUseEnabled = await rateCalculatorPage.isEstimatedGasUseEnabled();
    expect(isGasUseEnabled).toBe(true); 
    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).toBe('0');
  });
});