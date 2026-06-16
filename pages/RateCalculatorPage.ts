import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly serviceTypeSelect: Locator;
  private readonly electricMeterInput: Locator;
  private readonly gasMeterInput: Locator;
  private readonly calculateButton: Locator;
  private readonly combinedPriceOutput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.serviceTypeSelect = this.page.getByTestId('service-type');
    this.electricMeterInput = this.page.getByTestId('electric-meter');
    this.gasMeterInput = this.page.getByTestId('gas-meter');
    this.calculateButton = this.page.getByTestId('calculate-btn');
    this.combinedPriceOutput = this.page.getByTestId('combined-price');
  }

  async goto(path: string = '/rate-calculator'): Promise<void> {
    await this.page.goto(path);
    await this.waitForReady();
  }

  async waitForReady(): Promise<void> {
    await this.serviceTypeSelect.waitFor({ state: 'visible' });
  }

  async selectServiceType(optionLabel: string): Promise<void> {
    await this.serviceTypeSelect.selectOption({ label: optionLabel });
  }

  async isElectricMeterEnabled(): Promise<boolean> {
    return await this.electricMeterInput.isEnabled();
  }

  async isGasMeterEnabled(): Promise<boolean> {
    return await this.gasMeterInput.isEnabled();
  }

  async fillElectricMeter(value: number | string): Promise<void> {
    await this.electricMeterInput.fill('');
    await this.electricMeterInput.fill(String(value));
  }

  async fillGasMeter(value: number | string): Promise<void> {
    await this.gasMeterInput.fill('');
    await this.gasMeterInput.fill(String(value));
  }

  async getElectricMeterValue(): Promise<string> {
    return await this.electricMeterInput.inputValue();
  }

  async getGasMeterValue(): Promise<string> {
    return await this.gasMeterInput.inputValue();
  }

  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  async isCombinedPriceVisible(): Promise<boolean> {
    return await this.combinedPriceOutput.isVisible();
  }

  async getCombinedPriceText(): Promise<string> {
    await this.combinedPriceOutput.waitFor({ state: 'visible' });
    const text = await this.combinedPriceOutput.textContent();
    return (text ?? '').trim();
  }
}
