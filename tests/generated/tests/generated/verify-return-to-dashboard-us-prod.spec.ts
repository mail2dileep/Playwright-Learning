import { test, expect } from '@playwright/test';
import { ReturnToDashboardPage } from '../../pages/ReturnToDashboardPage';

// Environment configuration
const US_PROD_URL = process.env.US_PROD_URL;
const US_PROD_USER = process.env.US_PROD_USER;
const US_PROD_PASS = process.env.US_PROD_PASS;
const US_PROD_DASHBOARD_URL = process.env.US_PROD_DASHBOARD_URL; // Optional explicit expected dashboard URL

test.describe('MTX-4560 - Verify Return to Dashboard link redirection in US PROD environment', () => {
  test.skip(!(US_PROD_URL && US_PROD_USER && US_PROD_PASS), 'US_PROD_URL, US_PROD_USER, and US_PROD_PASS environment variables are required. Optionally set US_PROD_DASHBOARD_URL.');

  test('Verify Return to Dashboard link redirection in US PROD environment', async ({ page }) => {
    const app = new ReturnToDashboardPage(page);

    // Step 1: Navigate to US PROD
    await app.goto(US_PROD_URL!);
    await app.waitForInitialLoad();

    const onLogin = await app.isLoginVisible();
    const onAppShell = await app.isAppShellVisible();

    // Expected Result: Application home page or login page is displayed.
    expect(onLogin || onAppShell).toBeTruthy();

    // Step 2: Authenticate (if needed) and ensure Return to Dashboard link is visible
    await app.ensureAuthenticated(US_PROD_USER!, US_PROD_PASS!);
    await app.ensureReturnToDashboardLinkVisible();

    // Expected Result: Page with 'Return to Dashboard' link is loaded.
    await expect.soft(await app.isReturnToDashboardVisible()).toBeTruthy();

    // Step 3: Click the 'Return to Dashboard' link and validate navigation
    const nav = await app.clickReturnToDashboardAndWaitForNavigation();

    // Determine expected dashboard URL
    const fallbackDashboardUrl = `${US_PROD_URL!.replace(/\/+$/, '')}/dashboard`;
    const expectedDashboardUrl = (US_PROD_DASHBOARD_URL || fallbackDashboardUrl).toLowerCase();

    // Expected Result: User is redirected to the correct Dashboard URL without any 403 error.
    expect(nav.finalUrl.toLowerCase()).toContain(expectedDashboardUrl);
    expect(nav.statusCode).not.toBe(403);
  });
});
