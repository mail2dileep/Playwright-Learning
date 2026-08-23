import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricAndGasServiceTypeRadio: Locator;
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
    this.electricServiceTypeRadio = page.locator('#e');
    this.electricAndGasServiceTypeRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  async enterPreviousMeterRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  async enterCurrentMeterRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  async selectServiceTypeElectric(): Promise<void> {
    await this.electricServiceTypeRadio.check();
  }

  async selectServiceTypeElectricAndGas(): Promise<void> {
    await this.electricAndGasServiceTypeRadio.check();
  }

  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  async isEstimatedGasUseFieldDisabled(): Promise<boolean> {
    return !(await this.estimatedGasUseInput.isEnabled());
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

  // Locators exposed for specific assertions in test layer (e.g., reset checks)
  public get monthDropdownLocator(): Locator {
    return this.monthDropdown;
  }

  public get previousReadInputLocator(): Locator {
    return this.previousReadInput;
  }

  public get currentReadInputLocator(): Locator {
    return this.currentReadInput;
  }

  public get electricServiceTypeRadioLocator(): Locator {
    return this.electricServiceTypeRadio;
  }

  public get electricAndGasServiceTypeRadioLocator(): Locator {
    return this.electricAndGasServiceTypeRadio;
  }
}
