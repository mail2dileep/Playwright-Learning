import { Page, Locator } from '@playwright/test';

export class EnergyCostCalculatorPage {
  private readonly page: Page;
  private readonly calculatorSection: Locator;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.calculatorSection = page.locator('#calculator_current');
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async isCalculatorSectionVisible(): Promise<Locator> {
    return this.calculatorSection;
  }

  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  async enterPreviousRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  async enterCurrentRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  async selectElectricAndGasServiceType(): Promise<void> {
    await this.electricGasServiceRadio.check();
  }

  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

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

  async isElectricServiceTypeSelected(): Promise<boolean> {
    return this.electricServiceRadio.isChecked();
  }

  async isElectricAndGasServiceTypeSelected(): Promise<boolean> {
    return this.electricGasServiceRadio.isChecked();
  }

  async isEstimatedGasUseFieldEnabled(): Promise<boolean> {
      return this.estimatedGasUseInput.isEnabled();
  }

  async getEstimatedGasUseFieldLocator(): Promise<Locator> {
      return this.estimatedGasUseInput;
  }

  async getMonthDropdownLocator(): Promise<Locator> {
      return this.monthDropdown;
  }

  async getPreviousReadInputLocator(): Promise<Locator> {
      return this.previousReadInput;
  }

  async getCurrentReadInputLocator(): Promise<Locator> {
      return this.currentReadInput;
  }

  async getEstimatedElectricUseInputLocator(): Promise<Locator> {
      return this.estimatedElectricUseInput;
  }
}