import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  readonly page: Page;
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
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // Disabled by default
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
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
   * @param monthValue The value attribute of the month option (e.g., 'm10' for October).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param read The previous meter read value as a string.
   */
  async enterPreviousRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Enters the current meter read value.
   * @param read The current meter read value as a string.
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
  async selectElectricGasService(): Promise<void> {
    await this.electricGasServiceRadio.check();
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
   * Retrieves the value of the 'Estimated Electric use (kWh)' input field.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the value of the 'Estimated Gas use (Ccf)' input field.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf)' input field is disabled.
   * @returns True if the input is disabled, false otherwise.
   */
  async isGasUseInputDisabled(): Promise<boolean> {
      return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Retrieves the currently selected value from the month dropdown.
   * @returns The value of the selected month option as a string.
   */
  async getSelectedMonth(): Promise<string> {
      return await this.monthDropdown.inputValue();
  }

  /**
   * Retrieves the value of the 'Enter Previous Read:' input field.
   * @returns The previous read value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the value of the 'Enter Current Read:' input field.
   * @returns The current read value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
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
  async isElectricGasServiceSelected(): Promise<boolean> {
    return await this.electricGasServiceRadio.isChecked();
  }
}
