import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousMeterReadInput: Locator;
  private readonly currentMeterReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricAndGasServiceRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(private page: Page) {
    this.monthDropdown = page.getByLabel('Month');
    this.previousMeterReadInput = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricAndGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  async enterPreviousMeterRead(read: string): Promise<void> {
    await this.previousMeterReadInput.fill(read);
  }

  async enterCurrentMeterRead(read: string): Promise<void> {
    await this.currentMeterReadInput.fill(read);
  }

  async selectServiceType(type: 'electric' | 'electricAndGas'): Promise<void> {
    if (type === 'electric') {
      await this.electricServiceRadio.check();
    } else if (type === 'electricAndGas') {
      await this.electricAndGasServiceRadio.check();
    }
  }

  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  async isEstimatedGasUseFieldDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  async getPreviousMeterRead(): Promise<string> {
    return await this.previousMeterReadInput.inputValue();
  }

  async getCurrentMeterRead(): Promise<string> {
    return await this.currentMeterReadInput.inputValue();
  }

  async getSelectedMonth(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }
}