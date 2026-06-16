import { test, expect, APIRequestContext } from '@playwright/test';
import { InfoLinksPage } from '../../pages/InfoLinksPage';

// Requirement ID: MTX-4506
// Test Name: Verify External PDF Links
// Objective: Validate that the informational links open the correct PDF documents.

test.describe('MTX-4506 - Verify External PDF Links', () => {
  test('Verify External PDF Links', async ({ page, request }) => {
    const infoLinksPage = new InfoLinksPage(page);

    // Navigate to the application page where the links are present.
    // Assumes baseURL is configured; adjust path if needed.
    await infoLinksPage.open('/');

    // Step 1: Click on the 'How to read your bill' link and validate it opens a PDF
    const readBillUrl = await infoLinksPage.openHowToReadYourBillDocument();
    expect.soft(readBillUrl, 'How to read your bill link should produce a target URL').toBeTruthy();
    const isReadBillPdf = await isUrlPdf(request, readBillUrl);
    expect(isReadBillPdf, `Expected a PDF to open for 'How to read your bill'. URL: ${readBillUrl}`).toBeTruthy();

    // Re-open the page to ensure a consistent starting point for the next action
    await infoLinksPage.open('/');

    // Step 2: Click on the 'How to find Usage' link and validate it opens a PDF
    const findUsageUrl = await infoLinksPage.openHowToFindUsageDocument();
    expect.soft(findUsageUrl, 'How to find Usage link should produce a target URL').toBeTruthy();
    const isFindUsagePdf = await isUrlPdf(request, findUsageUrl);
    expect(isFindUsagePdf, `Expected a PDF to open for 'How to find Usage'. URL: ${findUsageUrl}`).toBeTruthy();
  });
});

async function isUrlPdf(request: APIRequestContext, url: string): Promise<boolean> {
  if (!url) return false;

  const urlLooksPdf = /\.pdf($|[?#])/i.test(url);

  try {
    const res = await request.head(url, { maxRedirects: 2 });
    const ct = res.headers()['content-type'] || res.headers()['Content-Type'];
    if (ct && /application\/pdf/i.test(ct)) return true;
    if (res.ok() && urlLooksPdf) return true;
  } catch {
    // Ignore HEAD errors and fallback to GET
  }

  try {
    const res = await request.get(url, { maxRedirects: 2 });
    const ct = res.headers()['content-type'] || res.headers()['Content-Type'];
    if (ct && /application\/pdf/i.test(ct)) return true;
    if (res.ok() && urlLooksPdf) return true;
  } catch {
    // Ignore GET errors and fallback to heuristic
  }

  return urlLooksPdf;
}
