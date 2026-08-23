import { Locator, Page } from '@playwright/test';

export class RateCalculatorPage {
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

  constructor(private page: Page) {
    this.monthDropdown = this.page.getByLabel('Month');
    this.previousReadInput = this.page.getByLabel('Enter Previous Read:');
    this.currentReadInput = this.page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = this.page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = this.page.getByLabel('Estimated Gas use (Ccf):');
    this.serviceTypeElectricRadio = this.page.locator('#e');
    this.serviceTypeElectricGasRadio = this.page.locator('#eg');
    this.howToReadYourBillButton = this.page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = this.page.locator('#howToFindUsageBtn');
    this.resetButton = this.page.locator('#rateCalCancelBtn');
    this.calculateButton = this.page.locator('#validateMoveInBtn');
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm07' for July).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value into the corresponding input field.
   * @param readValue The previous meter read value as a string.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value into the corresponding input field.
   * @param readValue The current meter read value as a string.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectServiceTypeElectric(): Promise<void> {
    await this.serviceTypeElectricRadio.check();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectServiceTypeElectricAndGas(): Promise<void> {
    await this.serviceTypeElectricGasRadio.check();
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear the calculator fields.
   */
  async resetCalculator(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'Calculate' button to compute the estimated usage.
   */
  async calculateBill(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Returns the Locator for the Estimated Electric use (kWh) input field.
   * This can be used in test specs for assertions.
   */
  getEstimatedElectricUse(): Locator {
    return this.estimatedElectricUseInput;
  }

  /**
   * Returns the Locator for the Estimated Gas use (Ccf) input field.
   * This can be used in test specs for assertions (e.g., checking disabled state).
   */
  getEstimatedGasUse(): Locator {
    return this.estimatedGasUseInput;
  }

  /**
   * Returns the Locator for the Month dropdown.
   * This can be used in test specs for assertions (e.g., checking selected value).
   */
  getMonthDropdown(): Locator {
    return this.monthDropdown;
  }

  /**
   * Returns the Locator for the Previous Read input field.
   * This can be used in test specs for assertions.
   */
  getPreviousReadInput(): Locator {
    return this.previousReadInput;
  }

  /**
   * Returns the Locator for the Current Read input field.
   * This can be used in test specs for assertions.
   */
  getCurrentReadInput(): Locator {
    return this.currentReadInput;
  }

  /**
   * Returns the Locator for the Electric service type radio button.
   * This can be used in test specs for assertions.
   */
  getServiceTypeElectricRadio(): Locator {
    return this.serviceTypeElectricRadio;
  }

  /**
   * Returns the Locator for the Electric and Gas service type radio button.
   * This can be used in test specs for assertions.
   */
  getServiceTypeElectricGasRadio(): Locator {
    return this.serviceTypeElectricGasRadio;
  }

}
