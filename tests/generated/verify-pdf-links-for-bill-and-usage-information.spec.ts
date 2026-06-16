import { test, expect } from '@playwright/test';
import { BillingHelpPage } from '../../pages/BillingHelpPage';

// Requirement ID: MTX-4506
// Test Name: Verify PDF Links for Bill and Usage Information

test.describe('MTX-4506: Verify PDF Links for Bill and Usage Information', () => {
  test('Validate that the PDF links open in a new tab or download', async ({ page }) => {
    const billingHelpPage = new BillingHelpPage(page);

    const targetUrl = process.env.BILLING_HELP_URL; // Optional: set env var to navigate directly to the page containing the links
    if (targetUrl) {
      await billingHelpPage.navigate(targetUrl);
    }

    await test.step("Step 1: Click on the 'How to read your bill' link", async () => {
      const result = await billingHelpPage.openHowToReadYourBillPdf();

      if (result.type === 'popup') {
        await expect(result.page).toHaveURL(/\.pdf(\?|#|$)/i);
        await result.page.close();
      } else {
        const filename = result.download.suggestedFilename();
        expect(filename.toLowerCase()).toMatch(/\.pdf$/i);
      }
    });

    await test.step("Step 2: Click on the 'How to find Usage' link", async () => {
      const result = await billingHelpPage.openHowToFindUsagePdf();

      if (result.type === 'popup') {
        await expect(result.page).toHaveURL(/\.pdf(\?|#|$)/i);
        await result.page.close();
      } else {
        const filename = result.download.suggestedFilename();
        expect(filename.toLowerCase()).toMatch(/\.pdf$/i);
      }
    });
  });
});
