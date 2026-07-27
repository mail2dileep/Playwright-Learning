import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousElectricReadInput: Locator;
  private readonly currentElectricReadInput: Locator;
  private readonly estimatedElectricUsageDisplay: Locator;
  private readonly estimatedGasUsageInput: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricAndGasServiceRadioButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousElectricReadInput = page.getByLabel('Enter Previous Read:');
    this.currentElectricReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUsageDisplay = page.getByLabel('Estimated Electric use (kWh):');
    // The 'Estimated Gas use (Ccf):' field is initially disabled but the test implies it becomes enabled and takes input.
    this.estimatedGasUsageInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = page.locator('#e');
    this.electricAndGasServiceRadioButton = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricAndGasServiceType(): Promise<void> {
    await this.electricAndGasServiceRadioButton.click();
  }

  /**
   * Enters a value into the 'Enter Previous Read:' field.
   * @param read The previous meter reading.
   */
  async enterPreviousElectricRead(read: string): Promise<void> {
    await this.previousElectricReadInput.fill(read);
  }

  /**
   * Enters a value into the 'Enter Current Read:' field.
   * @param read The current meter reading.
   */
  async enterCurrentElectricRead(read: string): Promise<void> {
    await this.currentElectricReadInput.fill(read);
  }

  /**
   * Enters a value into the 'Estimated Gas use (Ccf):' field.
   * Assumes this field becomes enabled after selecting the 'Electric and Gas' service type.
   * @param use The estimated gas usage.
   */
  async enterEstimatedGasUse(use: string): Promise<void> {
    await this.estimatedGasUsageInput.fill(use);
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Checks if the 'Enter Previous Read:' field is enabled.
   * @returns True if the field is enabled, false otherwise.
   */
  async isPreviousElectricReadFieldEnabled(): Promise<boolean> {
    return this.previousElectricReadInput.isEnabled();
  }

  /**
   * Checks if the 'Enter Current Read:' field is enabled.
   * @returns True if the field is enabled, false otherwise.
   */
  async isCurrentElectricReadFieldEnabled(): Promise<boolean> {
    return this.currentElectricReadInput.isEnabled();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf):' field is enabled.
   * @returns True if the field is enabled, false otherwise.
   */
  async isEstimatedGasUseFieldEnabled(): Promise<boolean> {
    return this.estimatedGasUsageInput.isEnabled();
  }

  /**
   * Retrieves the current value from the 'Enter Previous Read:' field.
   * @returns The input value of the field.
   */
  async getPreviousElectricReadValue(): Promise<string> {
    return this.previousElectricReadInput.inputValue();
  }

  /**
   * Retrieves the current value from the 'Enter Current Read:' field.
   * @returns The input value of the field.
   */
  async getCurrentElectricReadValue(): Promise<string> {
    return this.currentElectricReadInput.inputValue();
  }

  /**
   * Retrieves the current value from the 'Estimated Gas use (Ccf):' field.
   * @returns The input value of the field.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return this.estimatedGasUsageInput.inputValue();
  }

  /**
   * Retrieves the current value from the 'Estimated Electric use (kWh):' display field.
   * @returns The input value of the display field.
   */
  async getEstimatedElectricUsageDisplayValue(): Promise<string> {
    return this.estimatedElectricUsageDisplay.inputValue();
  }
}