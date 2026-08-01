import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage';

test.describe('PDF Resource Links Verification', () => {

  test('should open \'How to read your bill\' and \'How to find Usage\' PDFs', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    // Navigate to the calculator page. Adjust the URL as per your application's routing.
    // If baseURL is configured in playwright.config.ts, you can use '/' or a specific path.
    await calculatorPage.navigateToCalculatorPage('/calculator'); // Placeholder: Replace with the actual URL segment for the calculator page

    // Step 1: Click on the 'How to read your bill' button and verify the PDF opens
    test.step('Click on \'How to read your bill\' link and verify PDF', async () => {
      const howToReadBillPdfPage = await calculatorPage.clickHowToReadYourBill();
      expect(howToReadBillPdfPage, 'Expected a new page/popup to open for "How to read your bill"').toBeDefined();
      // Verify that the URL of the new page indicates a PDF document
      expect(howToReadBillPdfPage.url(), 'Expected the new page URL to end with ".pdf" for "How to read your bill"').toMatch(/\.pdf$/i);
      await howToReadBillPdfPage.close(); // Close the opened PDF tab/page for cleanup
    });

    // Step 2: Click on the 'How to find Usage' button and verify the PDF opens
    test.step('Click on \'How to find Usage\' link and verify PDF', async () => {
      const howToFindUsagePdfPage = await calculatorPage.clickHowToFindUsage();
      expect(howToFindUsagePdfPage, 'Expected a new page/popup to open for "How to find Usage"').toBeDefined();
      // Verify that the URL of the new page indicates a PDF document
      expect(howToFindUsagePdfPage.url(), 'Expected the new page URL to end with ".pdf" for "How to find Usage"').toMatch(/\.pdf$/i);
      await howToFindUsagePdfPage.close(); // Close the opened PDF tab/page for cleanup
    });
  });
});