import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousMeterReadInput: Locator;
  private readonly currentMeterReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricOnlyRadio: Locator;
  private readonly electricAndGasRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using recommendedLocator from catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousMeterReadInput = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricOnlyRadio = page.locator('#e');
    this.electricAndGasRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  // Actions
  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters a value into the Previous Meter Read field.
   * @param value The meter read value to enter.
   */
  async enterPreviousMeterRead(value: string): Promise<void> {
    await this.previousMeterReadInput.fill(value);
  }

  /**
   * Enters a value into the Current Meter Read field.
   * @param value The meter read value to enter.
   */
  async enterCurrentMeterRead(value: string): Promise<void> {
    await this.currentMeterReadInput.fill(value);
  }

  /**
   * Enters a value into the Estimated Electric Use field.
   * @param value The estimated electric use value to enter.
   */
  async enterEstimatedElectricUse(value: string): Promise<void> {
    await this.estimatedElectricUseInput.fill(value);
  }

  /**
   * Selects the 'Electric Only' service type radio button.
   */
  async selectElectricOnlyService(): Promise<void> {
    await this.electricOnlyRadio.click();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricAndGasRadio.click();
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
   * Clicks the 'Reset' button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'Calculate' button to submit the form.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  // Getters for elements (for assertions in test spec)
  /**
   * Returns the Locator for the Previous Meter Read input field.
   */
  getPreviousMeterReadInput(): Locator {
    return this.previousMeterReadInput;
  }

  /**
   * Returns the Locator for the Estimated Gas Use input field.
   */
  getEstimatedGasUseInput(): Locator {
    return this.estimatedGasUseInput;
  }

  /**
   * Returns the Locator for the Estimated Electric Use input field.
   */
  getEstimatedElectricUseInput(): Locator {
    return this.estimatedElectricUseInput;
  }
}