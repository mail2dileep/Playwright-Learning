import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousMeterReadInput: Locator;
  private readonly currentMeterReadInput: Locator;
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
    this.monthDropdown = page.getByLabel('Month');
    this.previousMeterReadInput = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The value to enter into the 'Enter Previous Read:' field.
   */
  async enterPreviousMeterRead(readValue: string): Promise<void> {
    await this.previousMeterReadInput.fill(readValue);
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the current value from the 'Estimated Electric use (kWh):' field.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Selects a month from the Month dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The value to enter into the 'Enter Current Read:' field.
   */
  async enterCurrentMeterRead(readValue: string): Promise<void> {
    await this.currentMeterReadInput.fill(readValue);
  }

  /**
   * Selects the Electric service type radio button.
   */
  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  /**
   * Selects the Electric and Gas service type radio button.
   */
  async selectElectricAndGasServiceType(): Promise<void> {
    await this.electricGasServiceRadio.check();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }
}