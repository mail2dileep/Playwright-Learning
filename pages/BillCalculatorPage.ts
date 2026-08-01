import { Page, Locator } from '@playwright/test';

export class BillCalculatorPage {
  private readonly page: Page;
  private readonly monthSelect: Locator;
  private readonly previousElectricMeterReadInput: Locator;
  private readonly currentElectricMeterReadInput: Locator;
  private readonly estimatedElectricUseKwhInput: Locator;
  private readonly estimatedGasUseCcfInput: Locator;
  private readonly electricOnlyServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthSelect = page.getByLabel('Month');
    this.previousElectricMeterReadInput = page.getByLabel('Enter Previous Read:');
    this.currentElectricMeterReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseKwhInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseCcfInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricOnlyServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the bill calculator page.
   * This method assumes a specific URL path or a base URL is configured.
   * @param url The URL path to navigate to, if different from the base.
   */
  async navigateToCalculatorPage(url: string = '/calculator'): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects the 'Electric only' service type option.
   */
  async selectElectricOnlyService(): Promise<void> {
    await this.electricOnlyServiceRadio.click();
  }

  /**
   * Enters a numeric value into the previous electric meter read field.
   * @param value The numeric value to enter.
   */
  async enterPreviousElectricMeterRead(value: string): Promise<void> {
    await this.previousElectricMeterReadInput.fill(value);
  }

  /**
   * Clicks the 'Calculate' button to compute bill details.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the current value from the 'Estimated Electric use (kWh)' field.
   * @returns The string value of the estimated electric use, or null if not found.
   */
  async getEstimatedElectricUseKwhValue(): Promise<string> {
    return await this.estimatedElectricUseKwhInput.inputValue();
  }

  /**
   * Retrieves the current value from the 'Enter Previous Read:' field.
   * @returns The string value of the previous electric meter read.
   */
  async getPreviousElectricMeterReadValue(): Promise<string> {
    return await this.previousElectricMeterReadInput.inputValue();
  }

  /**
   * Checks if the 'Enter Previous Read:' input field is enabled.
   * @returns True if enabled, false otherwise.
   */
  async isPreviousElectricMeterReadInputEnabled(): Promise<boolean> {
    return await this.previousElectricMeterReadInput.isEnabled();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf):' input field is disabled.
   * @returns True if disabled, false otherwise.
   */
  async isEstimatedGasUseCcfInputDisabled(): Promise<boolean> {
    return await this.estimatedGasUseCcfInput.isDisabled();
  }
}
