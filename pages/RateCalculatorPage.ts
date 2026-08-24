import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricGasServiceRadioButton: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = page.locator('#e');
    this.electricGasServiceRadioButton = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the rate calculator page.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value of the month to select (e.g., 'm07' for July).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption({ value: monthValue });
  }

  /**
   * Enters the previous meter read value.
   * @param read The previous meter read as a string.
   */
  async enterPreviousRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Enters the current meter read value.
   * @param read The current meter read as a string.
   */
  async enterCurrentRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this.electricServiceRadioButton.check();
  }

  /**
   * Selects the 'Electric + Gas' service type radio button.
   */
  async selectElectricGasService(): Promise<void> {
    await this.electricGasServiceRadioButton.check();
  }

  /**
   * Clicks the 'Calculate' button to compute estimated usage.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the estimated electric use value.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use value.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use input field is disabled.
   * @returns True if the field is disabled, false otherwise.
   */
  async isEstimatedGasUseDisabled(): Promise<boolean> {
    return this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Clicks the 'Reset' button to clear the calculator fields.
   */
  async resetCalculator(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the value from the previous meter read input field.
   * @returns The previous meter read value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the value from the current meter read input field.
   * @returns The current meter read value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the currently selected value from the month dropdown.
   * @returns The selected month value as a string (e.g., 'm06').
   */
  async getSelectedMonthValue(): Promise<string> {
    return (await this.monthDropdown.evaluate((node: HTMLSelectElement) => node.value)).toString();
  }
}