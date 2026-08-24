import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthSelect: Locator;
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
    this.monthSelect = page.getByLabel('Month');
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

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async selectMonth(monthValue: string): Promise<void> {
    await this.monthSelect.selectOption(monthValue);
  }

  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  async selectElectricService(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  async selectElectricGasService(): Promise<void> {
    await this.electricGasServiceRadio.check();
  }

  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  async getSelectedMonthValue(): Promise<string | null> {
    return await this.monthSelect.inputValue();
  }

  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  async isElectricServiceSelected(): Promise<boolean> {
    return await this.electricServiceRadio.isChecked();
  }

  async isElectricGasServiceSelected(): Promise<boolean> {
    return await this.electricGasServiceRadio.isChecked();
  }

  async isEstimatedElectricUseVisible(): Promise<boolean> {
    return await this.estimatedElectricUseInput.isVisible();
  }

  async isEstimatedGasUseEnabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isEnabled();
  }
}
