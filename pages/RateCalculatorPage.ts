import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly _monthDropdown: Locator;
  private readonly _previousReadInput: Locator;
  private readonly _currentReadInput: Locator;
  private readonly _estimatedElectricUseOutput: Locator;
  private readonly _estimatedGasUseOutput: Locator;
  private readonly _electricServiceRadio: Locator;
  private readonly _electricGasServiceRadio: Locator;
  private readonly _calculateButton: Locator;
  private readonly _resetButton: Locator;

  constructor(private readonly page: Page) {
    this._monthDropdown = page.getByLabel('Month');
    this._previousReadInput = page.getByLabel('Enter Previous Read:');
    this._currentReadInput = page.getByLabel('Enter Current Read:');
    this._estimatedElectricUseOutput = page.getByLabel('Estimated Electric use (kWh):');
    this._estimatedGasUseOutput = page.getByLabel('Estimated Gas use (Ccf):');
    this._electricServiceRadio = page.locator('#e');
    this._electricGasServiceRadio = page.locator('#eg');
    this._calculateButton = page.locator('#validateMoveInBtn');
    this._resetButton = page.locator('#rateCalCancelBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the calculator page.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm07' for July).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this._monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The previous meter read.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this._previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter read.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this._currentReadInput.fill(readValue);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this._electricServiceRadio.check();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this._electricGasServiceRadio.check();
  }

  /**
   * Clicks the 'Calculate' button to compute usage.
   */
  async clickCalculate(): Promise<void> {
    await this._calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear form fields.
   */
  async clickReset(): Promise<void> {
    await this._resetButton.click();
  }

  /**
   * Retrieves the estimated electric use (kWh) value.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this._estimatedElectricUseOutput.inputValue();
  }

  /**
   * Retrieves the locator for the estimated electric use (kWh) output field.
   * This method is intended for assertions in the test spec.
   * @returns A Locator for the estimated electric use output field.
   */
  getEstimatedElectricUseLocator(): Locator {
    return this._estimatedElectricUseOutput;
  }

  /**
   * Retrieves the locator for the estimated gas use (Ccf) output field.
   * This method is intended for assertions in the test spec.
   * @returns A Locator for the estimated gas use output field.
   */
  getEstimatedGasUseLocator(): Locator {
    return this._estimatedGasUseOutput;
  }

  /**
   * Retrieves the current selected month value.
   * @returns The value attribute of the currently selected month option.
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this._monthDropdown.inputValue();
  }

  /**
   * Retrieves the current value of the previous read input field.
   * @returns The current value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this._previousReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the current read input field.
   * @returns The current value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this._currentReadInput.inputValue();
  }
}
