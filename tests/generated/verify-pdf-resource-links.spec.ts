import { test, expect, Page } from '@playwright/test';
import { PdfResourcesPage } from '../../pages/PdfResourcesPage';

test.describe('PDF Resource Links Verification', () => {

  // Pre-condition: Assuming the test starts on the page where these buttons are visible.
  // If navigation is required, add a page.goto() here or in a beforeEach hook.
  // For example: test.beforeEach(async ({ page }) => { await page.goto('YOUR_APPLICATION_URL_HERE'); });

  test('should validate 'How to read your bill' and 'How to find Usage' links open documents', async ({ page }) => {
    const pdfResourcesPage = new PdfResourcesPage(page);

    // Step 1: Click on the 'How to read your bill' link.
    // Expected Result: The corresponding PDF document opens in a new tab or downloads.
    // We use waitForEvent('popup') to detect a new tab opening, which is common for PDF links.
    // If it triggers a direct download without opening a new tab, page.waitForEvent('download') would be used.
    const [readBillPopup] = await Promise.all([
      page.waitForEvent('popup', { timeout: 10000 }), // Wait for a new tab/window to open (popup)
      pdfResourcesPage.clickHowToReadYourBillLink() // Click the link via Page Object method
    ]);

    // Assert that a new tab/window (popup) was indeed opened.
    expect(readBillPopup, 'Expected a new tab/window to open for "How to read your bill"').toBeDefined();
    // Further assertions could be added here if the PDF URL pattern is known,
    // e.g., expect(readBillPopup.url()).toContain('.pdf');
    await readBillPopup.close(); // Close the popup for test cleanup

    // Step 2: Click on the 'How to find Usage' link.
    // Expected Result: The corresponding PDF document opens in a new tab or downloads.
    const [findUsagePopup] = await Promise.all([
      page.waitForEvent('popup', { timeout: 10000 }), // Wait for a new tab/window to open (popup)
      pdfResourcesPage.clickHowToFindUsageLink() // Click the link via Page Object method
    ]);

    // Assert that a new tab/window (popup) was indeed opened.
    expect(findUsagePopup, 'Expected a new tab/window to open for "How to find Usage"').toBeDefined();
    // Further assertions could be added here if the PDF URL pattern is known.
    // e.g., expect(findUsagePopup.url()).toContain('.pdf');
    await findUsagePopup.close(); // Close the popup for test cleanup
  });
});
