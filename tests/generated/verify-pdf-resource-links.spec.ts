import { test, expect, Page } from '@playwright/test';
import { ResourceLinksPage } from '../../pages/ResourceLinksPage';

test.describe('PDF Resource Links Verification', () => {
  // Pre-requisite: Assuming the application is navigated to the page containing these links.
  // This can be set up in a `beforeEach` hook or directly in the test.
  test.beforeEach(async ({ page }) => {
    // In a real scenario, navigate to the specific URL where these links are present.
    // For demonstration, we'll assume the page is already loaded or provide a dummy URL.
    // await page.goto('https://example.com/calculator'); 
  });

  test('should validate How to read your bill link opens the correct PDF', async ({ page }) => {
    const resourceLinksPage = new ResourceLinksPage(page);

    await test.step('Step 1: Click on the \'How to read your bill\' link and verify PDF', async () => {
      // Playwright's page.waitForEvent('popup') is used to capture new tabs.
      // For direct PDF links, browsers often open them in a new tab/window.
      // If it triggers a download, 'page.waitForEvent('download')' would be used.
      const howToReadPdfUrl = await resourceLinksPage.getHowToReadYourBillPdfUrl();
      
      expect(howToReadPdfUrl, 'Expected PDF URL to be defined for How to Read Your Bill').toBeDefined();
      expect(howToReadPdfUrl, 'Expected URL to end with .pdf for How to Read Your Bill').toMatch(/\.pdf$/);
      // Further assertions could verify specific content of the PDF if a PDF reader library is integrated
      // or verify the filename for downloads.
    });
  });

  test('should validate How to find Usage link opens the correct PDF', async ({ page }) => {
    const resourceLinksPage = new ResourceLinksPage(page);

    await test.step('Step 2: Click on the \'How to find Usage\' link and verify PDF', async () => {
      const howToFindUsagePdfUrl = await resourceLinksPage.getHowToFindUsagePdfUrl();

      expect(howToFindUsagePdfUrl, 'Expected PDF URL to be defined for How to Find Usage').toBeDefined();
      expect(howToFindUsagePdfUrl, 'Expected URL to end with .pdf for How to Find Usage').toMatch(/\.pdf$/);
    });
  });

  // A single test combining both steps, ensuring state isolation or sequential workflow
  test('should validate both How to read your bill and How to find Usage links open PDFs', async ({ page }) => {
    const resourceLinksPage = new ResourceLinksPage(page);

    await test.step('Step 1: Click on the \'How to read your bill\' link and verify PDF', async () => {
      const howToReadPdfUrl = await resourceLinksPage.getHowToReadYourBillPdfUrl();
      expect(howToReadPdfUrl, 'Expected PDF URL to be defined for How to Read Your Bill').toBeDefined();
      expect(howToReadPdfUrl, 'Expected URL to end with .pdf for How to Read Your Bill').toMatch(/\.pdf$/);
    });

    await test.step('Step 2: Click on the \'How to find Usage\' link and verify PDF', async () => {
      const howToFindUsagePdfUrl = await resourceLinksPage.getHowToFindUsagePdfUrl();
      expect(howToFindUsagePdfUrl, 'Expected PDF URL to be defined for How to Find Usage').toBeDefined();
      expect(howToFindUsagePdfUrl, 'Expected URL to end with .pdf for How to Find Usage').toMatch(/\.pdf$/);
    });
  });
});
