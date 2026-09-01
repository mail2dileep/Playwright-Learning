import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
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

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = this.page.getByLabel('Month');
    this.previousReadInput = this.page.getByLabel('Enter Previous Read:');
    this.currentReadInput = this.page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = this.page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = this.page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = this.page.locator('#e');
    this.electricGasServiceRadio = this.page.locator('#eg');
    this.howToReadBillButton = this.page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = this.page.locator('#howToFindUsageBtn');
    this.resetButton = this.page.locator('#rateCalCancelBtn');
    this.calculateButton = this.page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the specified URL for the rate calculator page.
   * @param url The URL to navigate to.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm03' for March).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Gets the currently selected month value from the dropdown.
   * @returns The value attribute of the currently selected option.
   */
  async getCurrentSelectedMonth(): Promise<string | null> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Enters the previous meter read value.
   * @param read The previous meter read value as a string.
   */
  async enterPreviousRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Gets the value from the previous meter read input field.
   * @returns The value of the previous read input field.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Enters the current meter read value.
   * @param read The current meter read value as a string.
   */
  async enterCurrentRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  /**
   * Gets the value from the current meter read input field.
   * @returns The value of the current read input field.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the estimated electric use (kWh) value.
   * @returns The estimated electric use value as a string.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use (Ccf) value.
   * @returns The estimated gas use value as a string.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use field is enabled.
   * @returns True if the field is enabled, false otherwise.
   */
  async isEstimatedGasUseFieldEnabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isEnabled();
  }

  /**
   * Selects the 'Electric Only' service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  /**
   * Checks if the 'Electric Only' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceSelected(): Promise<boolean> {
    return await this.electricServiceRadio.isChecked();
  }

  /**
   * Selects the 'Electric & Gas' service type radio button.
   */
  async selectElectricGasService(): Promise<void> {
    await this.electricGasServiceRadio.check();
  }

  /**
   * Checks if the 'Electric & Gas' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricGasServiceSelected(): Promise<boolean> {
    return await this.electricGasServiceRadio.isChecked();
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBillButton(): Promise<void> {
    await this.howToReadBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsageButton(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Performs a complete calculation workflow for electric usage.
   * @param monthValue The month value to select.
   * @param previousRead The previous meter read.
   * @param currentRead The current meter read.
   */
  async calculateElectricUsage(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
    await this.selectElectricService(); // Ensure Electric is selected
    await this.selectMonth(monthValue);
    await this.enterPreviousRead(previousRead);
    await this.enterCurrentRead(currentRead);
    await this.clickCalculateButton();
  }
}
