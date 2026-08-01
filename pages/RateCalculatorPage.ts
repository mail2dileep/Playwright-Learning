import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthSelect: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(private page: Page) {
    this.monthSelect = page.getByLabel('Month'); // id: gMonth1
    this.previousReadInput = page.getByLabel('Enter Previous Read:'); // id: eMeterRead
    this.currentReadInput = page.getByLabel('Enter Current Read:'); // id: eMeterNewRead
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):'); // id: consumption
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // id: gasconsumption (initially disabled)
    this.electricServiceRadio = page.locator('#e'); // radioGroup: servicetype, currentValue: E
    this.electricGasServiceRadio = page.locator('#eg'); // radioGroup: servicetype, currentValue: EG
    this.calculateButton = page.locator('#validateMoveInBtn'); // text: Calculate
    this.resetButton = page.locator('#rateCalCancelBtn'); // text: Reset
  }

  /**
   * Selects the specified service type using radio buttons.
   * @param type 'ElectricOnly' or 'ElectricAndGas'
   */
  async selectServiceType(type: 'ElectricOnly' | 'ElectricAndGas'): Promise<void> {
    if (type === 'ElectricOnly') {
      await this.electricServiceRadio.check();
    } else if (type === 'ElectricAndGas') {
      await this.electricGasServiceRadio.check();
    }
  }

  /**
   * Enters the previous meter read value into the corresponding input field.
   * @param value The numeric value to enter.
   */
  async enterPreviousElectricRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters the current meter read value into the corresponding input field.
   * @param value The numeric value to enter.
   */
  async enterCurrentElectricRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the value from the estimated electric use input field.
   * @returns The estimated electric usage as a string.
   */
  async getEstimatedElectricUsage(): Promise<string> {
    return this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the value from the estimated gas use input field.
   * @returns The estimated gas usage as a string.
   */
  async getEstimatedGasUsage(): Promise<string> {
    return this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the estimated electric use field is enabled.
   * @returns True if enabled, false otherwise.
   */
  async isEstimatedElectricUseFieldEnabled(): Promise<boolean> {
    return this.estimatedElectricUseInput.isEnabled();
  }

  /**
   * Checks if the estimated gas use field is enabled.
   * @returns True if enabled, false otherwise.
   */
  async isEstimatedGasUseFieldEnabled(): Promise<boolean> {
    return this.estimatedGasUseInput.isEnabled();
  }

  /**
   * Retrieves the value from the previous meter read input field.
   * @returns The previous read value as a string.
   */
  async getPreviousElectricReadValue(): Promise<string> {
    return this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the value from the current meter read input field.
   * @returns The current read value as a string.
   */
  async getCurrentElectricReadValue(): Promise<string> {
    return this.currentReadInput.inputValue();
  }
}