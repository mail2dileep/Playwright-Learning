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

    // Initialize locators using recommendedLocator from catalog
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

  // Actions
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async selectBillingMonth(monthValue: string): Promise<void> {
    // monthValue should be one of the option values, e.g., 'm03' for March
    await this.monthDropdown.selectOption(monthValue);
  }

  async enterPreviousRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  async enterCurrentRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  async selectElectricService(): Promise<void> {
    await this.electricServiceRadioButton.check();
  }

  async selectElectricGasService(): Promise<void> {
    await this.electricGasServiceRadioButton.check();
  }

  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  // Getters for verification (used by test spec for assertions)
  async getSelectedMonth(): Promise<string> {
    return this.monthDropdown.inputValue();
  }

  async getPreviousReadValue(): Promise<string> {
    return this.previousReadInput.inputValue();
  }

  async getCurrentReadValue(): Promise<string> {
    return this.currentReadInput.inputValue();
  }

  async getEstimatedElectricUse(): Promise<string> {
    return this.estimatedElectricUseInput.inputValue();
  }

  async getEstimatedGasUse(): Promise<string> {
    return this.estimatedGasUseInput.inputValue();
  }

  async isEstimatedGasUseEnabled(): Promise<boolean> {
    return this.estimatedGasUseInput.isEnabled();
  }

  async isElectricServiceSelected(): Promise<boolean> {
    return this.electricServiceRadioButton.isChecked();
  }

  async isElectricGasServiceSelected(): Promise<boolean> {
    return this.electricGasServiceRadioButton.isChecked();
  }
}