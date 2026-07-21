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
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseOutput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseOutput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the specified URL.
   * @param url The URL to navigate to.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm10' for October).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters a value into the previous meter read input field.
   * @param value The previous meter read value.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters a value into the current meter read input field.
   * @param value The current meter read value.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Selects the specified service type radio button.
   * @param type 'E' for Electric only, 'EG' for Electric and Gas.
   */
  async selectServiceType(type: 'E' | 'EG'): Promise<void> {
    if (type === 'E') {
      await this.electricServiceRadio.check();
    } else if (type === 'EG') {
      await this.electricGasServiceRadio.check();
    }
  }

  /**
   * Clicks the 'Calculate' button to trigger usage calculation.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear all inputs and results.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the current value of the previous meter read input field.
   * @returns The previous meter read value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the current meter read input field.
   * @returns The current meter read value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the estimated electric use (kWh) displayed.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return this.estimatedElectricUseOutput.inputValue();
  }

  /**
   * Retrieves the estimated gas use (Ccf) displayed.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return this.estimatedGasUseOutput.inputValue();
  }

  /**
   * Retrieves the value of the currently selected month in the dropdown.
   * @returns The selected month's value attribute as a string (e.g., 'm06').
   */
  async getSelectedMonthValue(): Promise<string> {
    return (await this.monthDropdown.evaluate((node: HTMLSelectElement) => node.value)).toString();
  }

  /**
   * Checks if the Electric service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceSelected(): Promise<boolean> {
    return this.electricServiceRadio.isChecked();
  }

  /**
   * Checks if the Electric and Gas service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricGasServiceSelected(): Promise<boolean> {
    return this.electricGasServiceRadio.isChecked();
  }
}