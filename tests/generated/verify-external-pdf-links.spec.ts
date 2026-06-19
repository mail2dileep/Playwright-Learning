import { test, expect } from '@playwright/test';
import { HelpLinksPage } from '../../pages/HelpLinksPage'; // Relative path assuming framework structure

test.describe('Help Links Functionality', () => {
  test('Verify external PDF links open correctly', async ({ page }) => {
    const helpLinksPage = new HelpLinksPage(page);

    // Step 1: Click on the 'How to read your bill' link.
    test.info().annotations.push({ type: 'step', description: "Click on the 'How to read your bill' link." });
    const howToReadBillPdfPage = await helpLinksPage.clickHowToReadYourBillLink();

    // Expected Result: The corresponding PDF document opens in a new tab or downloads.
    // If howToReadBillPdfPage is null, it means the new page did not open,
    // likely because the required locator was not found and no click could be performed.
    if (howToReadBillPdfPage) {
      await expect(howToReadBillPdfPage, "Expected 'How to read your bill' PDF to open").toHaveURL(/.*\.pdf/);
      await howToReadBillPdfPage.close(); // Close the new tab after verification
    } else {
      // Fail the test if the expected PDF page did not open, as per the test objective.
      expect(howToReadBillPdfPage, "Failed to open 'How to read your bill' PDF: Locator not found or click failed.").not.toBeNull();
    }

    // Step 2: Click on the 'How to find Usage' link.
    test.info().annotations.push({ type: 'step', description: "Click on the 'How to find Usage' link." });
    const howToFindUsagePdfPage = await helpLinksPage.clickHowToFindUsageLink();

    // Expected Result: The corresponding PDF document opens in a new tab or downloads.
    // Similar to Step 1, if howToFindUsagePdfPage is null, the test objective is not met.
    if (howToFindUsagePdfPage) {
      await expect(howToFindUsagePdfPage, "Expected 'How to find Usage' PDF to open").toHaveURL(/.*\.pdf/);
      await howToFindUsagePdfPage.close(); // Close the new tab after verification
    } else {
      // Fail the test if the expected PDF page did not open, as per the test objective.
      expect(howToFindUsagePdfPage, "Failed to open 'How to find Usage' PDF: Locator not found or click failed.").not.toBeNull();
    }
  });
}