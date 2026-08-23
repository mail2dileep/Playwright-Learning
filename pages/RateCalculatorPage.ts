import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUsageInput: Locator;
  private readonly estimatedGasUsageInput: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricGasServiceRadioButton: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using recommendedLocator from catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUsageInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUsageInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = page.locator('#e');
    this.electricGasServiceRadioButton = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the page.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm10' for October).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Gets the currently selected month value.
   * @returns The value attribute of the selected month option.
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The previous meter reading.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Gets the value of the previous meter read input.
   * @returns The string value of the previous meter read.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter reading.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Gets the value of the current meter read input.
   * @returns The string value of the current meter read.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Selects the Electric service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this.electricServiceRadioButton.click();
  }

  /**
   * Selects the Electric and Gas service type radio button.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricGasServiceRadioButton.click();
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
   * Gets the estimated electric usage value.
   * @returns The string value of the estimated electric usage.
   */
  async getEstimatedElectricUsage(): Promise<string> {
    return await this.estimatedElectricUsageInput.inputValue();
  }

  /**
   * Gets the estimated gas usage value.
   * @returns The string value of the estimated gas usage.
   */
  async getEstimatedGasUsage(): Promise<string> {
    return await this.estimatedGasUsageInput.inputValue();
  }

  /**
   * Checks if the estimated gas usage input is disabled.
   * @returns True if the input is disabled, false otherwise.
   */
  async isEstimatedGasUsageDisabled(): Promise<boolean> {
    return await this.estimatedGasUsageInput.isDisabled();
  }
}