import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousElectricReadInput: Locator;
  private readonly currentElectricReadInput: Locator;
  private readonly estimatedElectricUseKwhOutput: Locator;
  private readonly estimatedGasUseCcfOutput: Locator;
  private readonly electricOnlyRadio: Locator;
  private readonly electricGasRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(private page: Page) {
    this.monthDropdown = page.getByLabel('Month');
    this.previousElectricReadInput = page.getByLabel('Enter Previous Read:');
    this.currentElectricReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseKwhOutput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseCcfOutput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricOnlyRadio = page.locator('#e');
    this.electricGasRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects the 'Electric only' service type radio button.
   */
  async selectServiceTypeElectricOnly(): Promise<void> {
    await this.electricOnlyRadio.click();
  }

  /**
   * Enters a value into the 'Enter Previous Read:' electric meter field.
   * @param value The numeric value to enter.
   */
  async enterPreviousElectricRead(value: string): Promise<void> {
    await this.previousElectricReadInput.fill(value);
  }

  /**
   * Enters a value into the 'Enter Current Read:' electric meter field.
   * @param value The numeric value to enter.
   */
  async enterCurrentElectricRead(value: string): Promise<void> {
    await this.currentElectricReadInput.fill(value);
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Gets the current value of the 'Estimated Electric use (kWh):' output field.
   * Note: This field is typically an input with a calculated value.
   * @returns The string value of the estimated electric use.
   */
  async getEstimatedElectricUseKwhValue(): Promise<string> {
    return await this.estimatedElectricUseKwhOutput.inputValue();
  }

  /**
   * Returns the Locator for the 'Enter Previous Read:' field for assertions.
   */
  getPreviousElectricReadLocator(): Locator {
    return this.previousElectricReadInput;
  }

  /**
   * Returns the Locator for the 'Enter Current Read:' field for assertions.
   */
  getCurrentElectricReadLocator(): Locator {
    return this.currentElectricReadInput;
  }

  /**
   * Returns the Locator for the 'Estimated Gas use (Ccf):' output field for assertions.
   */
  getEstimatedGasUseCcfLocator(): Locator {
    return this.estimatedGasUseCcfOutput;
  }

  /**
   * Returns the Locator for the 'Estimated Electric use (kWh):' output field for assertions.
   */
  getEstimatedElectricUseKwhLocator(): Locator {
    return this.estimatedElectricUseKwhOutput;
  }
}