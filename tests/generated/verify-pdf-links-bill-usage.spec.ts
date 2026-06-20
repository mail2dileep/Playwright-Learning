import { test, expect } from "@playwright/test";
import { RateCalculatorPage } from "../../pages/RateCalculatorPage";

test.describe('Verify PDF Links for Bill and Usage Information', () => {
  let rateCalculatorPage: RateCalculatorPage;

  // Assuming a base URL for the Rate Calculator page to be available.
  // This setup ensures the page is navigated to before each test.
  test.beforeEach(async ({ page }) => {
    rateCalculatorPage = new RateCalculatorPage(page);
    // Navigate to the Rate Calculator page where these links are located.
    // Replace 'https://example.com/rate-calculator' with the actual URL of your application.
    await page.goto('https://example.com/rate-calculator');
    // You might add an assertion here to ensure the page loaded correctly, e.g.,
    // await expect(page.getByLabel('Month')).toBeVisible();
  });

  test('should validate that "How to read your bill" link opens PDF', async ({ page }) => {
    // Step 1: Click on the 'How to read your bill' link.
    // We expect a new tab/popup to open, so we listen for the 'popup' event.
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      rateCalculatorPage.clickHowToReadYourBillLink()
    ]);

    // Expected Result: The corresponding PDF document opens in a new tab or downloads successfully.
    // Assert that a new page was opened.
    expect(newPage).not.toBeNull();
    // Assert that the new page's URL indicates a PDF document.
    // This typically means the URL ends with '.pdf' or contains it.
    await expect(newPage).toHaveURL(/.*\.pdf/);
    // Optionally, you could add more robust checks like verifying the content-type of the response
    // await newPage.waitForLoadState('networkidle');
    // const response = await newPage.waitForResponse(resp => resp.url().includes('.pdf') && resp.request().resourceType() === 'document');
    // expect(response.headers()['content-type']).toContain('application/pdf');
  });

  test('should validate that "How to find Usage" link opens PDF', async ({ page }) => {
    // Step 2: Click on the 'How to find Usage' link.
    // We expect a new tab/popup to open, so we listen for the 'popup' event.
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      rateCalculatorPage.clickHowToFindUsageLink()
    ]);

    // Expected Result: The corresponding PDF document opens in a new tab or downloads successfully.
    // Assert that a new page was opened.
    expect(newPage).not.toBeNull();
    // Assert that the new page's URL indicates a PDF document.
    await expect(newPage).toHaveURL(/.*\.pdf/);
  });
});