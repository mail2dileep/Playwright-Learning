import { test, expect } from '@playwright/test';

test.use({
  baseURL: process.env.APP_URL || process.env.BASE_URL || 'http://localhost:3000',
  acceptDownloads: true
});

class InfoLinksPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.readYourBillLink = page.getByRole('link', { name: 'How to read your bill' });
    this.findUsageLink = page.getByRole('link', { name: 'How to find Usage' });
  }
}

async function absoluteUrlFromHref(page, href) {
  try {
    if (!href) return null;
    return new URL(href, page.url()).toString();
  } catch {
    return null;
  }
}

async function isPdfByContentType(request, url) {
  if (!url) return false;
  try {
    const headResp = await request.fetch(url, { method: 'HEAD', timeout: 15000 });
    if (headResp && headResp.ok()) {
      const headers = headResp.headers();
      const ct = headers['content-type'] || headers['Content-Type'] || '';
      if (ct.toLowerCase().includes('application/pdf')) return true;
    }
  } catch {
    // ignore and fallback to GET
  }

  try {
    const getResp = await request.get(url, { timeout: 20000 });
    if (getResp && getResp.ok()) {
      const headers = getResp.headers();
      const ct = headers['content-type'] || headers['Content-Type'] || '';
      if (ct.toLowerCase().includes('application/pdf')) return true;
    }
  } catch {
    // ignore
  }
  return false;
}

/**
 * Verifies that clicking a link opens a PDF either via popup, download, or same-tab navigation.
 * Returns an object describing the outcome for assertions and debugging.
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {import('@playwright/test').Locator} link
 */
async function verifyPdfLinkOpens(page, request, link) {
  await expect(link).toBeVisible();

  const href = await link.getAttribute('href');
  const expectedUrl = await absoluteUrlFromHref(page, href);

  const popupPromise = page.waitForEvent('popup', { timeout: 15000 }).then(p => ({ type: 'popup', popup: p })).catch(() => null);
  const downloadPromise = page.waitForEvent('download', { timeout: 15000 }).then(d => ({ type: 'download', download: d })).catch(() => null);
  const navPromise = page.waitForNavigation({ timeout: 15000 }).then(() => ({ type: 'navigation' })).catch(() => null);

  await link.click({ button: 'left' });

  // Prefer earliest completed outcome without throwing on timeouts.
  const outcome = await Promise.race([
    popupPromise.then(v => v ?? new Promise(() => {})),
    downloadPromise.then(v => v ?? new Promise(() => {})),
    navPromise.then(v => v ?? new Promise(() => {}))
  ]);

  if (!outcome) {
    // As a last resort, small wait to allow any immediate changes, then check current page URL if it turned into a PDF viewer
    await page.waitForTimeout(500);
    const currentUrl = page.url();
    const urlLooksPdf = (currentUrl || '').toLowerCase().includes('.pdf');
    const contentIsPdf = await isPdfByContentType(request, currentUrl);
    return {
      success: urlLooksPdf || contentIsPdf,
      method: 'undetermined',
      url: currentUrl,
      expectedUrl
    };
  }

  if (outcome.type === 'download') {
    const download = outcome.download;
    const suggested = download.suggestedFilename();
    const filenameLooksPdf = (suggested || '').toLowerCase().endsWith('.pdf');
    let expectedLooksPdf = false;
    let expectedContentPdf = false;
    if (expectedUrl) {
      expectedLooksPdf = expectedUrl.toLowerCase().includes('.pdf');
      expectedContentPdf = await isPdfByContentType(request, expectedUrl);
    }
    return {
      success: filenameLooksPdf || expectedLooksPdf || expectedContentPdf,
      method: 'download',
      filename: suggested,
      expectedUrl
    };
  }

  if (outcome.type === 'popup') {
    const popup = outcome.popup;
    try {
      await popup.waitForLoadState('domcontentloaded', { timeout: 15000 });
    } catch { /* ignore */ }
    const popupUrl = popup.url();
    const urlLooksPdf = (popupUrl || '').toLowerCase().includes('.pdf');
    const contentIsPdf = await isPdfByContentType(request, popupUrl);
    // Close popup to keep test state clean
    try { await popup.close({ runBeforeUnload: true }); } catch { /* ignore */ }
    return {
      success: urlLooksPdf || contentIsPdf,
      method: 'popup',
      url: popupUrl,
      expectedUrl
    };
  }

  if (outcome.type === 'navigation') {
    const currentUrl = page.url();
    const urlLooksPdf = (currentUrl || '').toLowerCase().includes('.pdf');
    const contentIsPdf = await isPdfByContentType(request, currentUrl);
    return {
      success: urlLooksPdf || contentIsPdf,
      method: 'navigation',
      url: currentUrl,
      expectedUrl
    };
  }

  return { success: false, method: 'unknown', expectedUrl };
}

test.describe('MTX-4506 - Validate External PDF Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Validate External PDF Links', async ({ page, request }) => {
    const infoPage = new InfoLinksPage(page);

    // Step 1: Click on 'How to read your bill' and verify PDF behavior
    const firstResult = await verifyPdfLinkOpens(page, request, infoPage.readYourBillLink);
    expect(firstResult.success, `Expected 'How to read your bill' to open/download a PDF. Method: ${firstResult.method}, URL: ${firstResult.url || 'N/A'}, Expected URL: ${firstResult.expectedUrl || 'N/A'}, Filename: ${firstResult.filename || 'N/A'}`).toBeTruthy();

    // If same-tab navigation occurred, return to the original page for the next step
    if (firstResult.method === 'navigation') {
      await page.goBack();
      await expect(infoPage.findUsageLink).toBeVisible();
    }

    // Step 2: Click on 'How to find Usage' and verify PDF behavior
    const secondResult = await verifyPdfLinkOpens(page, request, infoPage.findUsageLink);
    expect(secondResult.success, `Expected 'How to find Usage' to open/download a PDF. Method: ${secondResult.method}, URL: ${secondResult.url || 'N/A'}, Expected URL: ${secondResult.expectedUrl || 'N/A'}, Filename: ${secondResult.filename || 'N/A'}`).toBeTruthy();
  });
});