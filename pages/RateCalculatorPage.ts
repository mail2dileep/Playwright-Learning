import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly howToReadBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(private page: Page) {
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.howToReadBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects a billing month from the dropdown.
   * @param monthValue The value of the month to select (e.g., 'm07' for July).
   */
  async selectBillingMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters a value into the Previous Read input field.
   * @param readValue The previous meter read value.
   */
  async enterPreviousMeterRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters a value into the Current Read input field.
   * @param readValue The current meter read value.
   */
  async enterCurrentMeterRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the 'Electric Only' service type radio button.
   */
  async selectServiceTypeElectricOnly(): Promise<void> {
    await this.electricServiceRadio.click();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectServiceTypeElectricAndGas(): Promise<void> {
    await this.electricGasServiceRadio.click();
  }

  /**
   * Clicks the 'Calculate' button to compute rates.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the estimated electric use value from its input field.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use input field is disabled.
   * @returns True if the field is disabled, false otherwise.
   */
  async isEstimatedGasUseDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Retrieves the estimated gas use value from its input field.
   * Note: This field is marked as disabled in the locator catalog.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Clicks the 'Reset' button to clear form fields.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the current value of the Previous Read input field.
   * @returns The previous meter read value as a string.
   */
  async getPreviousMeterReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the Current Read input field.
   * @returns The current meter read value as a string.
   */
  async getCurrentMeterReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the currently selected value of the Month dropdown.
   * @returns The selected month value as a string.
   */
  async getMonthDropdownValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }
}
