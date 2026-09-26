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
    this.monthDropdown = this.page.getByLabel('Month');
    this.previousReadInput = this.page.getByLabel('Enter Previous Read:');
    this.currentReadInput = this.page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = this.page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = this.page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = this.page.locator('#e');
    this.electricGasServiceRadio = this.page.locator('#eg');
    this.howToReadYourBillButton = this.page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = this.page.locator('#howToFindUsageBtn');
    this.resetButton = this.page.locator('#rateCalCancelBtn');
    this.calculateButton = this.page.locator('#validateMoveInBtn');
  }

  // Actions
  async selectBillingMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  async enterPreviousMeterRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  async enterCurrentMeterRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  async selectElectricGasServiceType(): Promise<void> {
    await this.electricGasServiceRadio.check();
  }

  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  async isEstimatedGasUseInputDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  async getSelectedBillingMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  async getPreviousMeterReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  async getCurrentMeterReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  // Workflow Methods
  async calculateElectricBill(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
    await this.selectBillingMonth(monthValue);
    await this.enterPreviousMeterRead(previousRead);
    await this.enterCurrentMeterRead(currentRead);
    await this.selectElectricServiceType();
    await this.clickCalculate();
  }

  async calculateElectricGasBill(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
    await this.selectBillingMonth(monthValue);
    await this.enterPreviousMeterRead(previousRead);
    await this.enterCurrentRead(currentRead);
    await this.selectElectricGasServiceType();
    await this.clickCalculate();
  }

  async resetCalculator(): Promise<void> {
    await this.clickReset();
  }
}