import { Page, Locator } from '@playwright/test';

export class CADemoLicensesPage {
  private readonly page: Page;

  // Generic primary content container and heading for screen change detection
  private readonly primaryContainer: Locator;
  private readonly h1Heading: Locator;
  private readonly allButtons: Locator;
  private readonly allLinks: Locator;

  // Console error tracking
  private consoleErrors: string[] = [];

  // Navigation state tracking
  private readonly visitedStates: { url: string; title: string | null }[] = [];

  // Candidate CTA labels to drive the primary flow
  private readonly CTA_LABELS: string[] = [
    'Get started',
    'Start',
    'Begin',
    'Continue',
    'Next',
    'Proceed',
    'Submit',
    'Finish',
    'Done'
  ];

  constructor(page: Page) {
    this.page = page;
    this.primaryContainer = this.page.locator('main, [role="main"], body');
    this.h1Heading = this.page.locator('h1, [role="heading"][aria-level="1"]');
    this.allButtons = this.page.getByRole('button');
    this.allLinks = this.page.getByRole('link');
  }

  // Public API

  async open(url: string): Promise<void> {
    this.bindConsoleErrorListener();
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    // Best-effort network idle; prototypes may use streaming/embeds
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch {
      // ignore - some prototypes never reach networkidle
    }
    await this.recordCurrentState();
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.primaryContainer.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  getConsoleErrors(): string[] {
    return [...this.consoleErrors];
  }

  async getCurrentScreenTitle(): Promise<string | null> {
    const count = await this.h1Heading.count();
    if (count > 0) {
      const text = (await this.h1Heading.first().innerText()).trim();
      return text.length > 0 ? text : null;
    }
    return null;
  }

  async getVisiblePrimaryCtas(): Promise<string[]> {
    const visible: string[] = [];
    for (const label of this.CTA_LABELS) {
      const anyVisible = await this.isAnyCtaWithLabelVisible(label);
      if (anyVisible) visible.push(label);
    }
    return visible;
  }

  async navigatePrimaryFlow(maxSteps = 5): Promise<{ stepsTaken: number; transitions: number; attemptedLabels: string[] }> {
    let stepsTaken = 0;
    let transitions = 0;
    const attemptedLabels: string[] = [];

    for (let i = 0; i < maxSteps; i++) {
      const before = await this.getCurrentState();
      const { clicked, label } = await this.clickPrimaryCtaIfVisible();
      if (!clicked) break;

      if (label) attemptedLabels.push(label);
      stepsTaken++;

      const changed = await this.waitForScreenChange(before, 8000);
      await this.recordCurrentState();
      if (changed) transitions++;
    }

    return { stepsTaken, transitions, attemptedLabels };
  }

  async getVisitedUrls(): Promise<string[]> {
    return this.visitedStates.map(s => s.url);
  }

  async getVisitedTitles(): Promise<(string | null)[]> {
    return this.visitedStates.map(s => s.title);
  }

  async getCurrentState(): Promise<{ url: string; title: string | null }> {
    return {
      url: this.page.url(),
      title: await this.getCurrentScreenTitle()
    };
  }

  // Internal helpers

  private bindConsoleErrorListener(): void {
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.consoleErrors.push(msg.text());
      }
    });
  }

  private async recordCurrentState(): Promise<void> {
    const state = await this.getCurrentState();
    const last = this.visitedStates[this.visitedStates.length - 1];
    if (!last || last.url !== state.url || last.title !== state.title) {
      this.visitedStates.push(state);
    }
  }

  private escapeForRegex(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private buttonByLabel(label: string): Locator {
    const pattern = new RegExp(`^${this.escapeForRegex(label)}$`, 'i');
    return this.page.getByRole('button', { name: pattern });
  }

  private linkByLabel(label: string): Locator {
    const pattern = new RegExp(`^${this.escapeForRegex(label)}$`, 'i');
    return this.page.getByRole('link', { name: pattern });
  }

  private async isButtonVisibleAndEnabled(button: Locator): Promise<boolean> {
    return (await button.isVisible()) && (await button.isEnabled());
  }

  private async isAnyCtaWithLabelVisible(label: string): Promise<boolean> {
    const button = this.buttonByLabel(label);
    if (await button.isVisible()) return true;
    const link = this.linkByLabel(label);
    if (await link.isVisible()) return true;
    return false;
  }

  private async clickPrimaryCtaIfVisible(): Promise<{ clicked: boolean; label?: string }> {
    for (const label of this.CTA_LABELS) {
      const button = this.buttonByLabel(label);
      if (await this.isButtonVisibleAndEnabled(button)) {
        await button.click();
        return { clicked: true, label };
      }
      const link = this.linkByLabel(label);
      if (await link.isVisible()) {
        await link.click();
        return { clicked: true, label };
      }
    }

    // Fallback: click the first visible, enabled button if no known label matched
    const count = await this.allButtons.count();
    for (let i = 0; i < count; i++) {
      const candidate = this.allButtons.nth(i);
      if (await this.isButtonVisibleAndEnabled(candidate)) {
        await candidate.click();
        return { clicked: true, label: (await candidate.innerText()).trim() || 'button' };
      }
    }

    return { clicked: false };
  }

  private async waitForScreenChange(before: { url: string; title: string | null }, timeout = 5000): Promise<boolean> {
    try {
      const changed = await this.page.waitForFunction(
        (prev) => {
          const currentUrl = window.location.href;
          const h1 = document.querySelector('h1, [role="heading"][aria-level="1"]');
          const title = (h1 && (h1.textContent || '').trim()) || null;
          return currentUrl !== prev.url || title !== prev.title;
        },
        before,
        { timeout }
      );
      return Boolean(changed);
    } catch {
      return false;
    }
  }
}
