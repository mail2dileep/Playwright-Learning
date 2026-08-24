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
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousMeterReadInput = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the rate calculator page.
   */
  async goTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a billing month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm03' for March).
   */
  async selectBillingMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption({ value: monthValue });
  }

  /**
   * Enters the previous meter read value.
   * @param read The previous meter read value as a string.
   */
  async enterPreviousMeterRead(read: string): Promise<void> {
    await this.previousMeterReadInput.fill(read);
  }

  /**
   * Enters the current meter read value.
   * @param read The current meter read value as a string.
   */
  async enterCurrentMeterRead(read: string): Promise<void> {
    await this.currentMeterReadInput.fill(read);
  }

  /**
   * Selects the service type (Electric Only or Electric & Gas).
   * @param type 'E' for Electric Only, 'EG' for Electric & Gas.
   */
  async selectServiceType(type: 'E' | 'EG'): Promise<void> {
    if (type === 'E') {
      await this.electricServiceRadio.check();
    } else if (type === 'EG') {
      await this.electricGasServiceRadio.check();
    }
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the current value of the estimated electric use.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the current value of the estimated gas use.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use field is disabled.
   * @returns True if the field is disabled, false otherwise.
   */
  async isGasUseFieldDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Retrieves the currently selected billing month's value.
   * @returns The value attribute of the selected month option.
   */
  async getCurrentSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Retrieves the current value of the previous meter read input.
   * @returns The previous meter read as a string.
   */
  async getPreviousMeterReadValue(): Promise<string> {
    return await this.previousMeterReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the current meter read input.
   * @returns The current meter read as a string.
   */
  async getCurrentMeterReadValue(): Promise<string> {
    return await this.currentMeterReadInput.inputValue();
  }
}
