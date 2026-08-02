import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage';

test.describe('AEM Authoring Capabilities Validation', () => {

  const AEM_AUTHOR_URL = 'http://localhost:4502/editor.html/content/your-site/en/home/rate-calculator.html'; // Placeholder: Update with your actual AEM Author URL

  test('Verify author can edit Rate Calculator component fields and pricing', async ({ page }) => {
    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Open the page in AEM Author mode and select the Rate Calculator component.
    // Assuming the URL directly opens the page where the component dialog can be edited or is visible.
    await rateCalculatorPage.navigate(AEM_AUTHOR_URL);
    // Add an explicit wait or assertion if the page needs time to load or component needs to be explicitly "selected"
    // For now, assuming direct interaction is possible after navigation.

    // Step 2: Modify the 'Electric fuel' pricing values.
    // NOTE: 'Gas fuel' is disabled per the locator catalog, so it cannot be modified.
    const newElectricKWH = '250';
    await rateCalculatorPage.setEstimatedElectricUse(newElectricKWH);

    // Step 3: Edit fields in the 'location details' section.
    const selectedMonth = 'August';
    const newPreviousRead = '100';
    const newCurrentRead = '350';
    const serviceType = 'Electric';

    await rateCalculatorPage.selectMonth(selectedMonth);
    await rateCalculatorPage.setPreviousMeterRead(newPreviousRead);
    await rateCalculatorPage.setCurrentMeterRead(newCurrentRead);
    await rateCalculatorPage.selectServiceType(serviceType);

    await rateCalculatorPage.clickCalculate(); // Assuming 'Calculate' button saves/applies changes

    // Expected Result: Changes are saved successfully and reflected on the component.
    await expect(rateCalculatorPage.getEstimatedElectricUseValue()).resolves.toBe(newElectricKWH);
    await expect(rateCalculatorPage.getSelectedMonth()).resolves.toBe(selectedMonth);
    await expect(rateCalculatorPage.getPreviousMeterReadValue()).resolves.toBe(newPreviousRead);
    await expect(rateCalculatorPage.getCurrentMeterReadValue()).resolves.toBe(newCurrentRead);
    await expect(rateCalculatorPage.isElectricServiceTypeSelected()).resolves.toBe(true);
  });
});
