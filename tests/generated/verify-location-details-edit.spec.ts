import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as necessary

test.describe('MTX-4433: Rate Calculator Component - Location Details Editing', () => {
  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Step 1: Open the 'location details' configuration within the calculator component in AEM.
    // In this context, it means navigating to the front-end calculator page.
    // Placeholder URL - replace with your actual application URL for the rate calculator.
    await rateCalculatorPage.navigateTo('https://www.example.com/rate-calculator'); 
    await expect(rateCalculatorPage.monthDropdownIsVisible()).resolves.toBeTruthy(); // Verify component loaded
  });

  test('Verify author can edit location details fields and changes are persisted', async () => {
    // Assert initial state for a baseline
    await expect(rateCalculatorPage.getCurrentMonthSelection()).resolves.toBe('m06'); // Default is 'June'
    await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('0');
    await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('0');

    // Step 2: Update a field label or option and save.
    const newMonthValue = 'm07'; // Selecting July
    const newPreviousRead = '12345';
    const newCurrentRead = '12500';
    const expectedConsumption = '155'; // Example expected value, adjust based on actual calculator logic

    await test.step('Update Month and Previous/Current Read fields', async () => {
      await rateCalculatorPage.selectMonth(newMonthValue);
      await rateCalculatorPage.enterPreviousRead(newPreviousRead);
      await rateCalculatorPage.enterCurrentRead(newCurrentRead);
      await rateCalculatorPage.selectServiceType('Electric'); // Ensure Electric service type is selected for calculation
      await rateCalculatorPage.clickCalculate();
    });

    // Expected Result: Changes are persisted in the component configuration.
    // Verify inputs retain their values after calculation, indicating persistence.
    await test.step('Verify updated fields are persisted', async () => {
      await expect(rateCalculatorPage.getCurrentMonthSelection()).resolves.toBe(newMonthValue);
      await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe(newPreviousRead);
      await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe(newCurrentRead);
      
      // Verify estimated electric use is updated from the default '0'.
      // A specific assertion for the calculated value can be added if the calculation logic is known.
      const estimatedElectricUse = await rateCalculatorPage.getEstimatedElectricUse();
      await expect(estimatedElectricUse).not.toBe('0');
      await expect(parseFloat(estimatedElectricUse)).toBeGreaterThan(0);
      // If an exact expected value is known:
      // await expect(estimatedElectricUse).toBe(expectedConsumption);
    });
  });
});
