import { test, expect } from '@playwright/test';
import { PDFResourcePage } from '../pages/PDFResourcePage';

test.describe('PDF Resource Links Validation', () => {
  test('Verify PDF Resource Links open correctly', async ({ page, context }) => {
    // Navigate to the page where these links are present
    // For this example, we assume the page is already at the correct URL
    // await page.goto('YOUR_APPLICATION_URL_HERE'); 

    const pdfResourcePage = new PDFResourcePage(page);

    // Step 1: Click on 'How to read your bill' link.
    // Expected Result: The corresponding PDF document opens in a new tab or viewer.
    const [howToReadBillPage] = await Promise.all([
      context.waitForEvent('page'),
      pdfResourcePage.clickHowToReadYourBillLink(),
    ]);
    expect(howToReadBillPage).toBeDefined();
    // Optional: Further assertions can be added here to validate the new page's URL or content,
    // e.g., expect(howToReadBillPage.url()).toContain('.pdf');
    await howToReadBillPage.close(); // Close the new tab/window

    // Step 2: Click on 'How to find Usage' link.
    // Expected Result: The corresponding PDF document opens in a new tab or viewer.
    const [howToFindUsagePage] = await Promise.all([
      context.waitForEvent('page'),
      pdfResourcePage.clickHowToFindUsageLink(),
    ]);
    expect(howToFindUsagePage).toBeDefined();
    // Optional: Further assertions can be added here to validate the new page's URL or content,
    // e.g., expect(howToFindUsagePage.url()).toContain('.pdf');
    await howToFindUsagePage.close(); // Close the new tab/window
  });
});