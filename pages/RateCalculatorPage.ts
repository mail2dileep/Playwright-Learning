import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(private readonly page: Page) {
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
  }

  /**
   * Selects the service type (Electric or Electric and Gas).
   * @param type 'electric' for Electric only, 'electric-gas' for Electric and Gas.
   */
  async selectServiceType(type: 'electric' | 'electric-gas'): Promise<void> {
    if (type === 'electric') {
      await this.electricServiceRadio.click();
    } else if (type === 'electric-gas') {
      await this.electricGasServiceRadio.click();
    } else {
      throw new Error(`Unknown service type: ${type}`);
    }
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param value The previous read value as a string.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters the current meter read value.
   * @param value The current read value as a string.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Enters the estimated electric use in kWh.
   * Note: This field may act as an input or display calculated usage depending on the application logic.
   * @param value The estimated electric use value as a string.
   */
  async enterEstimatedElectricUse(value: string): Promise<void> {
    await this.estimatedElectricUseInput.fill(value);
  }

  /**
   * Enters the estimated gas use in Ccf.
   * This field is typically disabled until 'Electric & Gas' service type is selected.
   * Note: This field may act as an input or display calculated usage depending on the application logic.
   * @param value The estimated gas use value as a string.
   */
  async enterEstimatedGasUse(value: string): Promise<void> {
    await this.estimatedGasUseInput.fill(value);
  }

  /**
   * Clicks the 'Calculate' button to compute results.
   */
  async calculateBill(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear all inputs and results.
   */
  async resetCalculator(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the current value of the previous read input field.
   * @returns The previous read value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the current read input field.
   * @returns The current read value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the estimated electric use input field.
   * @returns The estimated electric use value as a string.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the current value of the estimated gas use input field.
   * @returns The estimated gas use value as a string.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use input field is disabled.
   * @returns True if disabled, false otherwise.
   */
  async isEstimatedGasUseDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }
}