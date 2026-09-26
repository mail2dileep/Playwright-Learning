import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
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
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = page.locator('#e');
    this.electricGasServiceRadioButton = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm01' for January, 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters a value into the Previous Read input field.
   * @param read The previous meter reading as a string.
   */
  async enterPreviousRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Enters a value into the Current Read input field.
   * @param read The current meter reading as a string.
   */
  async enterCurrentRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
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
   * Clicks the 'Calculate' button to compute bill estimates.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear form fields.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBillButton(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsageButton(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  /**
   * Retrieves the current value from the 'Estimated Electric use (kWh)' input field.
   * @returns The estimated electric usage as a string.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the current value from the 'Estimated Gas use (Ccf)' input field.
   * @returns The estimated gas usage as a string.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Retrieves the current value from the 'Enter Previous Read' input field.
   * @returns The previous meter read as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the current value from the 'Enter Current Read' input field.
   * @returns The current meter read as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the value of the currently selected month option.
   * @returns The value attribute of the selected month as a string.
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf)' input field is disabled.
   * @returns True if the field is disabled, false otherwise.
   */
  async isEstimatedGasUseDisabled(): Promise<boolean> {
      return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Checks if the 'Electric' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceTypeSelected(): Promise<boolean> {
    return await this.electricServiceRadioButton.isChecked();
  }

  /**
   * Checks if the 'Electric & Gas' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricGasServiceTypeSelected(): Promise<boolean> {
    return await this.electricGasServiceRadioButton.isChecked();
  }
}