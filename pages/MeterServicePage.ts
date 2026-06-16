import { Page, Locator } from '@playwright/test';

export class MeterServicePage {
  readonly page: Page;
  private readonly electricInput: Locator;
  private readonly gasInput: Locator;
  private readonly serviceSelect: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.electricInput = page.locator('[data-test="electric-read"]');
    this.gasInput = page.locator('[data-test="gas-read"]');
    this.serviceSelect = page.locator('[data-test="service-select"]');
    this.resetButton = page.locator('[data-test="reset-btn"]');
  }

  async open(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async waitForReady(): Promise<void> {
    await Promise.all([
      this.electricInput.waitFor({ state: 'visible' }),
      this.gasInput.waitFor({ state: 'visible' }),
      this.serviceSelect.waitFor({ state: 'visible' }),
      this.resetButton.waitFor({ state: 'visible' }),
    ]);
  }

  async enterElectricRead(value: number | string): Promise<void> {
    await this.electricInput.fill(String(value));
  }

  async enterGasRead(value: number | string): Promise<void> {
    await this.gasInput.fill(String(value));
  }

  async selectServiceTypeByLabel(label: string): Promise<void> {
    await this.serviceSelect.selectOption({ label });
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  async getElectricReadValue(): Promise<string> {
    return await this.electricInput.inputValue();
  }

  async getGasReadValue(): Promise<string> {
    return await this.gasInput.inputValue();
  }

  async getSelectedServiceTypeLabel(): Promise<string> {
    const selected = this.serviceSelect.locator('option:checked');
    const text = await selected.textContent();
    return (text || '').trim();
  }
}
