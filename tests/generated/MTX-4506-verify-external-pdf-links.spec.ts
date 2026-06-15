import { test, expect } from '@playwright/test';

class InfoLinksPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.readBillLink = page.getByRole('link', { name: 'How to read your bill', exact: true });
    this.findUsageLink = page.getByRole('link', { name: 'How to find Usage', exact: true });
  }

  async goto() {
    const url = process.env.INFO_LINKS_URL || 'http://localhost:3000/';
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }
}

/**
 * Verifies that clicking a link opens a PDF either via a new tab or a file download.
 * Returns metadata about how the PDF was opened.
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').BrowserContext} context
 * @param {import('@playwright/test').Locator} linkLocator
 */
async function verifyPdfOpens(page, context, linkLocator) {
  // Prepare listeners before the click
  const downloadPromise = page.waitForEvent('download').catch(() => null);
  const newPagePromise = context.waitForEvent('page').catch(() => null);

  // Click the link to trigger either a download or a new tab
  await Promise.all([
    linkLocator.click(),
  ]);

  // Wait for either a download or new page to occur
  const winner = await Promise.race([downloadPromise, newPagePromise]);

  // If neither triggered, throw an error
  if (!winner) {
    throw new Error('No download or new tab detected after clicking the link.');
  }

  // If it is a Download object (has suggestedFilename function)
  if (typeof winner.suggestedFilename === 'function') {
    const download = winner;
    const filename = download.suggestedFilename();
    // Assert the file looks like a PDF by filename
    expect(filename.toLowerCase()).toMatch(/\.pdf(\?|$)/);
    // Optionally check URL pattern too
    const url = download.url();
    expect(url).toBeTruthy();
    return { type: 'download', filename, url };
  }

  // Otherwise, it's a Page (new tab/popup)
  const newPage = winner;
  await newPage.waitForLoadState('domcontentloaded');

  const pdfUrl = newPage.url();
  // Try to validate via content-type header or URL heuristic
  let contentType = '';
  try {
    const resp = await newPage.waitForResponse(
      r => r.url() === pdfUrl || /\.pdf(\?|$)/i.test(r.url()),
      { timeout: 10000 }
    );
    if (resp) {
      const headers = resp.headers();
      contentType = headers['content-type'] || '';
    }
  } catch {
    // Ignore response wait timeout; we'll fall back to URL check
  }

  const looksLikePdf =
    /\.pdf(\?|$)/i.test(pdfUrl) ||
    /application\/pdf/i.test(contentType);

  expect(looksLikePdf, `Expected a PDF to open, got url=${pdfUrl} content-type=${contentType || 'unknown'}`).toBeTruthy();

  // Close the new tab to keep context clean for subsequent steps
  await newPage.close();

  return { type: 'new-tab', url: pdfUrl, contentType };
}

test.describe('MTX-4506 - Verify External PDF Links', () => {
  test('Verify External PDF Links', async ({ page, context }) => {
    const infoLinksPage = new InfoLinksPage(page);
    await infoLinksPage.goto();

    // Step 1: Click on 'How to read your bill' link and verify a PDF opens
    await expect(infoLinksPage.readBillLink, 'The "How to read your bill" link should be visible').toBeVisible();
    const resultReadBill = await verifyPdfOpens(page, context, infoLinksPage.readBillLink);
    expect(['download', 'new-tab']).toContain(resultReadBill.type);

    // Step 2: Click on 'How to find Usage' link and verify a PDF opens
    await expect(infoLinksPage.findUsageLink, 'The "How to find Usage" link should be visible').toBeVisible();
    const resultFindUsage = await verifyPdfOpens(page, context, infoLinksPage.findUsageLink);
    expect(['download', 'new-tab']).toContain(resultFindUsage.type);
  });
});