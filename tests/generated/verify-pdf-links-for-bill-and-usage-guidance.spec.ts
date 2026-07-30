import { test, expect, Page } from '@playwright/test';
import { BillAndUsageGuidancePage } from '../../pages/BillAndUsageGuidancePage'; // Correct relative import path

test.describe('Verify PDF links for bill and usage guidance', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming the application is hosted and 'baseURL' is configured in playwright.config.ts
    // Navigate to the page containing the calculator_current elements.
    // In a real scenario, replace '/' with the actual URL of the page under test.
    await page.goto('/'); 
  });

  test('should validate that \'How to read your bill\' and \'How to find Usage\' links open correct PDFs', async ({ page }) => {
    const guidancePage = new BillAndUsageGuidancePage(page);

    // Step 1: Click on the 'How to read your bill' link.
    // Expected Result: The corresponding PDF document opens in a new tab or downloads.
    // We use Promise.all to await both the click action and the new page (popup) event.
    const [howToReadYourBillPdfPage] = await Promise.all([
      page.waitForEvent('popup'), // Waits for a new page/tab to open
      guidancePage.clickHowToReadYourBillLink(),
    ]);

    // Assert that a new page/popup was successfully opened.
    await expect(howToReadYourBillPdfPage).toBeDefined();
    // Assert that the URL of the new page indicates a PDF file, ensuring a PDF was loaded.
    await expect(howToReadYourBillPdfPage.url()).toMatch(/\.(pdf)$/i);
    
    // Close the newly opened PDF page to ensure a clean state for the next step.
    await howToReadYourBillPdfPage.close();

    // Step 2: Click on the 'How to find Usage' link.
    // Expected Result: The corresponding PDF document opens in a new tab or downloads.
    // We use Promise.all to await both the click action and the new page (popup) event.
    const [howToFindUsagePdfPage] = await Promise.all([
      page.waitForEvent('popup'), // Waits for a new page/tab to open
      guidancePage.clickHowToFindUsageLink(),
    ]);

    // Assert that a new page/popup was successfully opened.
    await expect(howToFindUsagePdfPage).toBeDefined();
    // Assert that the URL of the new page indicates a PDF file.
    await expect(howToFindUsagePdfPage.url()).toMatch(/\.(pdf)$/i);

    // Close the newly opened PDF page.
    await howToFindUsagePdfPage.close();
  });
}