import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
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
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
  }

  /**
   * Navigates to the calculator page.
   * Assumes a base URL is configured in Playwright config.
   */
  async navigateTo(): Promise<void> {
    await this.page.goto('/calculator'); // Assuming a relative path
  }

  /**
   * Selects a billing month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm10' for October).
   */
  async selectBillingMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param read The previous meter read value as a string.
   */
  async enterPreviousMeterRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Enters the current meter read value.
   * @param read The current meter read value as a string.
   */
  async enterCurrentMeterRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  /**
   * Selects the Electric service type radio button.
   */
  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  /**
   * Selects the Electric and Gas service type radio button.
   * This method is included for completeness but not used in the example test.
   */
  async selectElectricGasServiceType(): Promise<void> {
    await this.electricGasServiceRadio.check();
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the Reset button.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Gets the estimated electric use value.
   * @returns The string value of the estimated electric use.
   */  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Gets the estimated gas use value.
   * @returns The string value of the estimated gas use.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Gets the previous meter read input value.
   * @returns The string value of the previous meter read.
   */
  async getPreviousMeterReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Gets the current meter read input value.
   * @returns The string value of the current meter read.
   */
  async getCurrentMeterReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Gets the currently selected billing month value.
   * @returns The value attribute of the currently selected month option.
   */
  async getSelectedBillingMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Checks if the estimated gas use field is disabled.
   * @returns True if the field is disabled, false otherwise.
   */
  async isEstimatedGasUseFieldDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }
}