import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  readonly page: Page;

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
   * Navigates to the specified URL.
   * @param url The URL to navigate to.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm07' for July).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param read The previous read value as a string.
   */
  async enterPreviousRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Enters the current meter read value.
   * @param read The current read value as a string.
   */
  async enterCurrentRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricAndGasServiceRadio.check();
  }

  /**
   * Clicks the 'Calculate' button to compute usage.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear the form fields.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the estimated electric use value from the input field.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use value from the input field.
   * Note: This field is disabled by default according to locator catalog.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Retrieves the value from the previous meter read input field.
   * @returns The previous read value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the value from the current meter read input field.
   * @returns The current read value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the currently selected month's value from the dropdown.
   * @returns The value attribute of the selected month option as a string.
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Checks if the 'Electric' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceSelected(): Promise<boolean> {
    return await this.electricServiceRadio.isChecked();
  }

  /**
   * Checks if the 'Electric and Gas' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricAndGasServiceSelected(): Promise<boolean> {
    return await this.electricAndGasServiceRadio.isChecked();
  }

  /**
   * Checks if the estimated gas use input field is enabled.
   * Note: This field is disabled by default according to locator catalog.
   * @returns True if enabled, false otherwise.
   */
  async isGasUseFieldEnabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isEnabled();
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