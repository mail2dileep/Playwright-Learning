import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseOutput: Locator;
  private readonly estimatedGasUseOutput: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricAndGasServiceRadioButton: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseOutput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseOutput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = page.locator('#e');
    this.electricAndGasServiceRadioButton = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
  }

  /**
   * Selects a month from the Month dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters a value into the Previous Read input field.
   * @param value The value to enter.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters a value into the Current Read input field.
   * @param value The value to enter.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Selects a service type radio button.
   * @param type The service type: 'Electric' or 'ElectricAndGas'.
   */
  async selectServiceType(type: 'Electric' | 'ElectricAndGas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceRadioButton.click();
    } else if (type === 'ElectricAndGas') {
      await this.electricAndGasServiceRadioButton.click();
    }
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Gets the estimated electric use value from the output field.
   * @returns The string value of the estimated electric use.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseOutput.inputValue();
  }

  /**
   * Gets the estimated gas use value from the output field.
   * @returns The string value of the estimated gas use.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseOutput.inputValue();
  }

  /**
   * Gets the value from the Previous Read input field.
   * @returns The string value of the Previous Read input.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Gets the value from the Current Read input field.
   * @returns The string value of the Current Read input.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Gets the currently selected value from the Month dropdown.
   * @returns The string value of the selected month option (e.g., 'm06').
   */
  async getMonthSelectedValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Checks if the 'Electric' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceTypeSelected(): Promise<boolean> {
    return await this.electricServiceRadioButton.isChecked();
  }

  /**
   * Checks if the 'Electric and Gas' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricAndGasServiceTypeSelected(): Promise<boolean> {
    return await this.electricAndGasServiceRadioButton.isChecked();
  }
}
