import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as per your project structure

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming base URL is configured in playwright.config.ts
    await rateCalculatorPage.navigateTo('/'); 
  });

  test('should successfully calculate estimated electric usage', async () => {
    const previousRead = '1000';
    const currentRead = '1200';
    const expectedElectricUse = (parseInt(currentRead) - parseInt(previousRead)).toString(); // '200'

    await rateCalculatorPage.selectMonth('m07'); // Select 'July'
    await rateCalculatorPage.enterPreviousMeterRead(previousRead);
    await rateCalculatorPage.enterCurrentMeterRead(currentRead);
    await rateCalculatorPage.selectElectricService();
    await rateCalculatorPage.clickCalculate();

    const actualElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(actualElectricUse).toEqual(expectedElectricUse);
    
    // Verify gas consumption is 0 as only electric service was selected
    const actualGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(actualGasUse).toEqual('0');
  });

  test('should reset form fields to their initial states', async () => {
    // Populate fields with some values
    await rateCalculatorPage.selectMonth('m12'); // Select December
    await rateCalculatorPage.enterPreviousMeterRead('500');
    await rateCalculatorPage.enterCurrentMeterRead('700');
    await rateCalculatorPage.selectElectricAndGasService(); // Select both services

    // Assert fields are populated before reset
    expect(await rateCalculatorPage.getPreviousMeterReadValue()).toEqual('500');
    expect(await rateCalculatorPage.getCurrentMeterReadValue()).toEqual('700');
    expect(await rateCalculatorPage.getSelectedMonthValue()).toEqual('m12');

    // Perform reset action
    await rateCalculatorPage.clickReset();

    // Assert fields are reset to their assumed initial values
    expect(await rateCalculatorPage.getPreviousMeterReadValue()).toEqual('0'); // Initial value is '0'
    expect(await rateCalculatorPage.getCurrentMeterReadValue()).toEqual('0'); // Initial value is '0'
    expect(await rateCalculatorPage.getEstimatedElectricUse()).toEqual('0');
    expect(await rateCalculatorPage.getEstimatedGasUse()).toEqual('0');
    expect(await rateCalculatorPage.getSelectedMonthValue()).toEqual('m06'); // Assuming 'June' ('m06') is the default selected month
  });
});