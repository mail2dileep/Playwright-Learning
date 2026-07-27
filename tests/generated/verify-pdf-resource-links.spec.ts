import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage';

test.describe('PDF Resource Links Verification', () => {
  let calculatorPage: CalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new CalculatorPage(page);
    // Assume navigation to the calculator page is handled here
    // For demonstration, we'll use a placeholder URL
    await page.goto('https://example.com/calculator'); 
  });

  test('should open "How to read your bill" PDF in a new tab/viewer', async ({ page }) => {
    // Step 1: Click on 'How to read your bill' link.
    const [newPdfPage] = await Promise.all([
      page.waitForEvent('popup'),
      calculatorPage.clickHowToReadYourBillLink(),
    ]);

    // Expected Result: The corresponding PDF document opens in a new tab or viewer.
    expect(newPdfPage).toBeDefined();
    // Check if the URL of the new page indicates a PDF document
    expect(newPdfPage.url()).toMatch(/\/(.*\.pdf$)/);
    await newPdfPage.close();
  });

  test('should open "How to find Usage" PDF in a new tab/viewer', async ({ page }) => {
    // Step 2: Click on 'How to find Usage' link.
    const [newPdfPage] = await Promise.all([
      page.waitForEvent('popup'),
      calculatorPage.clickHowToFindUsageLink(),
    ]);

    // Expected Result: The corresponding PDF document opens in a new tab or viewer.
    expect(newPdfPage).toBeDefined();
    // Check if the URL of the new page indicates a PDF document
    expect(newPdfPage.url()).toMatch(/\/(.*\.pdf$)/);
    await newPdfPage.close();
  });
});