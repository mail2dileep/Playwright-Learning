import { test, expect, Page } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage'; // Adjust path as necessary

test.describe('PDF Resource Link Validation', () => {
  let calculatorPage: CalculatorPage;
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    // It's good practice to navigate to the page under test first.
    // Assuming a base URL is configured in playwright.config.ts
    // and the calculator page is at the root or a known path.
    page = await browser.newPage();
    await page.goto('/'); // Navigate to the base URL or specific page path
    calculatorPage = new CalculatorPage(page);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('should open corresponding PDF documents successfully', async () => {
    // Step 1: Click on the 'How to read your bill' link.
    // Expected Result: The corresponding PDF document opens in a new tab or downloads successfully.
    // We expect a new page (popup) to open for the PDF document.
    const [howToReadBillPage] = await Promise.all([
      page.waitForEvent('popup'), // Waits for a new tab/window to open
      calculatorPage.clickHowToReadYourBill(),
    ]);
    await expect(howToReadBillPage).toBeDefined();
    // Further assertions could be added here, e.g., checking the URL of the new page
    // await expect(howToReadBillPage).toHaveURL(/.*\.pdf/);
    // Close the opened PDF tab to clean up and avoid interference with subsequent actions
    await howToReadBillPage.close();

    // Step 2: Click on the 'How to find Usage' link.
    // Expected Result: The corresponding PDF document opens in a new tab or downloads successfully.
    const [howToFindUsagePage] = await Promise.all([
      page.waitForEvent('popup'), // Waits for a new tab/window to open
      calculatorPage.clickHowToFindUsage(),
    ]);
    await expect(howToFindUsagePage).toBeDefined();
    // Further assertions could be added here, e.g., checking the URL of the new page
    // await expect(howToFindUsagePage).toHaveURL(/.*\.pdf/);
    await howToFindUsagePage.close();

    // Note: If the expected behavior is a download instead of opening in a new tab,
    // 'page.waitForEvent("download")' should be used instead of 'page.waitForEvent("popup")'.
    // Verification for downloads would involve checking the downloaded file's name and potentially content.
  });
});