import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
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

  async navigateTo(): Promise<void> {
    // Assuming a relative path for the calculator page.
    // In a real framework, base URL would be configured in playwright.config.ts
    await this.page.goto('/calculator', { waitUntil: 'domcontentloaded' });
  }

  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  async selectServiceType(type: 'electric' | 'electricAndGas'): Promise<void> {
    if (type === 'electric') {
      await this.electricServiceRadioButton.click();
    } else if (type === 'electricAndGas') {
      await this.electricGasServiceRadioButton.click();
    } else {
      throw new Error('Invalid service type provided.');
    }
  }

  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  async getEstimatedGasUseValue(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  async isEstimatedElectricUseFieldEnabled(): Promise<boolean> {
    return await this.estimatedElectricUseInput.isEnabled();
  }

  async isEstimatedGasUseFieldEnabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isEnabled();
  }
  
  async isElectricServiceTypeSelected(): Promise<boolean> {
    return await this.electricServiceRadioButton.isChecked();
  }

  async isElectricGasServiceTypeSelected(): Promise<boolean> {
    return await this.electricGasServiceRadioButton.isChecked();
  }
}