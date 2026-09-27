import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousMeterReadInput: Locator;
  private readonly currentMeterReadInput: Locator;
  private readonly estimatedElectricUsageInput: Locator;
  private readonly estimatedGasUsageInput: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricGasServiceRadioButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousMeterReadInput = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUsageInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUsageInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = page.locator('#e');
    this.electricGasServiceRadioButton = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  // Actions
  async selectBillingMonth(month: string): Promise<void> {
    await this.monthDropdown.selectOption(month);
  }

  async enterPreviousMeterRead(read: string): Promise<void> {
    await this.previousMeterReadInput.fill(read);
  }

  async enterCurrentMeterRead(read: string): Promise<void> {
    await this.currentMeterReadInput.fill(read);
  }

  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadioButton.check();
  }

  async selectElectricGasServiceType(): Promise<void> {
    await this.electricGasServiceRadioButton.check();
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

  // Getters for verification
  async getEstimatedElectricUsage(): Promise<string> {
    return await this.estimatedElectricUsageInput.inputValue();
  }

  async getEstimatedGasUsage(): Promise<string> {
    return await this.estimatedGasUsageInput.inputValue();
  }

  async isGasUsageFieldDisabled(): Promise<boolean> {
    return await this.estimatedGasUsageInput.isDisabled();
  }

  async getPreviousMeterRead(): Promise<string> {
    return await this.previousMeterReadInput.inputValue();
  }

  async getCurrentMeterRead(): Promise<string> {
    return await this.currentMeterReadInput.inputValue();
  }

  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  async isElectricServiceTypeSelected(): Promise<boolean> {
    return await this.electricServiceRadioButton.isChecked();
  }

  // Workflow method
  async calculateElectricUsage(month: string, previousRead: string, currentRead: string): Promise<void> {
    await this.selectBillingMonth(month);
    await this.enterPreviousMeterRead(previousRead);
    await this.enterCurrentMeterRead(currentRead);
    await this.selectElectricServiceType();
    await this.clickCalculate();
  }
}