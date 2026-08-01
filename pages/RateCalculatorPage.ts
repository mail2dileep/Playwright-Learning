import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly monthSelect: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricGasServiceTypeRadio: Locator;
  private readonly calculateButton: Locator;

  constructor(private page: Page) {
    this.monthSelect = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // This field is disabled, can only read value.
    this.electricServiceTypeRadio = page.locator('#e');
    this.electricGasServiceTypeRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the rate calculator.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthSelect.selectOption({ value: monthValue });
  }

  /**
   * Enters the previous meter read value.
   * @param value The previous meter read.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters the current meter read value.
   * @param value The current meter read.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectServiceTypeElectric(): Promise<void> {
    await this.electricServiceTypeRadio.check();
  }

  /**
   * Selects the 'Electric & Gas' service type radio button.
   */
  async selectServiceTypeElectricGas(): Promise<void> {
    await this.electricGasServiceTypeRadio.check();
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the estimated electric use (kWh).
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    // For a disabled input, inputValue() is still valid for reading its current value.
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use (Ccf).
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    // This field is disabled, so we can only read its current value.
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Performs a full calculation workflow for electric usage.
   * @param monthValue The value attribute of the month option.
   * @param previousRead The previous meter read value.
   * @param currentRead The current meter read value.
   */
  async calculateElectricUsage(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
    await this.selectMonth(monthValue);
    await this.enterPreviousRead(previousRead);
    await this.enterCurrentRead(currentRead);
    await this.selectServiceTypeElectric();
    await this.clickCalculate();
  }

  /**
   * Performs a full calculation workflow for electric and gas usage.
   * @param monthValue The value attribute of the month option.
   * @param previousRead The previous meter read value.
   * @param currentRead The current meter read value.
   */
  async calculateElectricAndGasUsage(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
    await this.selectMonth(monthValue);
    await this.enterPreviousRead(previousRead);
    await this.enterCurrentRead(currentRead);
    await this.selectServiceTypeElectricGas();
    await this.clickCalculate();
  }
}
