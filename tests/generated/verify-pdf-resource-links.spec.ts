import { test, expect } from '@playwright/test';
import { ResourcesPage } from '../../pages/ResourcesPage';

test.describe('PDF Resource Links Validation', () => {

  // Before each test, navigate to the base URL if needed. 
  // For this exercise, we assume the page is already at the correct state/URL.
  // test.beforeEach(async ({ page }) => {
  //   await page.goto('YOUR_APPLICATION_URL_HERE'); 
  // });

  test('Verify \"How to read your bill\" PDF link opens correctly', async ({ page }) => {
    const resourcesPage = new ResourcesPage(page);

    // Step 1: Click on 'How to read your bill' link.
    const howToReadBillPdfPage = await resourcesPage.clickHowToReadYourBillLink();

    // Expected Result: The 'How to read your bill' PDF opens in a new tab or downloads correctly.
    // Assert that a new page object was returned, indicating a popup/new tab opened.
    expect(howToReadBillPdfPage).toBeDefined();
    // Optional: For more robust validation, you might check the new page's URL for a PDF extension
    // or content type header. Example: expect(howToReadBillPdfPage.url()).toMatch(/\.pdf$/);
    
    // Close the opened PDF page to clean up browser state
    await howToReadBillPdfPage.close();
  });

  test('Verify \"How to find Usage\" PDF link opens correctly', async ({ page }) => {
    const resourcesPage = new ResourcesPage(page);

    // Step 2: Click on 'How to find Usage' link.
    const howToFindUsagePdfPage = await resourcesPage.clickHowToFindUsageLink();

    // Expected Result: The 'How to find Usage' PDF opens in a new tab or downloads correctly.
    // Assert that a new page object was returned, indicating a popup/new tab opened.
    expect(howToFindUsagePdfPage).toBeDefined();
    // Optional: For more robust validation, you might check the new page's URL for a PDF extension
    // or content type header. Example: expect(howToFindUsagePdfPage.url()).toMatch(/\.pdf$/);

    // Close the opened PDF page to clean up browser state
    await howToFindUsagePdfPage.close();
  });
});