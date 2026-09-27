import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricAndGasServiceRadio: Locator;
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
    this.electricAndGasServiceRadio = page.locator('#eg');
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
   * Selects a month from the dropdown.
   * @param monthValue The value of the month to select (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The previous meter read value.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter read value.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the Electric service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  /**
   * Selects the Electric & Gas service type radio button.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricAndGasServiceRadio.check();
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button.
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
   * Gets the estimated electric use value.
   * @returns The string value of the estimated electric use.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Gets the estimated gas use value.
   * @returns The string value of the estimated gas use.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use input is disabled.
   * @returns True if disabled, false otherwise.
   */
  async isEstimatedGasUseDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Gets the value of the previous meter read input field.
   * @returns The string value of the previous meter read.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Gets the value of the current meter read input field.
   * @returns The string value of the current meter read.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Gets the currently selected month's value from the dropdown.
   * @returns The string value of the selected month (e.g., 'm06').
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Checks if the Electric service radio button is checked.
   * @returns True if checked, false otherwise.
   */
  async isElectricServiceChecked(): Promise<boolean> {
    return await this.electricServiceRadio.isChecked();
  }
}
