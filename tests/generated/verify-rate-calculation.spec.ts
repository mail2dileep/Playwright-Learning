import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative import

test.describe('Rate Calculator Functionality', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Assuming the application is hosted at a base URL, or you can navigate directly here.
    await rateCalculatorPage.navigateTo('/calculator'); // Example URL
  });

  test('should successfully calculate rates for Electric and Gas service', async ({ page }) => {
    const previousRead = '1000';
    const currentRead = '1250';
    const selectedMonthValue = 'm08'; // August

    // Action: Select Electric and Gas service
    await rateCalculatorPage.selectElectricGasService();

    // Assertion: Verify Gas use input is now enabled after selecting 'EG' service
    await expect(rateCalculatorPage.isEstimatedGasUseDisabled()).resolves.toBe(false);

    // Action: Enter previous and current meter reads
    await rateCalculatorPage.enterPreviousRead(previousRead);
    await rateCalculatorPage.enterCurrentRead(currentRead);

    // Action: Select a month
    await rateCalculatorPage.selectMonth(selectedMonthValue);
    // Assertion: Verify month selection
    await expect(page.getByLabel('Month')).toHaveValue(selectedMonthValue);

    // Action: Click calculate
    await rateCalculatorPage.clickCalculate();

    // Assertions: Verify estimated usage
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('250'); // 1250 - 1000 = 250 kWh

    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).toBe('250'); // Example expected value for gas when EG is selected

    // Optional: Click reset and verify fields are cleared to default values
    await rateCalculatorPage.clickReset();
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0');
    await expect(rateCalculatorPage.getEstimatedGasUse()).resolves.toBe('0');
    await expect(page.getByLabel('Enter Previous Read:')).toHaveValue('0');
    await expect(page.getByLabel('Enter Current Read:')).toHaveValue('0');
    // Default month is 'm06' (June)
    await expect(page.getByLabel('Month')).toHaveValue('m06');
  });

  test('should show estimated electric use when only Electric service is selected', async ({ page }) => {
    const previousRead = '500';
    const currentRead = '700';
    const selectedMonthValue = 'm10'; // October

    // Action: Select Electric service
    await rateCalculatorPage.selectElectricService();
    // Assertion: Verify Gas use input remains disabled
    await expect(rateCalculatorPage.isEstimatedGasUseDisabled()).resolves.toBe(true);

    // Action: Enter meter reads and select month
    await rateCalculatorPage.enterPreviousRead(previousRead);
    await rateCalculatorPage.enterCurrentRead(currentRead);
    await rateCalculatorPage.selectMonth(selectedMonthValue);
    await rateCalculatorPage.clickCalculate();

    // Assertions: Verify estimated usage
    const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
    expect(estimatedElectricUse).toBe('200'); // 700 - 500 = 200 kWh

    const estimatedGasUse = await rateCalculatorPage.getEstimatedGasUse();
    expect(estimatedGasUse).toBe('0'); // Gas consumption should be 0 if only Electric is selected.
  });

  test('should allow interaction with "How to Read Your Bill" button', async ({ page }) => {
    // Action: Click the "How to Read Your Bill" button
    await rateCalculatorPage.clickHowToReadYourBill();
    // Assertion: Add verification for navigation, e.g., URL or a specific element on the new page
    // For this example, we assume clicking it might open a modal or navigate to a specific help section.
    // await expect(page).toHaveURL(/.*read-your-bill/);
  });
});