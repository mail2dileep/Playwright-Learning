import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage';

test.describe('Rate Calculator Visibility Verification', () => {
    const calculatorUrl = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

    test('should display the Rate Calculator section correctly on the page', async ({ page }) => {
        const rateCalculatorPage = new RateCalculatorPage(page);

        // Step 1: Navigate to the CPS Energy Dotcom website energy cost calculator page.
        await rateCalculatorPage.navigateToCalculatorPage(calculatorUrl);

        // Expected Result: The Rate Calculator section is displayed correctly on the page.
        // We verify this by checking the visibility of a key element within the calculator section
        // via a Page Object method, keeping assertions in the test layer.
        const isCalculatorDisplayed = await rateCalculatorPage.isCalculatorSectionVisible();
        expect(isCalculatorDisplayed).toBe(true);
    });
});
