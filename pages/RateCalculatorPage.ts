import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricAndGasServiceRadio: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = this.page.getByLabel('Month');
    this.previousReadInput = this.page.getByLabel('Enter Previous Read:');
    this.currentReadInput = this.page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = this.page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = this.page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = this.page.locator('#e');
    this.electricAndGasServiceRadio = this.page.locator('#eg');
    this.resetButton = this.page.locator('#rateCalCancelBtn');
    this.calculateButton = this.page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the rate calculator page.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption({ value: monthValue });
  }

  /**
   * Enters the previous meter read value.
   * @param value The previous read value.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters the current meter read value.
   * @param value The current read value.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Selects the Electric service type radio button.
   */
  async selectServiceTypeElectric(): Promise<void> {
    await this.electricServiceRadio.click();
  }

  /**
   * Selects the Electric & Gas service type radio button.
   */
  async selectServiceTypeElectricAndGas(): Promise<void> {
    await this.electricAndGasServiceRadio.click();
  }

  /**
   * Clicks the Calculate button to initiate calculation.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the Reset button to clear all inputs and results.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Gets the value of the Estimated Electric use (kWh) field.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Gets the value of the Estimated Gas use (Ccf) field.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    // Note: The 'Estimated Gas use (Ccf):' field might be disabled initially. 
    // This method assumes it becomes readable/has a value after calculation with EG service type.
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Gets the current value of the Previous Read input field.
   * @returns The previous read value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Gets the current value of the Current Read input field.
   * @returns The current read value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }
}