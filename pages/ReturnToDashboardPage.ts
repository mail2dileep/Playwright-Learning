import { Locator, Page } from '@playwright/test';

export class ReturnToDashboardPage {
  private readonly page: Page;

  // Core app shell / generic elements
  private readonly appShell: Locator;

  // Auth elements
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;

  // Feature under test
  private readonly returnToDashboardLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // App shell: attempt to detect a common app container/navbar/header that signifies authenticated state
    this.appShell = this.page.locator('header, nav[role="navigation"], [data-test="app-shell"], [data-testid="app-shell"]');

    // Authentication selectors (robust multi-selector strategy)
    this.usernameInput = this.page.locator('[data-test="username"], [data-testid="username"], input[name="username"], input#username, input[autocomplete="username"]').first();
    this.passwordInput = this.page.locator('[data-test="password"], [data-testid="password"], input[name="password"], input#password, input[autocomplete="current-password"]').first();
    this.signInButton = this.page.locator(
      [
        'button:has-text("Sign in")',
        'button:has-text("Sign In")',
        'button:has-text("Log in")',
        'button:has-text("Log In")',
        '[data-test="sign-in"]',
        '[data-testid="sign-in"]',
        'button[type="submit"]'
      ].join(', ')
    ).first();

    // Target link under test
    this.returnToDashboardLink = this.page.getByRole('link', { name: /return to dashboard/i });
  }

  // Navigation
  async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async waitForInitialLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  // State checks
  async isLoginVisible(): Promise<boolean> {
    try {
      return await this.usernameInput.isVisible();
    } catch {
      return false;
    }
  }

  async isAppShellVisible(): Promise<boolean> {
    try {
      return await this.appShell.isVisible();
    } catch {
      return false;
    }
  }

  async isReturnToDashboardVisible(): Promise<boolean> {
    try {
      return await this.returnToDashboardLink.isVisible();
    } catch {
      return false;
    }
  }

  // Auth flow
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'load' }).catch(() => null),
      this.signInButton.click()
    ]);
    // Stabilize after login
    await this.page.waitForLoadState('networkidle').catch(() => null);
  }

  async ensureAuthenticated(username: string, password: string): Promise<void> {
    if (await this.isLoginVisible()) {
      await this.login(username, password);
    } else {
      // Already authenticated or SSO redirect handled externally
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  // Feature navigation
  async ensureReturnToDashboardLinkVisible(timeout: number = 30000): Promise<void> {
    await this.returnToDashboardLink.waitFor({ state: 'visible', timeout });
  }

  async clickReturnToDashboardAndWaitForNavigation(timeout: number = 30000): Promise<{ finalUrl: string; statusCode: number | null; }> {
    const [response] = await Promise.all([
      this.page.waitForNavigation({ timeout }).catch(() => null),
      this.returnToDashboardLink.click()
    ]);
    const statusCode = response ? response.status() : null;
    const finalUrl = this.page.url();
    return { finalUrl, statusCode };
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}

export default ReturnToDashboardPage;
