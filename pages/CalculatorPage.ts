import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousMeterReadInput: Locator;
  private readonly currentMeterReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricOnlyServiceRadio: Locator;
  private readonly electricAndGasServiceRadio: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousMeterReadInput = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricOnlyServiceRadio = page.locator('#e');
    this.electricAndGasServiceRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value of the month to select (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Selects the 'Electric only' service type option.
   */
  async selectElectricOnlyService(): Promise<void> {
    await this.electricOnlyServiceRadio.click();
  }

  /**
   * Selects the 'Electric & Gas' service type option.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricAndGasServiceRadio.click();
  }

  /**
   * Enters the previous meter read value.
   * @param value The numeric value to enter as a string.
   */
  async enterPreviousMeterRead(value: string): Promise<void> {
    await this.previousMeterReadInput.fill(value);
  }

  /**
   * Enters the current meter read value.
   * @param value The numeric value to enter as a string.
   */
  async enterCurrentMeterRead(value: string): Promise<void> {
    await this.currentMeterReadInput.fill(value);
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the locator for the previous meter read input field.
   * This method is intended for assertions in the test spec.
   */
  getPreviousMeterReadLocator(): Locator {
    return this.previousMeterReadInput;
  }

  /**
   * Retrieves the locator for the current meter read input field.
   * This method is intended for assertions in the test spec.
   */
  getCurrentMeterReadLocator(): Locator {
    return this.currentMeterReadInput;
  }

  /**
   * Retrieves the locator for the estimated electric use input field.
   * This method is intended for assertions in the test spec.
   */
  getEstimatedElectricUseLocator(): Locator {
    return this.estimatedElectricUseInput;
  }

  /**
   * Retrieves the locator for the estimated gas use input field.
   * This method is intended for assertions in the test spec.
   */
  getEstimatedGasUseLocator(): Locator {
    return this.estimatedGasUseInput;
  }

  /**
   * Retrieves the current value from the estimated electric use field.
   * @returns The string value of the estimated electric use.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }
}
