import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  readonly page: Page;
  readonly url: string = 'https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/rate_estimator_residential.html';

  constructor(page: Page) {
    this.page = page;
  }

  // Locators (encapsulated)
  private get heading(): Locator {
    // Fuzzy match to accommodate possible heading variants
    return this.page.getByRole('heading', { name: /rate estimator|rate calculator/i }).first();
  }

  private get serviceTypeDropdown(): Locator {
    // Prefer accessible label
    return this.page.getByLabel(/service type/i).first();
  }

  private get primaryActionButton(): Locator {
    // Common primary actions for calculators
    return this.page.getByRole('button', { name: /calculate|estimate|get rates|submit/i }).first();
  }

  private get secondaryActionButton(): Locator {
    // Common secondary actions
    return this.page.getByRole('button', { name: /reset|clear|start over/i }).first();
  }

  private getCalculatorForm(): Locator {
    // Scope input discovery to nearest form around the primary action button, if available
    return this.primaryActionButton.locator('xpath=ancestor::form[1]');
  }

  private getInputFieldsWithin(scope: Locator): Locator {
    // Typical input types used in calculators, excluding selects (dropdowns)
    return scope.locator('input[type="text"], input[type="number"], input:not([type]), textarea');
  }

  // Actions
  async navigateTo(url: string = this.url): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async waitForReady(timeout: number = 15000): Promise<void> {
    // Wait for any strong signal of the calculator presence
    const signals: Locator[] = [this.heading, this.serviceTypeDropdown, this.primaryActionButton];
    const start = Date.now();
    for (const signal of signals) {
      try {
        await signal.waitFor({ state: 'visible', timeout: Math.max(1000, timeout - (Date.now() - start)) });
        return;
      } catch { /* try next signal */ }
    }
    // Fallback: wait for at least any button to ensure page is interactive
    await this.page.getByRole('button').first().waitFor({ state: 'visible', timeout: Math.max(1000, timeout - (Date.now() - start)) });
  }

  // State queries (no assertions inside page object)
  async isCalculatorSectionVisible(): Promise<boolean> {
    try { return await this.heading.isVisible(); } catch { return false; }
  }

  async isServiceTypeDropdownVisible(): Promise<boolean> {
    try { return await this.serviceTypeDropdown.isVisible(); } catch { return false; }
  }

  async isPrimaryActionButtonVisible(): Promise<boolean> {
    try { return await this.primaryActionButton.isVisible(); } catch { return false; }
  }

  async isSecondaryActionButtonVisible(): Promise<boolean> {
    try { return await this.secondaryActionButton.isVisible(); } catch { return false; }
  }

  async getVisibleInputFieldCount(): Promise<number> {
    let scope: Locator = this.page;
    try {
      if (await this.getCalculatorForm().count() > 0) {
        scope = this.getCalculatorForm();
      }
    } catch { /* keep page as scope */ }

    const inputs = this.getInputFieldsWithin(scope);
    const total = await inputs.count();
    let visible = 0;
    for (let i = 0; i < total; i++) {
      try {
        if (await inputs.nth(i).isVisible()) visible++;
      } catch { /* ignore */ }
    }
    return visible;
  }
}
