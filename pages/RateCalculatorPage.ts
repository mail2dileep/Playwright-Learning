import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel("Month");
    this.previousReadInput = page.getByLabel("Enter Previous Read:");
    this.currentReadInput = page.getByLabel("Enter Current Read:");
    this.estimatedElectricUseInput = page.getByLabel("Estimated Electric use (kWh):");
    this.estimatedGasUseInput = page.getByLabel("Estimated Gas use (Ccf):");
    this.electricServiceRadio = page.locator("#e"); // Corresponds to 'Electric' service type
    this.electricGasServiceRadio = page.locator("#eg"); // Corresponds to 'Electric & Gas' service type
    this.howToReadYourBillButton = page.locator("#howToReadYourBillBtn");
    this.howToFindUsageButton = page.locator("#howToFindUsageBtn");
    this.resetButton = page.locator("#rateCalCancelBtn");
    this.calculateButton = page.locator("#validateMoveInBtn");
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., "m09" for September).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters a value into the Previous Read input field.
   * @param value The previous meter reading.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters a value into the Current Read input field.
   * @param value The current meter reading.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  /**
   * Selects the 'Electric & Gas' service type radio button.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricGasServiceRadio.check();
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async calculateUsage(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear all fields.
   */
  async resetCalculator(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the value from the Estimated Electric use (kWh) field.
   * @returns The estimated electric usage as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the value from the Estimated Gas use (Ccf) field.
   * @returns The estimated gas usage as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Retrieves the currently selected month value.
   * @returns The value attribute of the selected month as a string.
   */
  async getSelectedMonth(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Retrieves the value from the Previous Read field.
   * @returns The previous meter read as a string.
   */
  async getPreviousRead(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the value from the Current Read field.
   * @returns The current meter read as a string.
   */
  async getCurrentRead(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Checks if the Estimated Gas use (Ccf) field is disabled.
   * @returns True if disabled, false otherwise.
   */
  async isEstimatedGasUseDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }
}