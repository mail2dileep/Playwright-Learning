import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Relative path to Page Object

test.describe('Rate Calculator Functionality', () => {

  let rateCalculatorPage: RateCalculatorPage;

  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Navigating to the page before each test.
    // The actual path '/rate-calculator' should match your application's route.
    await rateCalculatorPage.navigateTo();
  });

  test('should calculate electric usage correctly and reset values', async () => {
    // Step 1: Select "December" for the month (value 'm12')
    await rateCalculatorPage.selectMonth('m12');
    await expect(rateCalculatorPage.getSelectedMonth()).resolves.toBe('m12');

    // Step 2: Enter "100" for Previous Read
    await rateCalculatorPage.enterPreviousRead('100');
    await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('100');

    // Step 3: Enter "200" for Current Read
    await rateCalculatorPage.enterCurrentRead('200');
    await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('200');

    // Step 4: Select "Electric" service type (radio button with id 'e')
    await rateCalculatorPage.selectServiceType('Electric');
    await expect(rateCalculatorPage.isElectricServiceTypeSelected()).resolves.toBe(true);

    // Step 5: Click "Calculate"
    await rateCalculatorPage.clickCalculate();

    // Step 6: Assert "Estimated Electric use (kWh):" is "100" (200 - 100)
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('100');

    // Step 7: Click "Reset"
    await rateCalculatorPage.clickReset();

    // Step 8: Assert fields are reset to initial values
    // Initial values based on Locator Catalog: Month 'm06' (June), Reads '0', Estimated Use '0'
    // And radio 'e' has currentValue 'E', implying it might be the default selection.
    await expect(rateCalculatorPage.getSelectedMonth()).resolves.toBe('m06');
    await expect(rateCalculatorPage.getPreviousReadValue()).resolves.toBe('0');
    await expect(rateCalculatorPage.getCurrentReadValue()).resolves.toBe('0');
    await expect(rateCalculatorPage.getEstimatedElectricUse()).resolves.toBe('0');
    await expect(rateCalculatorPage.isElectricServiceTypeSelected()).resolves.toBe(true);
  });

  test('should verify interaction with How to Read Your Bill button', async () => {
    // Assert the button is visible and enabled initially.
    // Note: Directly accessing locator via `page['locatorName']` is for internal verification in tests
    // when no specific getter/action is provided in PO for checking element state, but PO methods are preferred.
    // For this specific test, we'll ensure the button can be clicked.
    // As no specific expected outcome (e.g., new page, modal content) is provided, we assert the action can be performed.
    await expect(rateCalculatorPage['howToReadYourBillButton']).toBeVisible();
    await expect(rateCalculatorPage['howToReadYourBillButton']).toBeEnabled();

    // Click the button using the Page Object method.
    await rateCalculatorPage.clickHowToReadYourBill();

    // As no specific navigation or modal content is defined as an expected result,
    // we can assert that the button remains visible, implying no navigation away occurred for this scenario,
    // or that some client-side action was triggered.
    await expect(rateCalculatorPage['howToReadYourBillButton']).toBeVisible();
  });
});
