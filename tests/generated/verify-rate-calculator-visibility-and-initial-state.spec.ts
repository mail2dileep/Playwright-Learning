import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as needed based on framework structure

test.describe('Energy Cost Calculator Page - Visibility and Initial State', () => {
  const energyCostCalculatorUrl = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

  test('Verify Rate Calculator Section and Initial Field States', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Navigate to the Energy Cost Calculator page.
    await rateCalculatorPage.navigateTo(energyCostCalculatorUrl);

    // Expected Result: Rate calculator section is visible on the page.
    await expect(await rateCalculatorPage.isRateCalculatorSectionVisible()).toBeTruthy();

    // Step 2: Check for the presence of Service Type dropdown, Electric Meter Read field,
    //         Gas Meter Read field, Calculate button, and Reset button.
    //         Also verify initial default states.

    // "Service Type dropdown" is interpreted as the 'Month' dropdown and 'Service Type' radio buttons
    // as per the provided Locator Catalog.
    await expect(await rateCalculatorPage.isMonthDropdownVisible()).toBeTruthy();
    await expect(await rateCalculatorPage.getMonthDropdownCurrentValue()).toBe('m06'); // From catalog: currentValue: "m06" for gMonth1
    
    await expect(await rateCalculatorPage.isServiceTypeElectricRadioVisible()).toBeTruthy();
    await expect(await rateCalculatorPage.isServiceTypeElectricGasRadioVisible()).toBeTruthy();
    await expect(await rateCalculatorPage.isElectricServiceTypeSelected()).toBeTruthy(); // From catalog: currentValue: "E" for #e
    await expect(await rateCalculatorPage.isElectricGasServiceTypeSelected()).toBeFalsy(); // Opposite of default


    // Check Electric Meter Read fields
    await expect(await rateCalculatorPage.isPreviousReadFieldVisible()).toBeTruthy();
    await expect(await rateCalculatorPage.getPreviousReadFieldValue()).toBe('0'); // From catalog: currentValue: "0" for eMeterRead

    await expect(await rateCalculatorPage.isCurrentReadFieldVisible()).toBeTruthy();
    await expect(await rateCalculatorPage.getCurrentReadFieldValue()).toBe('0'); // From catalog: currentValue: "0" for eMeterNewRead

    await expect(await rateCalculatorPage.isEstimatedElectricUseFieldVisible()).toBeTruthy();
    await expect(await rateCalculatorPage.getEstimatedElectricUseFieldValue()).toBe('0'); // From catalog: currentValue: "0" for consumption

    // Check Gas Meter Read field
    await expect(await rateCalculatorPage.isEstimatedGasUseFieldVisible()).toBeTruthy();
    await expect(await rateCalculatorPage.isEstimatedGasUseFieldDisabled()).toBeTruthy(); // From catalog: disabled: true for gasconsumption
    await expect(await rateCalculatorPage.getEstimatedGasUseFieldValue()).toBe('0'); // From catalog: currentValue: "0" for gasconsumption

    // Check buttons
    await expect(await rateCalculatorPage.isCalculateButtonVisible()).toBeTruthy();
    await expect(await rateCalculatorPage.isResetButtonVisible()).toBeTruthy();
  });
});