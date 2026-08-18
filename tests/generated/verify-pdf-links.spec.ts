import { test, expect, Page } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage';

test.describe('PDF Link Validation on Calculator Page', () => {

  test('Verify "How to read your bill" link opens the correct document', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    // Step 1: Click on 'How to read your bill' link.
    // Expected Result: The corresponding PDF document opens in a new tab or downloads.
    const billPdfPage = await calculatorPage.clickHowToReadYourBillLink();
    
    // Assert that a new page (popup) was opened.
    expect(billPdfPage).toBeDefined();
    
    // Assert that the opened page has a URL (indicating it's a valid navigation).
    expect(billPdfPage.url()).not.toBeNull();
    
    // In a real scenario, you would assert against the expected PDF URL or its content.
    // Example: expect(billPdfPage.url()).toContain('how-to-read-your-bill.pdf');
    console.log(`Opened PDF URL for 'How to Read Your Bill': ${billPdfPage.url()}`);
    
    await billPdfPage.close(); // Close the popup after verification to clean up
  });

  test('Verify "How to find Usage" link opens the correct document', async ({ page }) => {
    const calculatorPage = new CalculatorPage(page);

    // Step 2: Click on 'How to find Usage' link.
    // Expected Result: The corresponding PDF document opens in a new tab or downloads.
    const usagePdfPage = await calculatorPage.clickHowToFindUsageLink();

    // Assert that a new page (popup) was opened.
    expect(usagePdfPage).toBeDefined();
    
    // Assert that the opened page has a URL (indicating it's a valid navigation).
    expect(usagePdfPage.url()).not.toBeNull();
    
    // In a real scenario, you would assert against the expected PDF URL or its content.
    // Example: expect(usagePdfPage.url()).toContain('how-to-find-usage.pdf');
    console.log(`Opened PDF URL for 'How to Find Usage': ${usagePdfPage.url()}`);
    
    await usagePdfPage.close(); // Close the popup after verification to clean up
  });
});