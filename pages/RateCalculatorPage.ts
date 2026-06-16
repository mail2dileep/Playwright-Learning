import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  readonly page: Page;
  private readonly serviceTypeSelect: Locator;
  private readonly electricMeterReadInput: Locator;
  private readonly gasMeterReadInput: Locator;
  private readonly calculateButton: Locator;
  private readonly calculatedPricePanel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.serviceTypeSelect = page.locator('[data-testid="service-type"]');
    this.electricMeterReadInput = page.locator('[data-testid="electric-meter-read"]');
    this.gasMeterReadInput = page.locator('[data-testid="gas-meter-read"]');
    this.calculateButton = page.locator('[data-testid="calculate-button"]');
    this.calculatedPricePanel = page.locator('[data-testid="calculated-price"]');
  }

  async waitForReady(): Promise<void> {
    await this.serviceTypeSelect.waitFor({ state: 'visible' });
    await this.calculateButton.waitFor({ state: 'attached' });
  }

  async selectServiceType(optionLabel: string): Promise<void> {
    await this.serviceTypeSelect.selectOption({ label: optionLabel });
  }

  async enterElectricMeterRead(value: number | string): Promise<void> {
    await this.electricMeterReadInput.fill(String(value));
  }

  async getElectricMeterReadValue(): Promise<string> {
    return await this.electricMeterReadInput.inputValue();
  }

  async isElectricMeterReadEnabled(): Promise<boolean> {
    return await this.electricMeterReadInput.isEnabled();
  }

  async isGasMeterReadEnabled(): Promise<boolean> {
    try {
      return await this.gasMeterReadInput.isEnabled();
    } catch {
      return false;
    }
  }

  async isGasMeterReadVisible(): Promise<boolean> {
    try {
      return await this.gasMeterReadInput.isVisible();
    } catch {
      return false;
    }
  }

  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  async isCalculatedPriceVisible(): Promise<boolean> {
    try {
      return await this.calculatedPricePanel.isVisible();
    } catch {
      return false;
    }
  }

  async getCalculatedPriceText(): Promise<string> {
    const text = await this.calculatedPricePanel.textContent();
    return (text ?? '').trim();
  }
}
