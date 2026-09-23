import { Page, Locator } from '@playwright/test';

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
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Using recommendedLocator from catalog
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

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async selectBillingMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption({ value: monthValue });
  }

  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  async selectElectricService(): Promise<void> {
    await this.electricServiceRadio.click();
  }

  async selectElectricAndGasService(): Promise<void> {
    await this.electricGasServiceRadio.click();
  }

  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  async getEstimatedElectricUse(): Promise<string> {
    return this.estimatedElectricUseInput.inputValue();
  }

  async getEstimatedGasUse(): Promise<string> {
    return this.estimatedGasUseInput.inputValue();
  }

  async isEstimatedGasUseFieldEnabled(): Promise<boolean> {
    return this.estimatedGasUseInput.isEnabled();
  }

  async getPreviousReadValue(): Promise<string> {
    return this.previousReadInput.inputValue();
  }

  async getCurrentReadValue(): Promise<string> {
    return this.currentReadInput.inputValue();
  }

  async isElectricServiceSelected(): Promise<boolean> {
    return this.electricServiceRadio.isChecked();
  }

  async isElectricAndGasServiceSelected(): Promise<boolean> {
    return this.electricGasServiceRadio.isChecked();
  }

  async getSelectedMonth(): Promise<string> {
    return (await this.monthDropdown.evaluate((el: HTMLSelectElement) => el.value));
  }
}