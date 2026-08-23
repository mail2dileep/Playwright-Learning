import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
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
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the calculator page.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a billing month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm03' for March).
   */
  async selectBillingMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The numeric string value for the previous read.
   */
  async enterPreviousMeterRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The numeric string value for the current read.
   */
  async enterCurrentMeterRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the service type (Electric or Electric/Gas).
   * @param type 'electric' or 'electric-gas'.
   */
  async selectServiceType(type: 'electric' | 'electric-gas'): Promise<void> {
    if (type === 'electric') {
      await this.electricServiceRadio.click();
    } else if (type === 'electric-gas') {
      await this.electricGasServiceRadio.click();
    }
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the estimated electric use (kWh) value.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUseKwh(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use (Ccf) field is disabled.
   * @returns True if the field is disabled, false otherwise.
   */
  async isEstimatedGasUseCcfDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Retrieves the current value of the previous meter read input.
   * @returns The current value of the previous meter read input as a string.
   */
  async getPreviousMeterReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the current meter read input.
   * @returns The current value of the current meter read input as a string.
   */
  async getCurrentMeterReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the currently selected month value from the dropdown.
   * @returns The value attribute of the selected month option (e.g., 'm06').
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.evaluate((node: HTMLSelectElement) => node.value);
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
}