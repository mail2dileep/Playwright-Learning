import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator; // Disabled, but kept for completeness
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
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
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // Disabled
    this.electricServiceRadio = page.locator('#e'); // Recommended Locator based on ID
    this.electricGasServiceRadio = page.locator('#eg'); // Recommended Locator based on ID
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  // Actions
  async selectBillingMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  async enterPreviousMeterRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  async enterCurrentMeterRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  async setMeterReads(previousRead: string, currentRead: string): Promise<void> {
    await this.enterPreviousMeterRead(previousRead);
    await this.enterCurrentMeterRead(currentRead);
  }

  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  async selectElectricGasServiceType(): Promise<void> {
    await this.electricGasServiceRadio.check();
  }

  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  async navigateTo(url: string): Promise<void> {
      await this.page.goto(url);
  }

  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  async getSelectedMonthValue(): Promise<string> {
      // Use evaluate to get the selected option's value attribute
      return await this.monthDropdown.evaluate((select: HTMLSelectElement) => select.value);
  }

  async getPreviousReadValue(): Promise<string> {
      return await this.previousReadInput.inputValue();
  }

  async getCurrentReadValue(): Promise<string> {
      return await this.currentReadInput.inputValue();
  }

  async isElectricServiceSelected(): Promise<boolean> {
      return await this.electricServiceRadio.isChecked();
  }

  async isElectricGasServiceSelected(): Promise<boolean> {
      return await this.electricGasServiceRadio.isChecked();
  }

  async isGasConsumptionInputDisabled(): Promise<boolean> {
      return await this.estimatedGasUseInput.isDisabled();
  }
}