import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricOnlyRadio: Locator;
  private readonly electricAndGasRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(private page: Page) {
    this.monthDropdown = this.page.getByLabel("Month");
    this.previousReadInput = this.page.getByLabel("Enter Previous Read:");
    this.currentReadInput = this.page.getByLabel("Enter Current Read:");
    this.estimatedElectricUseInput = this.page.getByLabel("Estimated Electric use (kWh):");
    this.estimatedGasUseInput = this.page.getByLabel("Estimated Gas use (Ccf):");
    this.electricOnlyRadio = this.page.locator("#e");
    this.electricAndGasRadio = this.page.locator("#eg");
    this.calculateButton = this.page.locator("#validateMoveInBtn");
    this.resetButton = this.page.locator("#rateCalCancelBtn");
  }

  /**
   * Selects the 'Electric only' service type radio button.
   */
  async selectServiceTypeElectricOnly(): Promise<void> {
    await this.electricOnlyRadio.click();
  }

  /**
   * Enters a value into the 'Enter Previous Read' field.
   * @param value The numeric value to enter.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters a value into the 'Enter Current Read' field.
   * @param value The numeric value to enter.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the current value from the 'Estimated Electric use (kWh)' field.
   * @returns The string value of the estimated electric use, or null if not present.
   */
  async getEstimatedElectricUse(): Promise<string | null> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf)' field is disabled.
   * @returns True if the field is disabled, false otherwise.
   */
  async isEstimatedGasUseFieldDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Checks if the 'Estimated Electric use (kWh)' field is enabled.
   * @returns True if the field is enabled, false otherwise.
   */
  async isEstimatedElectricUseFieldEnabled(): Promise<boolean> {
    return await this.estimatedElectricUseInput.isEnabled();
  }

  /**
   * Resets the form by clicking the 'Reset' button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Selects a month from the dropdown.
   * @param optionValue The value of the month option (e.g., 'm06' for June).
   */
  async selectMonth(optionValue: string): Promise<void> {
    await this.monthDropdown.selectOption(optionValue);
  }
}