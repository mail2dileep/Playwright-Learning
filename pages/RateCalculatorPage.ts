import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
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
   * Enters a value into the 'Previous Read' input field.
   * @param value The previous meter reading.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters a value into the 'Current Read' input field.
   * @param value The current meter reading.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricGasServiceType(): Promise<void> {
    await this.electricGasServiceRadio.check();
  }

  /**
   * Clicks the 'Calculate' button to compute estimated usage.
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
   * Retrieves the current value from the 'Previous Read' input field.
   * @returns The string value of the 'Previous Read' input.
   */
  async getPreviousReadValue(): Promise<string> {
    return this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the current value from the 'Current Read' input field.
   * @returns The string value of the 'Current Read' input.
   */
  async getCurrentReadValue(): Promise<string> {
    return this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the current value from the 'Estimated Electric use (kWh)' input field.
   * @returns The string value of the estimated electric use.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the currently selected value from the 'Month' dropdown.
   * @returns The value attribute of the selected month option.
   */
  async getSelectedMonthValue(): Promise<string> {
    return this.monthDropdown.inputValue();
  }

  /**
   * Performs a complete calculation workflow by filling inputs, selecting service type, and clicking calculate.
   * @param previousRead The value for the previous meter reading.
   * @param currentRead The value for the current meter reading.
   * @param monthValue The value attribute of the month option (defaults to 'm06' for June).
   */
  async performCalculation(
    previousRead: string,
    currentRead: string,
    monthValue: string = 'm06'
  ): Promise<void> {
    await this.selectMonth(monthValue);
    await this.enterPreviousRead(previousRead);
    await this.enterCurrentRead(currentRead);
    await this.selectElectricServiceType(); 
    await this.clickCalculate();
  }
}
