import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
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
    this._monthDropdown = this.page.getByLabel('Month');
    this._previousReadInput = this.page.getByLabel('Enter Previous Read:');
    this._currentReadInput = this.page.getByLabel('Enter Current Read:');
    this._estimatedElectricUseInput = this.page.getByLabel('Estimated Electric use (kWh):');
    this._estimatedGasUseInput = this.page.getByLabel('Estimated Gas use (Ccf):'); // Initially disabled based on catalog
    this._electricServiceRadio = this.page.locator('#e');
    this._electricGasServiceRadio = this.page.locator('#eg');
    this._howToReadYourBillButton = this.page.locator('#howToReadYourBillBtn');
    this._howToFindUsageButton = this.page.locator('#howToFindUsageBtn');
    this._resetButton = this.page.locator('#rateCalCancelBtn');
    this._calculateButton = this.page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page. (Assumes base URL is configured in Playwright config).
   * @param path The path to the rate calculator page, e.g., '/calculator'.
   */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The 'value' attribute of the month option, e.g., 'm07' for July.
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this._monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value into the corresponding input field.
   * @param readValue The numeric string value for the previous read.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this._previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value into the corresponding input field.
   * @param readValue The numeric string value for the current read.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this._currentReadInput.fill(readValue);
  }

  /**
   * Selects the service type using radio buttons.
   * @param type 'electric' for Electric only, 'electricAndGas' for Electric and Gas.
   */
  async selectServiceType(type: 'electric' | 'electricAndGas'): Promise<void> {
    switch (type) {
      case 'electric':
        await this._electricServiceRadio.check();
        break;
      case 'electricAndGas':
        await this._electricGasServiceRadio.check();
        break;
      default:
        throw new Error(`Invalid service type: ${type}`);
    }
  }

  /**
   * Clicks the 'Calculate' button to compute rates.
   */
  async clickCalculate(): Promise<void> {
    await this._calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear input fields.
   */
  async clickReset(): Promise<void> {
    await this._resetButton.click();
  }

  /**
   * Retrieves the estimated electric use (kWh) value from the output field.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return (await this._estimatedElectricUseInput.inputValue());
  }

  /**
   * Retrieves the estimated gas use (Ccf) value from the output field.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return (await this._estimatedGasUseInput.inputValue());
  }

  /**
   * Checks if the estimated gas consumption input field is currently enabled.
   * @returns True if the field is enabled, false otherwise.
   */
  async isGasConsumptionFieldEnabled(): Promise<boolean> {
    return await this._estimatedGasUseInput.isEnabled();
  }

  /**
   * Retrieves the 'value' attribute of the currently selected month in the dropdown.
   * @returns The selected month's value as a string.
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this._monthDropdown.inputValue();
  }

  /**
   * Retrieves the current value of the previous meter read input field.
   * @returns The current value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this._previousReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the current meter read input field.
   * @returns The current value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this._currentReadInput.inputValue();
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBill(): Promise<void> {
    await this._howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsage(): Promise<void> {
    await this._howToFindUsageButton.click();
  }
}
