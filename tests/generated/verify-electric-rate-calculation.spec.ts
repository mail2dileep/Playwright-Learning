import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary

test.describe('Rate Calculator Functionality', () => {
  const TEST_URL = 'https://www.example.com/rate-calculator'; // Placeholder URL

  test('should calculate estimated electric use correctly for electric service', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the Rate Calculator page', async () => {
      await rateCalculatorPage.navigate(TEST_URL);
      await expect(page).toHaveURL(TEST_URL); // Verify navigation
    });

    await test.step('Select July as the month', async () => {
      await rateCalculatorPage.selectMonth('m07');
      await expect(page.getByLabel('Month')).toHaveValue('m07'); // Assert selected value
    });

    await test.step('Enter a previous meter read of 100', async () => {
      await rateCalculatorPage.enterPreviousRead('100');
      await expect(page.getByLabel('Enter Previous Read:')).toHaveValue('100');
    });

    await test.step('Enter a current meter read of 200', async () => {
      await rateCalculatorPage.enterCurrentRead('200');
      await expect(page.getByLabel('Enter Current Read:')).toHaveValue('200');
    });

    await test.step('Select Electric service type', async () => {
      await rateCalculatorPage.selectServiceTypeElectric();
      await expect(page.locator('#e')).toBeChecked();
      // Ensure the estimated gas use field remains disabled
      await expect(page.getByLabel('Estimated Gas use (Ccf):')).toBeDisabled();
    });

    await test.step('Click the Calculate button', async () => {
      await rateCalculatorPage.clickCalculate();
      // Depending on the application, this might trigger an API call or UI update
      // Adding a wait for potential calculation to complete, if needed
      // await page.waitForLoadState('networkidle');
    });

    await test.step('Verify the estimated electric use', async () => {
      // Assuming a simple calculation: Current - Previous = Consumption
      // So, 200 - 100 = 100
      // In a real scenario, this would involve comparing against expected calculation results.
      const estimatedUse = await rateCalculatorPage.getEstimatedElectricUse();
      expect(estimatedUse).toBe('100');
    });
  });

  test('should reset the form fields', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    await test.step('Navigate to the Rate Calculator page and fill some fields', async () => {
      await rateCalculatorPage.navigate(TEST_URL);
      await rateCalculatorPage.selectMonth('m08');
      await rateCalculatorPage.enterPreviousRead('50');
      await rateCalculatorPage.enterCurrentRead('150');
      await rateCalculatorPage.selectServiceTypeElectricGas();
      await expect(page.getByLabel('Month')).toHaveValue('m08');
      await expect(page.getByLabel('Enter Previous Read:')).toHaveValue('50');
      await expect(page.getByLabel('Enter Current Read:')).toHaveValue('150');
      await expect(page.locator('#eg')).toBeChecked();
    });

    await test.step('Click the Reset button', async () => {
      await rateCalculatorPage.clickReset();
      // Wait for reset action to complete
      await page.waitForTimeout(100); // Small wait to allow UI to reset if it's async
    });

    await test.step('Verify form fields are reset to initial values', async () => {
      // Initial value for month is 'm06' (June) as per locator catalog
      await expect(page.getByLabel('Month')).toHaveValue('m06');
      // Initial value for reads is '0'
      await expect(page.getByLabel('Enter Previous Read:')).toHaveValue('0');
      await expect(page.getByLabel('Enter Current Read:')).toHaveValue('0');
      // Estimated electric use also resets to '0'
      await expect(page.getByLabel('Estimated Electric use (kWh):')).toHaveValue('0');
      // Service type radio buttons typically reset to default if no specific logic prevents it.
      // Assuming 'E' (Electric) is the default unselected value if 'EG' was selected.
      // This might need specific application knowledge. For now, we'll verify 'E' is checked or 'EG' is unchecked.
      // As per locator catalog, 'E' has currentValue 'E', 'EG' has 'EG'.
      // If reset defaults to 'E', this is a reasonable assertion.
      await expect(page.locator('#e')).toBeChecked(); // Assuming 'E' becomes default after reset.
    });
  });
}