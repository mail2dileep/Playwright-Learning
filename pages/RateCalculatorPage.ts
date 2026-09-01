import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
  private readonly _page: Page;
  private readonly _monthDropdown: Locator;
  private readonly _previousReadInput: Locator;
  private readonly _currentReadInput: Locator;
  private readonly _estimatedElectricUseInput: Locator;
  private readonly _estimatedGasUseInput: Locator;
  private readonly _electricServiceRadio: Locator;
  private readonly _electricAndGasServiceRadio: Locator;
  private readonly _resetButton: Locator;
  private readonly _calculateButton: Locator;

  constructor(page: Page) {
    this._page = page;
    this._monthDropdown = page.getByLabel("Month");
    this._previousReadInput = page.getByLabel("Enter Previous Read:");
    this._currentReadInput = page.getByLabel("Enter Current Read:");
    this._estimatedElectricUseInput = page.getByLabel("Estimated Electric use (kWh):");
    this._estimatedGasUseInput = page.getByLabel("Estimated Gas use (Ccf):");
    this._electricServiceRadio = page.locator("#e");
    this._electricAndGasServiceRadio = page.locator("#eg");
    this._resetButton = page.locator("#rateCalCancelBtn");
    this._calculateButton = page.locator("#validateMoveInBtn");
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm07' for July).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this._monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter reading.
   * @param value The previous meter reading.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this._previousReadInput.fill(value);
  }

  /**
   * Enters the current meter reading.
   * @param value The current meter reading.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this._currentReadInput.fill(value);
  }

  /**
   * Selects the 'Electric' service type.
   */
  async selectElectricService(): Promise<void> {
    await this._electricServiceRadio.check();
  }

  /**
   * Selects the 'Electric and Gas' service type.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this._electricAndGasServiceRadio.check();
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculate(): Promise<void> {
    await this._calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickReset(): Promise<void> {
    await this._resetButton.click();
  }

  /**
   * Retrieves the currently selected month value from the dropdown.
   * @returns The value attribute of the selected month option (e.g., 'm07').
   */
  async getSelectedMonth(): Promise<string> {
    return await this._monthDropdown.inputValue();
  }

  /**
   * Retrieves the value of the 'Enter Previous Read' input field.
   * @returns The value of the previous meter read as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this._previousReadInput.inputValue();
  }

  /**
   * Retrieves the value of the 'Enter Current Read' input field.
   * @returns The value of the current meter read as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this._currentReadInput.inputValue();
  }

  /**
   * Retrieves the estimated electric use.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this._estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this._estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the 'Electric' service type radio button is selected.
   * @returns True if 'Electric' is selected, false otherwise.
   */
  async isElectricServiceSelected(): Promise<boolean> {
    return await this._electricServiceRadio.isChecked();
  }

  /**
   * Checks if the 'Electric and Gas' service type radio button is selected.
   * @returns True if 'Electric and Gas' is selected, false otherwise.
   */
  async isElectricAndGasServiceSelected(): Promise<boolean> {
    return await this._electricAndGasServiceRadio.isChecked();
  }

  /**
   * Checks if the gas usage field is disabled.
   * @returns True if the gas usage field is disabled, false otherwise.
   */
  async isGasUsageFieldDisabled(): Promise<boolean> {
    return !(await this._estimatedGasUseInput.isEnabled());
  }
}
