import { test, expect } from '@playwright/test';
import { RateCalculatorPage } from '../pages/RateCalculatorPage';

test.describe('Verify External PDF Links', () => {
  test('should validate that informational links open the correct PDF documents', async ({ page }) => {
    // Navigate to the page where these links are present. 
    // This URL is a plausible entry point based on the page context (Rate Calculator).
    // In a full enterprise framework, this base URL would typically be configured globally (e.g., in playwright.config.ts) 
    // or passed via environment variables, and not hardcoded here.
    await page.goto('https://www.cpsenergy.com/en/my-home/savings-programs/rate_estimator_residential.html');

    const rateCalculatorPage = new RateCalculatorPage(page);

    // Step 1: Click on the 'How to read your bill' link.
    // Expected Result: The corresponding PDF document opens in a new tab or viewer.
    const howToReadYourBillPdfUrl = await rateCalculatorPage.clickHowToReadYourBillLink();
    expect(howToReadYourBillPdfUrl).toBe('https://www.cpsenergy.com/en/external-sites/bill-help-residential-english.html');

    // Step 2: Click on the 'How to find Usage' link.
    // Expected Result: The corresponding PDF document opens in a new tab or viewer.
    // TODO: Locator for 'How to find Usage' link not found in the provided Locator Catalog.
    // According to strict requirements, new selectors cannot be invented.
    // This step cannot be automated until a valid locator is explicitly provided in the catalog.
    console.warn("WARNING: Test Step 2 ('How to find Usage' link) cannot be automated. Locator not found in catalog.");
  });
});