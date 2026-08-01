import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly previousMeterReadInput: Locator;
  private readonly currentMeterReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly calculateButton: Locator;
  private readonly monthSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators from catalog, preferring recommendedLocator
    this.monthSelect = page.getByLabel('Month');
    this.previousMeterReadInput = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to a specified URL.
   * @param url The URL to navigate to.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Enters a value into the Previous Meter Read field.
   * @param value The text value to enter.
   */
  async enterPreviousMeterRead(value: string): Promise<void> {
    await this.previousMeterReadInput.fill(value);
  }

  /**
   * Retrieves the current value of the Previous Meter Read field.
   * @returns The current value of the input field.
   */
  async getPreviousMeterReadValue(): Promise<string> {
    return await this.previousMeterReadInput.inputValue();
  }

  /**
   * Enters a value into the Current Meter Read field.
   * @param value The text value to enter.
   */
  async enterCurrentMeterRead(value: string): Promise<void> {
    await this.currentMeterReadInput.fill(value);
  }

  /**
   * Retrieves the current value of the Current Meter Read field.
   * @returns The current value of the input field.
   */
  async getCurrentMeterReadValue(): Promise<string> {
    return await this.currentMeterReadInput.inputValue();
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthSelect.selectOption(monthValue);
  }

  /**
   * Retrieves the current value of the Estimated Electric Use field.
   * @returns The current value of the input field.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }
}
