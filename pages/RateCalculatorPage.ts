import { Page, Locator } from '@playwright/test';

export default class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly serviceTypeSelect: Locator;
  private readonly electricMeterInput: Locator;
  private readonly gasMeterInput: Locator;
  private readonly calculateButton: Locator;
  private readonly calculatedPrice: Locator;

  // URL path (assumes baseURL configured in playwright.config)
  private readonly urlPath: string = '/rate-calculator';

  constructor(page: Page) {
    this.page = page;

    // Encapsulated selectors
    this.serviceTypeSelect = this.page.locator('[data-testid="service-type"]');
    this.electricMeterInput = this.page.locator('[data-testid="electric-meter-input"]');
    this.gasMeterInput = this.page.locator('[data-testid="gas-meter-input"]');
    this.calculateButton = this.page.locator('[data-testid="calculate-button"]');
    this.calculatedPrice = this.page.locator('[data-testid="calculated-price"]');
  }

  async open(): Promise<void> {
    await this.page.goto(this.urlPath);
  }

  async selectServiceType(typeLabel: string): Promise<void> {
    // Assumes a native <select>. If it's a custom dropdown, replace with appropriate actions.
    await this.serviceTypeSelect.waitFor({ state: 'visible' });
    await this.serviceTypeSelect.selectOption({ label: typeLabel });
  }

  async waitUntilMeterFieldsReady(): Promise<void> {
    await Promise.all([
      this.electricMeterInput.waitFor({ state: 'visible' }),
      this.gasMeterInput.waitFor({ state: 'visible' })
    ]);
  }

  async areMeterFieldsEnabled(): Promise<boolean> {
    const [electricEnabled, gasEnabled] = await Promise.all([
      this.electricMeterInput.isEnabled(),
      this.gasMeterInput.isEnabled()
    ]);
    return electricEnabled && gasEnabled;
  }

  async enterElectricMeter(value: number): Promise<void> {
    await this.electricMeterInput.fill(String(value));
  }

  async enterGasMeter(value: number): Promise<void> {
    await this.gasMeterInput.fill(String(value));
  }

  async enterMeterReads(electric: number, gas: number): Promise<void> {
    await this.enterElectricMeter(electric);
    await this.enterGasMeter(gas);
  }

  async getElectricMeterValue(): Promise<string> {
    return this.electricMeterInput.inputValue();
  }

  async getGasMeterValue(): Promise<string> {
    return this.gasMeterInput.inputValue();
  }

  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  async waitForPriceToBeDisplayed(): Promise<void> {
    await this.calculatedPrice.waitFor({ state: 'visible' });
  }

  async isCalculatedPriceVisible(): Promise<boolean> {
    return this.calculatedPrice.isVisible();
  }

  async getCalculatedPriceText(): Promise<string> {
    const text = await this.calculatedPrice.textContent();
    return (text ?? '').trim();
  }
}
