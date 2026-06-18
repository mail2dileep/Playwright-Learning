import { test, expect } from '@playwright/test';
import { AnalyticsDataLayerPage } from '../../pages/AnalyticsDataLayerPage';

// Requirement ID: MTX-4559
// Test Name: Verify Analytics Data Layer Validation

test.describe('MTX-4559 - Verify Analytics Data Layer Validation', () => {
  test('Verify Analytics Data Layer Validation', async ({ page }) => {
    const analyticsPage = new AnalyticsDataLayerPage(page);

    // Test data and configuration
    const targetUrl = process.env.TARGET_PAGE_URL ?? 'https://example.com/';
    const dataLayerObjectName = process.env.DATA_LAYER_OBJECT_NAME ?? 'digitalData';

    // Expected values from SDR (if provided via environment). If not provided, the test asserts only presence and non-empty values.
    const expectedFromSDR: Partial<Record<string, string>> = {};
    if (process.env.EXPECTED_PAGE_NAME) expectedFromSDR.pageName = process.env.EXPECTED_PAGE_NAME;
    if (process.env.EXPECTED_SITE_SECTION) expectedFromSDR.siteSection = process.env.EXPECTED_SITE_SECTION;

    const mandatoryFields = ['pageName', 'siteSection'];

    await test.step('Step 1 - Open the browser console on a migrated page (navigate to target page)', async () => {
      await analyticsPage.navigateTo(targetUrl);
      // Note: DevTools console UI cannot be automated; we validate via page evaluation instead.
    });

    await test.step(`Step 2 - Evaluate '${dataLayerObjectName}' in the page context`, async () => {
      await analyticsPage.waitForDataLayer(dataLayerObjectName, 15000);
      const dataLayer = await analyticsPage.getDataLayer<Record<string, any>>(dataLayerObjectName);

      expect.soft(dataLayer, `${dataLayerObjectName} should be defined`).toBeTruthy();
      expect.soft(typeof dataLayer).toBe('object');
      if (dataLayer && typeof dataLayer === 'object') {
        expect.soft(Object.keys(dataLayer).length).toBeGreaterThan(0);
      }
    });

    await test.step('Step 3 - Verify mandatory fields are present and match SDR specifications', async () => {
      const fields = await analyticsPage.getMandatoryFields(dataLayerObjectName, mandatoryFields);

      for (const field of mandatoryFields) {
        expect.soft(fields[field], `Mandatory field '${field}' should be present`).toBeDefined();
        const value = fields[field];
        if (typeof value === 'string') {
          expect.soft(value.trim().length, `Mandatory field '${field}' should be non-empty`).toBeGreaterThan(0);
        } else {
          // For non-string values, ensure they are truthy
          expect.soft(Boolean(value), `Mandatory field '${field}' should be truthy`).toBe(true);
        }
      }

      // Validate against SDR-provided expected values if supplied via environment
      for (const [key, expectedValue] of Object.entries(expectedFromSDR)) {
        expect.soft(String(fields[key]), `Field '${key}' should match SDR value`).toBe(String(expectedValue));
      }
    });
  });
});
