import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage';

test.describe('Rate Calculator Functionality', () => {
  const BASE_URL = 'http://localhost:3000/rate-calculator'; // Placeholder URL for the application

  test('should calculate estimated usage for electric service and reset', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the rate calculator page', async () => {
      await calculatorPage.navigateTo(BASE_URL);
      await expect(page).toHaveURL(BASE_URL); // Verify navigation
    });

    await test.step('Select a month (e.g., August)', async () => {
      await calculatorPage.selectMonth('m08'); // 'm08' corresponds to August
      await expect(calculatorPage.monthDropdown).toHaveValue('m08'); // Assert selected month using PO's public locator
    });

    await test.step('Enter previous and current meter readings', async () => {
      await calculatorPage.enterMeterReads('1000', '1500');
      await expect(calculatorPage.previousReadInput).toHaveValue('1000');
      await expect(calculatorPage.currentReadInput).toHaveValue('1500');
    });

    await test.step('Select Electric service type', async () => {
      await calculatorPage.selectServiceType('electric');
      await expect(calculatorPage.electricServiceTypeRadio).toBeChecked();
      await expect(calculatorPage.electricAndGasServiceTypeRadio).not.toBeChecked();
      // As per locator catalog, Estimated Gas use is disabled by default.
      // With 'electric' service type, it should remain disabled.
      await expect(calculatorPage.estimatedGasUseInput).toBeDisabled();
    });

    await test.step('Click Calculate and verify estimated electric use', async () => {
      await calculatorPage.clickCalculate();
      // Assuming a simple calculation (current - previous) for electric use
      await expect(calculatorPage.estimatedElectricUseInput).toHaveValue('500'); // 1500 - 1000 = 500 kWh
    });

    await test.step('Click Reset and verify fields are reverted to default/cleared', async () => {
      await calculatorPage.clickReset();
      await expect(calculatorPage.previousReadInput).toHaveValue('0'); // Default value from catalog
      await expect(calculatorPage.currentReadInput).toHaveValue('0');   // Default value from catalog
      await expect(calculatorPage.estimatedElectricUseInput).toHaveValue('0'); // Cleared/default value
      await expect(calculatorPage.monthDropdown).toHaveValue('m06'); // Default month (June) from catalog currentValue
      await expect(calculatorPage.electricServiceTypeRadio).not.toBeChecked(); // Assumes reset clears selection
      await expect(calculatorPage.electricAndGasServiceTypeRadio).not.toBeChecked(); // Assumes reset clears selection
      await expect(calculatorPage.estimatedGasUseInput).toBeDisabled(); // Should be disabled if no service type selected
    });
  });

  test('should calculate estimated usage for electric and gas service', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the rate calculator page', async () => {
      await calculatorPage.navigateTo(BASE_URL);
      await expect(page).toHaveURL(BASE_URL);
    });

    await test.step('Select a month (e.g., September)', async () => {
      await calculatorPage.selectMonth('m09'); // 'm09' corresponds to September
      await expect(calculatorPage.monthDropdown).toHaveValue('m09');
    });

    await test.step('Enter previous and current meter readings', async () => {
      await calculatorPage.enterMeterReads('500', '700');
      await expect(calculatorPage.previousReadInput).toHaveValue('500');
      await expect(calculatorPage.currentReadInput).toHaveValue('700');
    });

    await test.step('Select Electric and Gas service type', async () => {
      await calculatorPage.selectServiceType('electricAndGas');
      await expect(calculatorPage.electricAndGasServiceTypeRadio).toBeChecked();
      await expect(calculatorPage.electricServiceTypeRadio).not.toBeChecked();
      // Crucial assumption: Selecting 'electricAndGas' enables the gas consumption input.
      // If the UI/backend doesn't enable it, this test step will fail.
      await expect(calculatorPage.estimatedGasUseInput).toBeEnabled();
    });

    await test.step('Click Calculate and verify estimated electric and gas use', async () => {
      await calculatorPage.clickCalculate();
      // Assuming a simple calculation for electric (current - previous)
      await expect(calculatorPage.estimatedElectricUseInput).toHaveValue('200'); // 700 - 500 = 200 kWh
      // Assuming some placeholder calculation for gas use (e.g., a fixed value or based on another hidden logic)
      await expect(calculatorPage.estimatedGasUseInput).not.toHaveValue('0'); // Expecting a calculated value
      await expect(calculatorPage.estimatedGasUseInput).toHaveValue('10'); // Placeholder value for Gas Ccf
    });
  });

  test('should verify "How to Read Your Bill" button functionality', async ({ page }) => {
    const calculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the rate calculator page', async () => {
      await calculatorPage.navigateTo(BASE_URL);
      await expect(page).toHaveURL(BASE_URL);
    });

    await test.step('Click "How to Read Your Bill" button', async () => {
      await calculatorPage.clickHowToReadYourBill();
      // For this scenario, we only assert the button is enabled and interactable.
      // If clicking this button navigates to a new page or opens a modal, more specific
      // assertions (e.g., toHaveURL, toHaveTitle, modal visibility) would be added here.
      await expect(calculatorPage.howToReadYourBillButton).toBeEnabled();
    });

    await test.step('Click "How to Find Usage" button', async () => {
      await calculatorPage.clickHowToFindUsage();
      // Similar to the above, asserting interactability.
      await expect(calculatorPage.howToFindUsageButton).toBeEnabled();
    });
  });
});