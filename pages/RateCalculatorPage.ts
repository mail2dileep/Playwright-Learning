import { type Page, type Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseDisplay: Locator;
  private readonly estimatedGasUseDisplay: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricGasServiceRadioButton: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseDisplay = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseDisplay = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = page.locator('#e');
    this.electricGasServiceRadioButton = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
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
   * @param value The previous meter reading.
   */
  async enterPreviousMeterRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters the current meter read value.
   * @param value The current meter reading.
   */
  async enterCurrentMeterRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Selects the service type.
   * @param type The type of service to select ('Electric' or 'ElectricAndGas').
   */
  async selectServiceType(type: 'Electric' | 'ElectricAndGas'): Promise<void> {
    if (type === 'ElectricAndGas') {
      await this.electricGasServiceRadioButton.click();
    } else if (type === 'Electric') {
      await this.electricServiceRadioButton.click();
    }
  }

  /**
   * Clicks the Calculate button to perform the calculation.
   */
  async performCalculation(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the Reset button to clear inputs and results.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Gets the current value of the Estimated Electric use display.
   * @returns The estimated electric usage as a string.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseDisplay.inputValue();
  }

  /**
   * Gets the current value of the Estimated Gas use display.
   * @returns The estimated gas usage as a string.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    // Note: The gas consumption field is disabled based on locator metadata.
    // We can still read its value if it's set by the application logic.
    return await this.estimatedGasUseDisplay.inputValue();
  }

  /**
   * Gets the current value of the Previous Meter Read input field.
   * @returns The previous meter read value as a string.
   */
  async getPreviousMeterReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Gets the current value of the Current Meter Read input field.
   * @returns The current meter read value as a string.
   */
  async getCurrentMeterReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }
}