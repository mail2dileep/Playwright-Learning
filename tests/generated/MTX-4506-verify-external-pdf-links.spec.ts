import { test, expect } from '@playwright/test';

class ExternalDocsPage {
  constructor(page) {
    this.page = page;
    this.readBillLink = page.getByRole('link', { name: /how to read your bill/i });
    this.findUsageLink = page.getByRole('link', { name: /how to find usage/i });
  }

  async goto(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async clickLinkAndCapture(link) {
    const href = await link.getAttribute('href');
    expect(href, 'Link should have an href attribute').toBeTruthy();

    // Setup listeners before clicking
    const popupPromise = this.page.waitForEvent('popup', { timeout: 10000 }).catch(() => null);
    const downloadPromise = this.page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
    const navPromise = this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => null);

    await link.click({ force: true });

    const [popup, download, navigation] = await Promise.all([popupPromise, downloadPromise, navPromise]);

    let mode = 'none';
    let finalUrl = null;

    if (popup) {
      try {
        await popup.waitForLoadState('domcontentloaded', { timeout: 10000 });
      } catch {
        // ignore load wait errors for PDF viewer
      }
      mode = 'popup';
      finalUrl = popup.url();
    } else if (download) {
      mode = 'download';
      finalUrl = typeof download.url === 'function' ? download.url() : null;
    } else if (navigation) {
      mode = 'navigation';
      finalUrl = this.page.url();
    }

    return { href, mode, finalUrl, popup, download };
  }
}

async function ensurePdfReachableAndType(request, absoluteUrl) {
  // Try HEAD first, then fallback to GET if needed
  let resp = null;
  try {
    resp = await request.fetch(absoluteUrl, { method: 'HEAD', timeout: 15000 });
  } catch {
    resp = null;
  }
  if (!resp || !resp.ok()) {
    try {
      resp = await request.get(absoluteUrl, { timeout: 20000 });
    } catch {
      resp = null;
    }
  }

  if (!resp) {
    return { ok: false, status: 0, contentType: '' };
  }

  const status = resp.status();
  const headers = resp.headers();
  const contentType = headers['content-type'] || headers['Content-Type'] || '';
  return { ok: status >= 200 && status < 400, status, contentType };
}

function absoluteUrlFrom(page, href) {
  try {
    return new URL(href, page.url()).toString();
  } catch {
    return href;
  }
}

const READ_BILL_REGEX = process.env.EXPECT_READ_BILL_REGEX
  ? new RegExp(process.env.EXPECT_READ_BILL_REGEX, 'i')
  : /read.*bill.*\.pdf(?:$|\?)/i;

const FIND_USAGE_REGEX = process.env.EXPECT_FIND_USAGE_REGEX
  ? new RegExp(process.env.EXPECT_FIND_USAGE_REGEX, 'i')
  : /find.*usage.*\.pdf(?:$|\?)/i;

test.describe('MTX-4506 - Verify External PDF Links', () => {
  test('Verify External PDF Links', async ({ page, request }) => {
    const targetUrl = process.env.TARGET_URL;
    if (!targetUrl) {
      test.skip(true, 'TARGET_URL environment variable is not set. Provide the page URL containing the links.');
    }

    const docsPage = new ExternalDocsPage(page);
    await docsPage.goto(targetUrl);

    // Step 1: Click on the 'How to read your bill' link
    const step1 = await docsPage.clickLinkAndCapture(docsPage.readBillLink);

    // Assert an action occurred (popup, download, or navigation)
    expect(step1.mode, "Click should result in a popup, download, or navigation").toMatch(/popup|download|navigation/);

    // Determine the candidate URL to validate
    const step1AbsoluteHref = absoluteUrlFrom(page, step1.href);
    const step1CandidateUrl = step1.finalUrl || step1AbsoluteHref;

    // Assert URL pattern for the correct PDF
    expect(step1CandidateUrl, "The 'How to read your bill' link should lead to a PDF URL containing 'read' and 'bill'").toMatch(READ_BILL_REGEX);

    // If download occurred, validate suggested file name
    if (step1.mode === 'download' && step1.download) {
      const suggested = step1.download.suggestedFilename();
      expect(suggested.toLowerCase(), 'Downloaded file should have .pdf extension').toMatch(/\.pdf$/);
    }

    // Soft-check content type is a PDF
    const reach1 = await ensurePdfReachableAndType(request, step1AbsoluteHref);
    expect.soft(reach1.ok, 'PDF URL should be reachable').toBeTruthy();
    expect.soft(/pdf/i.test(reach1.contentType || ''), `Content-Type should be application/pdf but was "${reach1.contentType}"`).toBeTruthy();

    // Clean up potential popup
    if (step1.mode === 'popup' && step1.popup) {
      await step1.popup.close().catch(() => {});
    }

    // Navigate back to the page for the next step if needed
    if (page.url() !== targetUrl) {
      await docsPage.goto(targetUrl);
    }

    // Step 2: Click on the 'How to find Usage' link
    const step2 = await docsPage.clickLinkAndCapture(docsPage.findUsageLink);

    // Assert an action occurred (popup, download, or navigation)
    expect(step2.mode, "Click should result in a popup, download, or navigation").toMatch(/popup|download|navigation/);

    // Determine the candidate URL to validate
    const step2AbsoluteHref = absoluteUrlFrom(page, step2.href);
    const step2CandidateUrl = step2.finalUrl || step2AbsoluteHref;

    // Assert URL pattern for the correct PDF
    expect(step2CandidateUrl, "The 'How to find Usage' link should lead to a PDF URL containing 'find' and 'usage'").toMatch(FIND_USAGE_REGEX);

    // If download occurred, validate suggested file name
    if (step2.mode === 'download' && step2.download) {
      const suggested = step2.download.suggestedFilename();
      expect(suggested.toLowerCase(), 'Downloaded file should have .pdf extension').toMatch(/\.pdf$/);
    }

    // Soft-check content type is a PDF
    const reach2 = await ensurePdfReachableAndType(request, step2AbsoluteHref);
    expect.soft(reach2.ok, 'PDF URL should be reachable').toBeTruthy();
    expect.soft(/pdf/i.test(reach2.contentType || ''), `Content-Type should be application/pdf but was "${reach2.contentType}"`).toBeTruthy();

    // Clean up potential popup
    if (step2.mode === 'popup' && step2.popup) {
      await step2.popup.close().catch(() => {});
    }
  });
});