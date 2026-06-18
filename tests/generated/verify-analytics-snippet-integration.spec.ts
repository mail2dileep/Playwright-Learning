import { test, expect } from '@playwright/test';
import { AemMigratedPage } from '../../pages/AemMigratedPage';

// Test Data Inputs (can be overridden via environment variables)
const MIGRATED_PAGE_URL = process.env.MIGRATED_PAGE_URL || 'https://www.example.com/aem-migrated-page.html';
const ANALYTICS_SEARCH_TERM = process.env.ANALYTICS_SEARCH_TERM || 'DTM';

/**
 * Requirement ID: MTX-4559
 * Test Name: Verify Analytics Snippet Integration
 * Objective: Ensure the Analytics snippet (DTM script) is correctly added to the <head> section of all migrated web pages in AEM.
 * Priority: High
 */

test.describe('MTX-4559 - Verify Analytics Snippet Integration', () => {
  test('Verify Analytics Snippet Integration', async ({ page }) => {
    const migratedPage = new AemMigratedPage(page);

    await test.step('Step 1 - Navigate to a migrated web page in the AEM environment', async () => {
      await migratedPage.openMigratedPage(MIGRATED_PAGE_URL);
      await expect.poll(async () => await migratedPage.isPageLoaded(), { timeout: 15000 }).toBeTruthy();
    });

    await test.step('Step 2 - View the page source code (simulate Ctrl+U via original HTML fetch)', async () => {
      const source = await migratedPage.getOriginalPageSource();
      expect(source.length).toBeGreaterThan(0);
      expect(source.toLowerCase()).toContain('<html');
    });

    await test.step("Step 3 - Search for the DTM script/Analytics snippet within the <head> tag", async () => {
      const headMarkup = await migratedPage.getHeadMarkupFromOriginalSource();
      expect(headMarkup.length).toBeGreaterThan(0);
      expect(headMarkup.toLowerCase()).toContain(ANALYTICS_SEARCH_TERM.toLowerCase());
    });
  });
});
