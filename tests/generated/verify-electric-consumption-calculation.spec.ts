import { test, expect } from '@playwright/test';
import { ConsumptionCalculatorPage } from '../../pages/ConsumptionCalculatorPage';

test.describe('Consumption Calculator Functionality', () => {
  const TEST_URL = 'https://example.com/calculator'; // Placeholder URL for the application under test

  test('should successfully calculate electric consumption for valid inputs', async ({ page }) => {
    // Step 1: Instantiate Page Object and Navigate
    const calculatorPage = new ConsumptionCalculatorPage(page);
    await calculatorPage.navigateTo(TEST_URL);

    // Step 2: Input consumption details and select electric service
    const month = 'm07'; // July
    const previousRead = '1000';
    const currentRead = '1250';

    await calculatorPage.calculateElectricConsumption(month, previousRead, currentRead);

    // Step 3: Verify the estimated electric use
    const estimatedElectricUse = await calculatorPage.getEstimatedElectricUse();
    // Assuming the calculation logic is (currentRead - previousRead)
    expect(estimatedElectricUse).toBe('250');

    // Step 4: Verify Estimated Gas use field is disabled (as per locator metadata)
    const isGasUseDisabled = await calculatorPage.isEstimatedGasUseFieldDisabled();
    expect(isGasUseDisabled).toBe(true);
  });

  test('should reset the form fields to their default state when reset button is clicked', async ({ page }) => {
    // Step 1: Instantiate Page Object and Navigate
    const calculatorPage = new ConsumptionCalculatorPage(page);
    await calculatorPage.navigateTo(TEST_URL);

    // Step 2: Input some data to ensure fields are changed from default
    await calculatorPage.selectMonth('m12'); // December
    await calculatorPage.enterPreviousMeterRead('500');
    await calculatorPage.enterCurrentMeterRead('600');
    await calculatorPage.selectServiceTypeElectricGas(); // Select Electric + Gas

    // Step 3: Click reset button
    await calculatorPage.clickReset();

    // Step 4: Verify fields are reset to their known default values
    // Default month is 'm06' (June) as per locator catalog 'currentValue' for the month dropdown.
    expect(await calculatorPage.getSelectedMonthValue()).toBe('m06');
    // Default meter reads are '0' as per locator catalog 'currentValue'.
    expect(await calculatorPage.getPreviousMeterReadValue()).toBe('0');
    expect(await calculatorPage.getCurrentMeterReadValue()).toBe('0');
    // Assuming 'E' (Electric) is the default selected service type after reset.
    expect(await calculatorPage.isElectricServiceTypeSelected()).toBe(true);
  });
});