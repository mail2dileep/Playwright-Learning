import { test, expect } from '@playwright/test';
import { HelpLinksPage } from '../../pages/HelpLinksPage'; // Adjust path as necessary based on project structure

test.describe('External PDF Link Validation', () => {
  let helpLinksPage: HelpLinksPage;

  test.beforeEach(async ({ page }) => {
    helpLinksPage = new HelpLinksPage(page);
    // Assuming the test starts on a page where these links are present.
    // A real scenario might include a page.goto() here.
    // await page.goto('/your-calculator-page-url');
  });

  test('MTX-4506: Validate that \'How to read your bill\' link opens the correct PDF document', async ({ page }) => {
    test.info().annotations.push({
      type: 'Requirement ID', value: 'MTX-4506'
    });
    test.info().annotations.push({
      type: 'Objective', value: 'Validate that the informational links open the correct PDF documents.'
    });
    test.info().annotations.push({
      type: 'Priority', value: 'Medium'
    });

    // Step 1: Click on 'How to read your bill' link
    // Expected Result: The corresponding PDF document opens in a new tab or viewer.
    const howToReadBillPdfPage = await helpLinksPage.clickHowToReadYourBillLink();
    
    // Verify the new page opened and its URL indicates a PDF document
    await expect(howToReadBillPdfPage).toBeDefined();
    // The exact PDF URL is not provided, so we assert it contains a common PDF pattern.
    await expect(howToReadBillPdfPage).toHaveURL(/.*\/.*\.pdf/); // Assumes URL contains '.pdf'
    await expect(howToReadBillPdfPage).not.toBeClosed();
    await howToReadBillPdfPage.close(); // Close the PDF tab after verification
  });

  test('MTX-4506: Validate that \'How to find Usage\' link opens the correct PDF document', async ({ page }) => {
    test.info().annotations.push({
      type: 'Requirement ID', value: 'MTX-4506'
    });
    test.info().annotations.push({
      type: 'Objective', value: 'Validate that the informational links open the correct PDF documents.'
    });
    test.info().annotations.push({
      type: 'Priority', value: 'Medium'
    });

    // Step 2: Click on 'How to find Usage' link
    // Expected Result: The corresponding PDF document opens in a new tab or viewer.
    const howToFindUsagePdfPage = await helpLinksPage.clickHowToFindUsageLink();

    // Verify the new page opened and its URL indicates a PDF document
    await expect(howToFindUsagePdfPage).toBeDefined();
    // The exact PDF URL is not provided, so we assert it contains a common PDF pattern.
    await expect(howToFindUsagePdfPage).toHaveURL(/.*\/.*\.pdf/); // Assumes URL contains '.pdf'
    await expect(howToFindUsagePdfPage).not.toBeClosed();
    await howToFindUsagePdfPage.close(); // Close the PDF tab after verification
  });
});