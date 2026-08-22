import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthSelect: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricAndGasServiceRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(private page: Page) {
    this.monthSelect = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricAndGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  async navigateTo(url: string): Promise<void> {
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

  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadio.click();
  }

  async selectElectricAndGasServiceType(): Promise<void> {
    await this.electricAndGasServiceRadio.click();
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

  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  async getEstimatedGasUseValue(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  async isEstimatedGasUseInputDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  async getSelectedMonthValue(): Promise<string> {
    return await this.monthSelect.inputValue();
  }

  async getPreviousReadInputValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  async getCurrentReadInputValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  // A getter for the calculate button can be exposed for direct visibility checks in tests if needed
  // For strict POM, assert on a business outcome rather than direct locator visibility
  // However, for initial page load checks, a locator visibility check is often pragmatic.
  get calculateButtonLocator(): Locator {
    return this.calculateButton;
  }

  get electricServiceRadioLocator(): Locator {
    return this.electricServiceRadio;
  }

  get electricAndGasServiceRadioLocator(): Locator {
    return this.electricAndGasServiceRadio;
  }

  get estimatedGasUseInputLocator(): Locator {
    return this.estimatedGasUseInput;
  }
}
