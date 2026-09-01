import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly serviceTypeElectricRadio: Locator;
  private readonly serviceTypeElectricGasRadio: Locator;
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
    this.serviceTypeElectricRadio = page.locator('#e');
    this.serviceTypeElectricGasRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectBillingMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter reading.
   * @param reading The previous meter reading value.
   */
  async enterPreviousMeterRead(reading: string): Promise<void> {
    await this.previousReadInput.fill(reading);
  }

  /**
   * Enters the current meter reading.
   * @param reading The current meter reading value.
   */
  async enterCurrentMeterRead(reading: string): Promise<void> {
    await this.currentReadInput.fill(reading);
  }

  /**
   * Selects the Electric service type.
   */
  async selectServiceTypeElectric(): Promise<void> {
    await this.serviceTypeElectricRadio.click();
  }

  /**
   * Selects the Electric and Gas service type.
   */
  async selectServiceTypeElectricAndGas(): Promise<void> {
    await this.serviceTypeElectricGasRadio.click();
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBillButton(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsageButton(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  /**
   * Retrieves the value of the estimated electric use input field.
   * @returns The string value of the estimated electric use.
   */
  async getEstimatedElectricUse(): Promise<string | null> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the value of the estimated gas use input field.
   * @returns The string value of the estimated gas use.
   */
  async getEstimatedGasUse(): Promise<string | null> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use input field is disabled.
   * @returns True if disabled, false otherwise.
   */
  async isEstimatedGasUseDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Gets the current selected month value.
   */
  async getSelectedMonth(): Promise<string | null> {
      return await this.monthDropdown.inputValue();
  }

  /**
   * Gets the current value of the previous read input.
   */
  async getPreviousReadValue(): Promise<string> {
      return await this.previousReadInput.inputValue();
  }

  /**
   * Gets the current value of the current read input.
   */
  async getCurrentReadValue(): Promise<string> {
      return await this.currentReadInput.inputValue();
  }

  /**
   * Fills out the meter reading form and calculates for Electric service.
   * @param monthValue The value attribute of the month option (e.g., 'm06').
   * @param previousRead The previous meter reading.
   * @param currentRead The current meter reading.
   */
  async calculateElectricServiceBill(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
    await this.selectBillingMonth(monthValue);
    await this.enterPreviousMeterRead(previousRead);
    await this.enterCurrentMeterRead(currentRead);
    await this.selectServiceTypeElectric();
    await this.clickCalculateButton();
  }

  /**
   * Fills out the meter reading form and calculates for Electric and Gas service.
   * @param monthValue The value attribute of the month option (e.g., 'm06').
   * @param previousRead The previous meter reading.
   * @param currentRead The current meter reading.
   */
  async calculateElectricAndGasServiceBill(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
    await this.selectBillingMonth(monthValue);
    await this.enterPreviousMeterRead(previousRead);
    await this.enterCurrentRead(currentRead);
    await this.selectServiceTypeElectricAndGas();
    await this.clickCalculateButton();
  }
}
