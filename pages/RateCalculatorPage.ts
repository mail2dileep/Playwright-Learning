import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricGasServiceRadioButton: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(private page: Page) {
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = page.locator('#e'); // Using ID as recommendedLocator
    this.electricGasServiceRadioButton = page.locator('#eg'); // Using ID as recommendedLocator
    this.calculateButton = page.locator('#validateMoveInBtn'); // Using ID as recommendedLocator
    this.resetButton = page.locator('#rateCalCancelBtn'); // Using ID as recommendedLocator
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the rate calculator page.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a billing month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm07' for July).
   */
  async selectBillingMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption({ value: monthValue });
  }

  /**
   * Gets the currently selected value of the billing month dropdown.
   * @returns The value attribute of the selected month option.
   */
  async getSelectedBillingMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The previous meter read value as a string.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Gets the current value of the previous meter read input.
   * @returns The previous meter read value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter read value as a string.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Gets the current value of the current meter read input.
   * @returns The current meter read value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectServiceTypeElectric(): Promise<void> {
    await this.electricServiceRadioButton.check();
  }

  /**
   * Selects the 'Electric & Gas' service type radio button.
   */
  async selectServiceTypeElectricAndGas(): Promise<void> {
    await this.electricGasServiceRadioButton.check();
  }

  /**
   * Clicks the 'Calculate' button to compute usage.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear form fields.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Gets the estimated electric use value from the input field.
   * @returns The estimated electric use value as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Gets the estimated gas use value from the input field.
   * @returns The estimated gas use value as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the estimated electric use input field is enabled.
   * @returns True if enabled, false otherwise.
   */
  async isEstimatedElectricUseInputEnabled(): Promise<boolean> {
    return await this.estimatedElectricUseInput.isEnabled();
  }

  /**
   * Checks if the estimated gas use input field is enabled.
   * @returns True if enabled, false otherwise.
   */
  async isEstimatedGasUseInputEnabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isEnabled();
  }

  /**
   * Checks if the estimated gas use input field is disabled.
   * @returns True if disabled, false otherwise.
   */
  async isEstimatedGasUseInputDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }
}
