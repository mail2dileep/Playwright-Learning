import { test, expect } from '@playwright/test';

class InfoLinksPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.howToReadBillLink = page.getByRole('link', { name: /how to read your bill/i });
    this.howToFindUsageLink = page.getByRole('link', { name: /how to find usage/i });
  }

  async goto(url) {
    await this.page.goto(url);
  }
}

/**
 * Validate that clicking a link opens a PDF in a new tab, downloads a PDF, or navigates the same tab to a PDF.
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} locator
 * @param {string} linkName
 */
async function assertPdfLinkBehavior(page, locator, linkName) {
  // Prepare listeners before clicking
  const popupPromise = page.waitForEvent('popup', { timeout: 10000 }).catch(() => null);
  const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);

  await expect(locator, `${linkName} link should be visible`).toBeVisible();

  // Click the link
  await locator.click();

  // Resolve whichever event happens
  const popup = await popupPromise;
  const download = await downloadPromise;

  if (popup) {
    await popup.waitForLoadState('domcontentloaded', { timeout: 15000 });
    let targetUrl = popup.url();

    // Sometimes initial URL is about:blank; wait for a real URL if needed
    if (!targetUrl || targetUrl === 'about:blank') {
      await popup.waitForLoadState('load', { timeout: 15000 });
      targetUrl = popup.url();
    }

    // Fallback wait in case URL is still not set properly
    if (!targetUrl || targetUrl === 'about:blank') {
      await popup.waitForTimeout(500); // brief settle
      targetUrl = popup.url();
    }

    // Validate target URL points to a PDF by checking content-type
    const isPdf = await isPdfUrl(page, targetUrl);
    expect(isPdf, `${linkName}: Expected opened tab to load a PDF. URL: ${targetUrl}`).toBeTruthy();

    // Close popup to keep test environment clean
    await popup.close();
    return;
  }

  if (download) {
    const failure = await download.failure();
    expect(failure, `${linkName}: Expected file to download successfully`).toBeNull();

    const suggested = download.suggestedFilename() || '';
    expect(
      suggested.toLowerCase().includes('.pdf'),
      `${linkName}: Expected downloaded filename to be a PDF, got "${suggested}"`
    ).toBeTruthy();

    return;
  }

  // Handle same-tab navigation to a PDF
  const previousUrl = page.url();
  try {
    await page.waitForURL(url => url.toLowerCase().includes('.pdf'), { timeout: 5000 });
  } catch {
    // ignore; we'll still check below
  }
  const currentUrl = page.url();

  if (currentUrl !== previousUrl) {
    const isPdf = await isPdfUrl(page, currentUrl);
    expect(isPdf, `${linkName}: Expected navigation to a PDF. URL: ${currentUrl}`).toBeTruthy();
    // navigate back to continue with next step
    await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {});
    return;
  }

  throw new Error(`${linkName}: Neither a new tab opened, a file downloaded, nor same-tab navigation to a PDF occurred.`);
}

/**
 * Determine if a URL points to a PDF by checking response headers.
 * Uses HEAD with GET fallback.
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @returns {Promise<boolean>}
 */
async function isPdfUrl(page, url) {
  if (!url || url === 'about:blank') return false;
  try {
    let res = await page.request.head(url);
    if (!res || !res.ok()) {
      res = await page.request.get(url);
    }
    if (!res) return false;
    const headers = res.headers();
    const ct = (headers['content-type'] || headers['Content-Type'] || '').toLowerCase();
    return ct.includes('application/pdf');
  } catch {
    return false;
  }
}

function resolveBaseUrl(baseURLFixture) {
  return process.env.APP_URL || baseURLFixture || 'http://localhost:3000';
}

test.describe('MTX-4506 - TC_004 - Validate External PDF Links', () => {
  test('TC_004 - Validate External PDF Links', async ({ page, baseURL }) => {
    const appUrl = resolveBaseUrl(baseURL);
    const infoPage = new InfoLinksPage(page);

    await test.step('Navigate to application', async () => {
      await infoPage.goto(appUrl);
      await expect(page).toHaveURL(/.+/);
    });

    await test.step("Step 1: Click on the 'How to read your bill' link and verify PDF open/download", async () => {
      await assertPdfLinkBehavior(page, infoPage.howToReadBillLink, 'How to read your bill');
    });

    await test.step("Step 2: Click on the 'How to find Usage' link and verify PDF open/download", async () => {
      await assertPdfLinkBehavior(page, infoPage.howToFindUsageLink, 'How to find Usage');
    });
  });
});