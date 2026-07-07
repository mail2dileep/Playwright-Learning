import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseOutput: Locator;
  private readonly estimatedGasUseOutput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseOutput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseOutput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e'); // For 'E' radio button
    this.electricGasServiceRadio = page.locator('#eg'); // For 'EG' radio button
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the calculator page.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value of the month to select (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption({ value: monthValue });
  }

  /**
   * Enters the previous meter read value.
   * @param value The previous meter read value.
   */
  async enterPreviousRead(value: string | number): Promise<void> {
    await this.previousReadInput.fill(String(value));
  }

  /**
   * Enters the current meter read value.
   * @param value The current meter read value.
   */
  async enterCurrentRead(value: string | number): Promise<void> {
    await this.currentReadInput.fill(String(value));
  }

  /**
   * Selects the service type (Electric or Electric & Gas).
   * @param type The service type to select ('Electric' or 'Electric & Gas').
   */
  async selectServiceType(type: 'Electric' | 'Electric & Gas'): Promise<void> {
    switch (type) {
      case 'Electric':
        await this.electricServiceRadio.click();
        break;
      case 'Electric & Gas':
        await this.electricGasServiceRadio.click();
        break;
      default:
        throw new Error(`Invalid service type: ${type}`);
    }
  }

  /**
   * Clicks the 'Calculate' button to perform the calculation.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear all inputs and results.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the current value of the previous meter read input.
   * @returns The previous meter read value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the current meter read input.
   * @returns The current meter read value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the estimated electric use (kWh) displayed.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseOutput.inputValue();
  }

  /**
   * Retrieves the estimated gas use (Ccf) displayed.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseOutput.inputValue();
  }

  /**
   * Retrieves the value of the currently selected month in the dropdown.
   * @returns The value attribute of the selected option (e.g., 'm06').
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Checks if the estimated gas use field is enabled.
   * @returns True if the field is enabled, false otherwise.
   */
  async isEstimatedGasUseEnabled(): Promise<boolean> {
    return await this.estimatedGasUseOutput.isEnabled();
  }
}