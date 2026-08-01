import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  readonly page: Page;
  private readonly _monthDropdown: Locator;
  private readonly _previousReadInput: Locator;
  private readonly _currentReadInput: Locator;
  private readonly _estimatedElectricUseInput: Locator;
  private readonly _estimatedGasUseInput: Locator;
  private readonly _electricServiceRadio: Locator;
  private readonly _electricGasServiceRadio: Locator;
  private readonly _howToReadYourBillButton: Locator;
  private readonly _howToFindUsageButton: Locator;
  private readonly _resetButton: Locator;
  private readonly _calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this._monthDropdown = page.getByLabel('Month');
    this._previousReadInput = page.getByLabel('Enter Previous Read:');
    this._currentReadInput = page.getByLabel('Enter Current Read:');
    this._estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this._estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this._electricServiceRadio = page.locator('#e');
    this._electricGasServiceRadio = page.locator('#eg');
    this._howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this._howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this._resetButton = page.locator('#rateCalCancelBtn');
    this._calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the Rate Calculator page.
   * @param url The URL of the Rate Calculator page.
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this._monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param value The previous meter read.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this._previousReadInput.fill(value);
  }

  /**
   * Enters the current meter read value.
   * @param value The current meter read.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this._currentReadInput.fill(value);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this._electricServiceRadio.check();
  }

  /**
   * Selects the 'Electric & Gas' service type radio button.
   */
  async selectElectricGasService(): Promise<void> {
    await this._electricGasServiceRadio.check();
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
   * Gets the value of the 'Estimated Electric use (kWh)' input field.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this._estimatedElectricUseInput.inputValue();
  }

  /**
   * Gets the value of the 'Estimated Gas use (Ccf)' input field.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this._estimatedGasUseInput.inputValue();
  }

  /**
   * Gets the value of the 'Enter Previous Read' input field.
   * @returns The previous read value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this._previousReadInput.inputValue();
  }

  /**
   * Gets the value of the 'Enter Current Read' input field.
   * @returns The current read value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this._currentReadInput.inputValue();
  }
}
