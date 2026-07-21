import { test, expect } from '@playwright/test';
import { InformationLinksPage } from '../../pages/InformationLinksPage'; // Adjust path based on your project structure

test.describe('Verify Informational PDF Links', () => {
    test('should open correct PDF documents for bill and usage information', async ({ page }) => {
        // TODO: Ensure the test navigates to the application page where these links are present.
        // Example: await page.goto('https://your-application-url.com/calculator');
        // For this example, we assume the page is already at the correct URL or will be mocked.

        const informationLinksPage = new InformationLinksPage(page);

        // Step 1: Click on the 'How to read your bill' link.
        // Expected Result: The corresponding PDF document opens in a new tab or downloads successfully.
        const billPdfPage = await informationLinksPage.clickHowToReadYourBillLink();
        
        // Assert that a new page/tab was indeed opened
        await expect(billPdfPage).toBeDefined();
        // Assert that the URL of the new page contains expected keywords for a PDF bill document.
        await expect(billPdfPage.url()).toContain('bill');
        await expect(billPdfPage.url()).toContain('pdf');
        // Close the newly opened tab to ensure subsequent actions remain on the original page
        await billPdfPage.close();

        // Step 2: Click on the 'How to find Usage' link.
        // Expected Result: The corresponding PDF document opens in a new tab or downloads successfully.
        const usagePdfPage = await informationLinksPage.clickHowToFindUsageLink();

        // Assert that a new page/tab was indeed opened
        await expect(usagePdfPage).toBeDefined();
        // Assert that the URL of the new page contains expected keywords for a PDF usage document.
        await expect(usagePdfPage.url()).toContain('usage');
        await expect(usagePdfPage.url()).toContain('pdf');
        // Close the newly opened tab
        await usagePdfPage.close();
    });
});
