import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  readonly page: Page;
  private readonly serviceSelect: Locator;
  private readonly electricInput: Locator;
  private readonly gasInput: Locator;
  private readonly resetButton: Locator;

  readonly DEFAULT_SERVICE_OPTION_VALUE = '';

  constructor(page: Page) {
    this.page = page;
    this.serviceSelect = page.locator('[data-testid="service-select"]');
    this.electricInput = page.locator('[data-testid="electric-input"]');
    this.gasInput = page.locator('[data-testid="gas-input"]');
    this.resetButton = page.locator('[data-testid="reset-btn"]');
  }

  async goto(path: string = '/rate-calculator'): Promise<void> {
    await this.page.goto(path);
  }

  async selectServiceByLabel(label: string): Promise<void> {
    await this.serviceSelect.selectOption({ label });
  }

  async selectServiceByValue(value: string): Promise<void> {
    await this.serviceSelect.selectOption({ value });
  }

  async enterElectricUsage(units: string | number): Promise<void> {
    await this.electricInput.fill(String(units));
  }

  async enterGasUsage(units: string | number): Promise<void> {
    await this.gasInput.fill(String(units));
  }

  async resetForm(): Promise<void> {
    await this.resetButton.click();
  }

  async getElectricUsageValue(): Promise<string> {
    return await this.electricInput.inputValue();
  }

  async getGasUsageValue(): Promise<string> {
    return await this.gasInput.inputValue();
  }

  async getSelectedServiceValue(): Promise<string> {
    return await this.serviceSelect.inputValue();
  }

  async getSelectedServiceLabel(): Promise<string> {
    return await this.serviceSelect.evaluate((el) => (el as HTMLSelectElement).selectedOptions[0]?.label ?? '');
  }

  async isServiceAtDefault(): Promise<boolean> {
    const value = await this.getSelectedServiceValue();
    return value === this.DEFAULT_SERVICE_OPTION_VALUE;
  }

  async isFormCleared(): Promise<boolean> {
    const [elec, gas, isDefault] = await Promise.all([
      this.getElectricUsageValue(),
      this.getGasUsageValue(),
      this.isServiceAtDefault(),
    ]);
    return elec === '' && gas === '' && isDefault;
  }
}
