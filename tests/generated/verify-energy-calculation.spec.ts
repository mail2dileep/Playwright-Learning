import { test, expect } from '@playwright/test';
import { EnergyCalculatorPage } from '../../pages/EnergyCalculatorPage'; // Relative path based on the structure

test.describe('Energy Calculator Functionality', () => {
  const BASE_URL = 'https://www.example.com/energy-calculator'; // Placeholder URL, replace with actual URL

  test('should calculate electric usage correctly for current month', async ({ page }) => {
    await page.goto(BASE_URL);

    const energyCalculatorPage = new EnergyCalculatorPage(page);

    // Perform actions via Page Object methods
    await energyCalculatorPage.selectMonth('m09'); // Select September
    await energyCalculatorPage.enterPreviousRead('1000');
    await energyCalculatorPage.enterCurrentRead('1500');
    await energyCalculatorPage.selectServiceTypeElectric();
    await energyCalculatorPage.clickCalculate();

    // Assertions in the test layer
    await expect(energyCalculatorPage.estimatedElectricUseInput).toHaveValue('500');
    await expect(energyCalculatorPage.estimatedGasUseInput).toHaveValue('0');
    await expect(energyCalculatorPage.estimatedGasUseInput).toBeDisabled();
  });

  test('should reset form fields to their initial state', async ({ page }) => {
    await page.goto(BASE_URL);

    const energyCalculatorPage = new EnergyCalculatorPage(page);

    // Fill some fields to be reset
    await energyCalculatorPage.selectMonth('m07'); // Change from default 'm06'
    await energyCalculatorPage.enterPreviousRead('500'); // Change from default '0'
    await energyCalculatorPage.enterCurrentRead('800'); // Change from default '0'
    await energyCalculatorPage.selectServiceTypeElectricGas(); // Change from default electric
    
    await energyCalculatorPage.clickReset();

    // Assertions for reset state based on 'currentValue' from the catalog
    await expect(energyCalculatorPage.monthDropdown).toHaveValue('m06');
    await expect(energyCalculatorPage.previousReadInput).toHaveValue('0');
    await expect(energyCalculatorPage.currentReadInput).toHaveValue('0');
    await expect(energyCalculatorPage.estimatedElectricUseInput).toHaveValue('0');
    await expect(energyCalculatorPage.estimatedGasUseInput).toHaveValue('0');
    await expect(energyCalculatorPage.estimatedGasUseInput).toBeDisabled();
  });
});