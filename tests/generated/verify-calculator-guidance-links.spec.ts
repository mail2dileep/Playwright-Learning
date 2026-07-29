import { test, expect, Page, BrowserContext } from "@playwright/test";
import { CalculatorGuidancePage } from "../../pages/CalculatorGuidancePage"; // Adjust path based on your project structure

test.describe('Verify PDF guidance links functionality', () => {

  // beforeEach hook to navigate to the page containing the calculator elements
  // This ensures each test starts from a consistent state.
  test.beforeEach(async ({ page }) => {
    // NOTE: A placeholder URL is used here. In a real application,
    // this should be the actual URL where the calculator and its guidance buttons are located.
    await page.goto('https://example.com/calculator-page');
    // Optionally, add a wait for network idle or a specific element to ensure page is fully loaded
    // await page.waitForLoadState('networkidle');
  });

  test('Validate "How to read your bill" and "How to find Usage" links open new content', async ({ page, context }) => {
    const guidancePage = new CalculatorGuidancePage(page);

    // Step 1: Click on the 'How to read your bill' button
    // The expectation is that a corresponding PDF document opens in a new tab or downloads.
    // We use context.waitForEvent('page') to capture the new tab/popup that opens after the click.
    const [howToReadYourBillPopup] = await Promise.all([
      context.waitForEvent('page'), // Wait for a new page to open within the browser context
      guidancePage.clickHowToReadYourBillButton(), // Perform the click action via Page Object
    ]);

    // Assert that a new page (popup/tab) was successfully opened.
    await expect(howToReadYourBillPopup).toBeDefined();
    // Further assert that the new page's URL is different from the original page's URL,
    // confirming new content was loaded, typically a PDF or a new informational page.
    await expect(howToReadYourBillPopup.url()).not.toBe(page.url());
    // Enterprise-grade: Add more specific assertions about the new page's content or URL if possible.
    // For example: await expect(howToReadYourBillPopup).toHaveTitle(/Your Bill Guide/);
    // For PDF content, you might assert the URL contains '.pdf' or check response headers.

    // Close the popup to clean up the browser state before proceeding to the next step.
    await howToReadYourBillPopup.close();

    // Step 2: Click on the 'How to find Usage' button
    // Similar to Step 1, we expect another new tab/popup to open for usage guidance.
    const [howToFindUsagePopup] = await Promise.all([
      context.waitForEvent('page'), // Wait for another new page to open
      guidancePage.clickHowToFindUsageButton(), // Perform the click action via Page Object
    ]);

    // Assert that the second new page (popup/tab) was successfully opened.
    await expect(howToFindUsagePopup).toBeDefined();
    // Verify its URL is different from the original page, indicating new content.
    await expect(howToFindUsagePopup.url()).not.toBe(page.url());
    // Enterprise-grade: Add more specific assertions for the usage guidance page.
    // For example: await expect(howToFindUsagePopup).toHaveTitle(/Usage Guide/);
    // await expect(howToFindUsagePopup.url()).toContain('usage-guidance.pdf');

    // Close the second popup for a clean test completion.
    await howToFindUsagePopup.close();
  });
});