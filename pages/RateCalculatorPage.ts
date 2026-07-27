import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousElectricReadInput: Locator;
  private readonly currentElectricReadInput: Locator;
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
    this.previousElectricReadInput = page.getByLabel('Enter Previous Read:');
    this.currentElectricReadInput = page.getByLabel('Enter Current Read:');
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
   * Navigates to the rate calculator page.
   * @param url The URL of the page.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Enters the previous electric meter read.
   * @param readValue The value to enter.
   */
  async enterPreviousElectricMeterRead(readValue: string): Promise<void> {
    await this.previousElectricReadInput.fill(readValue);
  }

  /**
   * Retrieves the current value of the previous electric meter read input field.
   * @returns The current value as a string.
   */
  async getPreviousElectricMeterReadValue(): Promise<string> {
    return await this.previousElectricReadInput.inputValue();
  }

  /**
   * Enters the current electric meter read.
   * @param readValue The value to enter.
   */
  async enterCurrentElectricMeterRead(readValue: string): Promise<void> {
    await this.currentElectricReadInput.fill(readValue);
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value of the month to select (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Gets the selected month from the dropdown.
   * @returns The value of the selected month option.
   */
  async getSelectedMonth(): Promise<string> {
    return (await this.monthDropdown.inputValue());
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
  async selectElectricGasService(): Promise<void> {
    await this.electricGasServiceRadioButton.click();
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the Reset button.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Gets the estimated electric use (kWh) value.
   * @returns The estimated electric use value.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }
}