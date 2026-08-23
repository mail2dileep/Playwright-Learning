import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthSelect: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricGasServiceRadioButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthSelect = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // This field is disabled by default
    this.electricServiceRadioButton = page.locator('#e');
    this.electricGasServiceRadioButton = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm07' for July).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthSelect.selectOption(monthValue);
  }

  /**
   * Enters a value into the previous meter read input field.
   * @param read The previous meter read value as a string.
   */
  async enterPreviousRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Enters a value into the current meter read input field.
   * @param read The current meter read value as a string.
   */
  async enterCurrentRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  /**
   * Selects the type of service (Electric or Electric & Gas).
   * @param type The service type to select.
   */
  async selectServiceType(type: 'Electric' | 'Electric & Gas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceRadioButton.click();
    } else if (type === 'Electric & Gas') {
      await this.electricGasServiceRadioButton.click();
    }
  }

  /**
   * Clicks the 'Calculate' button to compute usage.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear all inputs.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  /**
   * Retrieves the current value of the estimated electric use input field.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the current value of the estimated gas use input field.
   * Note: This field is disabled by default and may only be enabled if 'Electric & Gas' service is selected.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Retrieves the current value of the previous meter read input field.
   * @returns The previous meter read value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the current meter read input field.
   * @returns The current meter read value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the currently selected value from the month dropdown.
   * @returns The value attribute of the selected month option as a string.
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this.monthSelect.inputValue();
  }
}
