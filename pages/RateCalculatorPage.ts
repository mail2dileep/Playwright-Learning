import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
  private readonly monthSelect: Locator;
  private readonly previousMeterReadInput: Locator;
  private readonly currentMeterReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricOnlyRadio: Locator;
  private readonly electricAndGasRadio: Locator;
  private readonly calculateButton: Locator;

  constructor(private page: Page) {
    this.monthSelect = page.getByLabel("Month");
    this.previousMeterReadInput = page.getByLabel("Enter Previous Read:");
    this.currentMeterReadInput = page.getByLabel("Enter Current Read:");
    this.estimatedElectricUseInput = page.getByLabel("Estimated Electric use (kWh):");
    this.estimatedGasUseInput = page.getByLabel("Estimated Gas use (Ccf):");
    this.electricOnlyRadio = page.locator("#e");
    this.electricAndGasRadio = page.locator("#eg");
    this.calculateButton = page.locator("#validateMoveInBtn");
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectServiceTypeElectricAndGas(): Promise<void> {
    await this.electricAndGasRadio.click();
  }

  /**
   * Enters the estimated electric usage.
   * @param value The estimated electric usage in kWh.
   */
  async enterEstimatedElectricUsage(value: string): Promise<void> {
    await this.estimatedElectricUseInput.fill(value);
  }

  /**
   * Enters the estimated gas usage.
   * @param value The estimated gas usage in Ccf.
   */
  async enterEstimatedGasUsage(value: string): Promise<void> {
    await this.estimatedGasUseInput.fill(value);
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Checks if the estimated gas usage input field is enabled.
   * @returns A boolean indicating if the field is enabled.
   */
  async isEstimatedGasUsageEnabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isEnabled();
  }

  /**
   * Gets the current value from the estimated electric usage input field.
   * @returns The current value of the field.
   */
  async getEstimatedElectricUsageValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Gets the current value from the estimated gas usage input field.
   * @returns The current value of the field.
   */
  async getEstimatedGasUsageValue(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }
}
