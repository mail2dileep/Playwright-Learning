import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../../pages/RateCalculatorPage'; // Adjust path as per your framework structure

test.describe('MTX-4433: Verify visibility of the Rate Calculator component', () => {
    const RATE_CALCULATOR_URL = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html';

    test('should ensure the Rate Calculator section is visible on the page', async ({ page }) => {
        const rateCalculatorPage = new RateCalculatorPage(page);

        // Step 1: Navigate to the CPS Energy website page containing the rate calculator.
        await rateCalculatorPage.navigateTo(RATE_CALCULATOR_URL);
        // Expected Result: The page loads successfully. (Implicitly verified by subsequent element checks)

        // Step 2: Scroll to the Rate Calculator section.
        // Playwright's 'toBeVisible()' assertion automatically handles scrolling an element into view if it's in the DOM but off-screen.
        // We verify the visibility of key elements within the calculator to confirm the section is rendered correctly.
        
        // Expected Result: The Rate Calculator component is visible and rendered correctly.
        await expect(rateCalculatorPage.getMonthDropdownLocator()).toBeVisible();
        await expect(rateCalculatorPage.getPreviousReadInputLocator()).toBeVisible();
        await expect(rateCalculatorPage.getCurrentReadInputLocator()).toBeVisible();
        await expect(rateCalculatorPage.getEstimatedElectricUseInputLocator()).toBeVisible();
        // As per the locator catalog, the 'Estimated Gas use (Ccf)' input is disabled.
        await expect(rateCalculatorPage.getEstimatedGasUseInputLocator()).toBeDisabled(); 
        await expect(rateCalculatorPage.getCalculateButtonLocator()).toBeVisible();
    });
});
