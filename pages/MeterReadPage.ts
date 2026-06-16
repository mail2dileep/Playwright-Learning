import { Page, Locator } from '@playwright/test';

export class MeterReadPage {
  private readonly page: Page;
  private readonly electricInput: Locator;
  private readonly gasInput: Locator;
  private readonly calculateButton: Locator;
  private readonly electricError: Locator;
  private readonly gasError: Locator;

  constructor(page: Page) {
    this.page = page;

    // Core inputs
    this.electricInput = page.getByLabel('Electric Meter Read', { exact: false });
    this.gasInput = page.getByLabel('Gas Meter Read', { exact: false });

    // Primary action
    this.calculateButton = page.getByRole('button', { name: /calculate|submit|continue/i });

    // Validation message fallbacks (supporting multiple enterprise selector strategies)
    this.electricError = page.locator(
      [
        '#electric-error',
        '[data-testid="electric-error"]',
        '[data-qa="electric-error"]',
        '.electric-error',
        '[role="alert"][data-field="electric"]',
        '[aria-live="polite"][data-field="electric"]',
        '[data-field="electric"] .error-message',
      ].join(', ')
    ).first();

    this.gasError = page.locator(
      [
        '#gas-error',
        '[data-testid="gas-error"]',
        '[data-qa="gas-error"]',
        '.gas-error',
        '[role="alert"][data-field="gas"]',
        '[aria-live="polite"][data-field="gas"]',
        '[data-field="gas"] .error-message',
      ].join(', ')
    ).first();
  }

  async goto(): Promise<void> {
    // Uses Playwright baseURL if configured
    await this.page.goto('/meter-read');
  }

  async enterElectricMeterRead(value: string | number): Promise<void> {
    await this.electricInput.click({ force: true });
    await this.electricInput.fill('');
    await this.electricInput.type(String(value));
  }

  async enterGasMeterRead(value: string | number): Promise<void> {
    await this.gasInput.click({ force: true });
    await this.gasInput.fill('');
    await this.gasInput.type(String(value));
  }

  async blurElectricField(): Promise<void> {
    // Move focus away to trigger potential validation
    await this.electricInput.press('Tab');
  }

  async blurGasField(): Promise<void> {
    await this.gasInput.press('Tab');
  }

  async getElectricMeterReadValue(): Promise<string> {
    return await this.electricInput.inputValue();
  }

  async getGasMeterReadValue(): Promise<string> {
    return await this.gasInput.inputValue();
  }

  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  async isCalculateDisabled(): Promise<boolean> {
    const count = await this.calculateButton.count();
    if (count === 0) return false; // If no calculate button exists, treat as not disabled

    const nativeDisabled = await this.calculateButton.isDisabled();
    const ariaDisabled = (await this.calculateButton.getAttribute('aria-disabled')) === 'true';
    return nativeDisabled || ariaDisabled;
  }

  async getElectricErrorMessage(): Promise<string | null> {
    if (await this.electricError.isVisible()) {
      const text = await this.electricError.innerText();
      return text?.trim() || '';
    }
    return null;
  }

  async getGasErrorMessage(): Promise<string | null> {
    if (await this.gasError.isVisible()) {
      const text = await this.gasError.innerText();
      return text?.trim() || '';
    }
    return null;
  }
}
