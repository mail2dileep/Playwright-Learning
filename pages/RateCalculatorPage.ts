import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousMeterReadInput: Locator;
  private readonly currentMeterReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricGasServiceTypeRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousMeterReadInput = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.electricServiceTypeRadio = page.locator('#e');
    this.electricGasServiceTypeRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  async enterPreviousMeterRead(value: string): Promise<void> {
    await this.previousMeterReadInput.fill(value);
  }

  async enterCurrentMeterRead(value: string): Promise<void> {
    await this.currentMeterReadInput.fill(value);
  }

  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceTypeRadio.check();
  }

  async selectElectricGasServiceType(): Promise<void> {
    await this.electricGasServiceTypeRadio.check();
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
}
