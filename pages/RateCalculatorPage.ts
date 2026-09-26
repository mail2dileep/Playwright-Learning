import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly _page: Page;
  private readonly _monthDropdown: Locator;
  private readonly _previousReadInput: Locator;
  private readonly _currentReadInput: Locator;
  private readonly _estimatedElectricUseInput: Locator;
  private readonly _estimatedGasUseInput: Locator;
  private readonly _electricServiceRadio: Locator;
  private readonly _electricGasServiceRadio: Locator;
  private readonly _calculateButton: Locator;
  private readonly _resetButton: Locator;
  private readonly _howToReadYourBillButton: Locator;
  private readonly _howToFindUsageButton: Locator;

  constructor(page: Page) {
    this._page = page;
    this._monthDropdown = page.getByLabel('Month');
    this._previousReadInput = page.getByLabel('Enter Previous Read:');
    this._currentReadInput = page.getByLabel('Enter Current Read:');
    this._estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this._estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this._electricServiceRadio = page.locator('#e');
    this._electricGasServiceRadio = page.locator('#eg');
    this._calculateButton = page.locator('#validateMoveInBtn');
    this._resetButton = page.locator('#rateCalCancelBtn');
    this._howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this._howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Selects a month from the month dropdown.
   * @param month The full name of the month (e.g., 'July').
   */
  async selectMonth(month: string): Promise<void> {
    await this._monthDropdown.selectOption({ label: month });
  }

  /**
   * Enters the previous meter read value.
   * @param read The previous meter read as a string.
   */
  async enterPreviousRead(read: string): Promise<void> {
    await this._previousReadInput.fill(read);
  }

  /**
   * Retrieves the value of the previous meter read input field.
   * @returns A promise that resolves to the previous meter read as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return this._previousReadInput.inputValue();
  }

  /**
   * Enters the current meter read value.
   * @param read The current meter read as a string.
   */
  async enterCurrentRead(read: string): Promise<void> {
    await this._currentReadInput.fill(read);
  }

  /**
   * Retrieves the value of the current meter read input field.
   * @returns A promise that resolves to the current meter read as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return this._currentReadInput.inputValue();
  }

  /**
   * Selects the service type (Electric or Electric/Gas).
   * @param type The service type: 'Electric' or 'ElectricGas'.
   */
  async selectServiceType(type: 'Electric' | 'ElectricGas'): Promise<void> {
    if (type === 'Electric') {
      await this._electricServiceRadio.click();
    } else if (type === 'ElectricGas') {
      await this._electricGasServiceRadio.click();
    } else {
      throw new Error(`Invalid service type: ${type}. Must be 'Electric' or 'ElectricGas'.`);
    }
  }

  /**
   * Clicks the 'Calculate' button to compute rates.
   */
  async clickCalculateButton(): Promise<void> {
    await this._calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear input fields.
   */
  async clickResetButton(): Promise<void> {
    await this._resetButton.click();
  }

  /**
   * Retrieves the estimated electric use in kWh.
   * @returns A promise that resolves to the estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return this._estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use in Ccf.
   * @returns A promise that resolves to the estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return this._estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use input field is disabled. Because it's disabled: true in the catalog
   * its value is expected to be '0' and it should be disabled if 'Electric' service is selected.
   * @returns A promise that resolves to a boolean indicating if the field is disabled.
   */
  async isEstimatedGasUseDisabled(): Promise<boolean> {
    return this._estimatedGasUseInput.isDisabled();
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
